import {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
	useMemo,
} from 'react'
import { useDebounce } from '../hooks/use-debounce'
import { useLocation, useNavigate } from 'react-router'
import type { Recipe } from '../services/spoonacular'
import { LayoutState, useLayout } from './LayoutContext'
import { useSpoonSearch } from '../hooks/use-spoon-search'
import { useIsMobile } from '../hooks/use-mobile'

interface SearchContextType {
	searchTerm: string
	query: string
	queryHasChanged: boolean
	cuisineHasChanged: boolean
	cuisinesStringParam: string
	data: Recipe[]
	canSearch: boolean
	includeAllCuisines: boolean
	loading: boolean
	totalResults: number
	// Public API
	setSearchTerm: (term: string) => void
	handleSearch: (page?: number) => void
	hasCuisine: (cuisine: string) => boolean
	toggleCuisine: (cuisine: string) => void
	reset: () => void
	setExternalLoading: (loading: boolean) => void
}

const PAGE_SIZE = 5
const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
	const [searchTerm, setSearchTerm] = useState('')
	const [cuisines, setCuisines] = useState<string[]>([])
	const [externalLoading, setExternalLoading] = useState(false)

	const [cuisineQuery, cuisineQueryHasChanged, resetCuisineQuery] = useDebounce(
		cuisines,
		500
	)
	const [query, queryHasChanged, resetQuery] = useDebounce(searchTerm, 500)

	const [loadingOverride, setLoadingOverride] = useState(false)
	const { setLayoutState } = useLayout()
	const [autoSearch, setAutoSearch] = useState(false)
	const [data, setData] = useState<Recipe[]>([])
	const {
		loading,
		isInitialSearch,
		metadata,
		searchResults,
		reset,
		searchRecipes,
	} = useSpoonSearch()

	const showLoader =
		loading ||
		queryHasChanged ||
		loadingOverride ||
		externalLoading

	const hasSynced = useRef(false)
	const isMobile = useIsMobile()
	const isMountingRef = useRef(true)
	const navigate = useNavigate()
	const location = useLocation()

	const cuisineParam = useMemo(() => {
		const param = cuisineQuery.length > 0 ? cuisineQuery.join(',') : ''
		return param
	}, [cuisineQuery])

	const resetSearch = () => {
		setSearchTerm('')
		setAutoSearch(false)
		setCuisines([])
		resetCuisineQuery([])
		setLayoutState(LayoutState.CENTERED)
		reset()
		setData([])
		resetQuery('')
		setExternalLoading(false)
	}

	const canSearch = useMemo(() => {
		return searchTerm.trim() !== ''
	}, [searchTerm])

	// Auto Search
	useEffect(() => {
		const firstURLSync = isMobile && !hasSynced.current

		if (
			!autoSearch ||
			(isMobile && !firstURLSync) ||
			location.pathname !== '/' ||
			loading
		)
			return

		searchRecipes({
			query,
			page: 1,
			pageSize: PAGE_SIZE,
			cuisine: cuisineParam,
		})
	}, [query, autoSearch, cuisineParam, cuisineParam])

	// Update the results
	useEffect(() => {
		setData(searchResults)
		setLoadingOverride(false)
	}, [searchResults])

	const hasCuisine = (cuisine: string) => {
		return cuisines.includes(cuisine)
	}

	// Set the search term from the URL
	// Didn't have enough time, URL sync is a bit off
	// Not great
	useEffect(() => {
		const params = new URLSearchParams(location.search)
		const q = params.get('q')
		const c = params.get('cuisine')
		if (isMountingRef.current) {
			isMountingRef.current = false
			if (q && q !== searchTerm) {
				setLoadingOverride(true)
				setLayoutState(LayoutState.HEADER)
				setSearchTerm(q)
				if (c) {
					const cuisineArray = c
						.split(',')
						.map(item => item.trim().toLowerCase())
					setCuisines(cuisineArray)
				}
				setAutoSearch(true)
				navigate(
					`/?q=${encodeURIComponent(q)}&cuisine=${encodeURIComponent(c || '')}`,
					{ replace: true }
				)
			}
		}
	}, [])

	const toggleCuisine = (cuisine: string) => {
		if (cuisine === 'all') {
			setCuisines([])
		} else {
			setCuisines(prev => {
				const exists = prev.includes(cuisine)
				if (exists) {
					return prev.filter(c => c !== cuisine)
				}
				return [...prev, cuisine]
			})
		}
	}

	const handleSearch = (page: number = 1) => {
		if (location.pathname !== '/') {
			navigate(`/?q=${encodeURIComponent(searchTerm)}`, { replace: true })
		}
		console.log({ page })

		searchRecipes({
			query: searchTerm,
			page,
			pageSize: PAGE_SIZE,
			cuisine: cuisineParam,
		})
		if (isInitialSearch) {
			setLayoutState(LayoutState.HEADER)
			setAutoSearch(true)
		}
	}

	return (
		<SearchContext.Provider
			value={{
				searchTerm,
				setSearchTerm,
				query,
				toggleCuisine,
				queryHasChanged,
				cuisinesStringParam: cuisineParam,
				hasCuisine,
				cuisineHasChanged: cuisineQueryHasChanged,
				includeAllCuisines: cuisines.length === 0,
				canSearch,
				handleSearch,
				loading: showLoader,
				data,
				reset: resetSearch,
				totalResults: metadata.totalResults,
				setExternalLoading,
			}}
		>
			{children}
		</SearchContext.Provider>
	)
}

export function useSearch() {
	const context = useContext(SearchContext)
	if (context === undefined) {
		throw new Error('useSearch must be used within a SearchProvider')
	}
	return context
}

export { PAGE_SIZE }
