import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSearchQuery } from './use-search-query'
import { useCuisineSelection } from './use-cuisine-selection'
import { useSearchExecution } from './use-search-execution'
import { useSearchResults } from './use-search-result'
import type { DetailedRecipe, GlobalSearchAPI, RecipeDetailsAPI, SearchDependencies, SearchFeature, SearchParams } from '../search-types'
import { recipeRepository } from '../data/recipe-repository'
import { searchService } from '../search-service'
import { urlSyncService } from '../url-sync-service'

export function useRecipeDetails(dependencies: SearchDependencies): RecipeDetailsAPI {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recipe, setRecipe] = useState<DetailedRecipe | null>(null)

    const getRecipeDetails = async (id: number) => {
        setIsLoading(true)
        try {
            const recipe = await dependencies.searchService.getRecipeDetails(id)
            setRecipe(recipe)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred')
        } finally {
            setIsLoading(false)
        }
        setIsLoading(false)
    }

    return {
        recipe,
        loading: isLoading,
        error,
        searchByID: getRecipeDetails
    }
}

export function useGlobalSearch(dependencies: SearchDependencies): GlobalSearchAPI {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [lastSearch, setLastSearch] = useState<SearchParams | null>(null)

    const queryHook = useSearchQuery(dependencies.debounceMs)
    const cuisineHook = useCuisineSelection(dependencies.debounceMs)
    const executionHook = useSearchExecution(dependencies.searchService)
    const resultsHook = useSearchResults()

    // Automatic Search
    useEffect(() => {
        setIsLoading(true)
        const hasSearchInput = queryHook.debouncedQuery.trim().length > 0 || cuisineHook.cuisineString.trim().length > 0
        const isStable = !queryHook.isDebouncing && !cuisineHook.isDebouncing

        const shouldSearch =
            hasSearchInput &&
            isStable && resultsHook.hasSearched && dependencies.urlSync.isOnSearchPage()

        if (shouldSearch) {
            executeSearch()
        }
    }, [queryHook.debouncedQuery, cuisineHook.cuisineString, queryHook.isDebouncing, cuisineHook.isDebouncing])

    useEffect(() => {
        if (!dependencies.urlSync.isOnSearchPage()) {
            navigate('/', { replace: true })
        }
    }, [resultsHook.results])

    // Sync with URL on mount
    useEffect(() => {
        const urlParams = dependencies.urlSync.getParamsFromURL()
        if (urlParams.query) {
            queryHook.updateQuery(urlParams.query)
        }
        if (urlParams.cuisines) {
            const cuisineArray = urlParams.cuisines.split(',').filter(Boolean)
            cuisineArray.forEach(cuisine => cuisineHook.selectCuisine(cuisine))
        }
    }, [])

    const executeSearch = async (page: number = 1) => {
        setIsLoading(true)

        const params = {
            query: queryHook.debouncedQuery,
            cuisines: cuisineHook.cuisineString,
            page: page,
            pageSize: dependencies.pageSize
        }

        const sameSearch = lastSearch && lastSearch.query === params.query && lastSearch.cuisines === params.cuisines && lastSearch.page === params.page

        if (sameSearch) {
            setIsLoading(false)
            return
        }

        try {
            // Update URL
            dependencies.urlSync.updateURL(params)

            // Execute search
            const results = await executionHook.executeSearch(params)
            setLastSearch(params)

            if (results) {
                resultsHook.setResults(results.recipes)
                resultsHook.setTotalResults(results.totalResults)
                resultsHook.setHasSearched(true)
                setIsLoading(false)
            }

        } catch (error) {
            // Error is handled by executionHook
            console.error('Search failed:', error)
            setIsLoading(false)
        }
    }

    // Computed properties
    const canSearch = queryHook.query.trim().length > 0
    const hasPendingChanges = executionHook.loading || isLoading || queryHook.isDebouncing || cuisineHook.isDebouncing;
    const cuisinesStringParam = cuisineHook.cuisines.join(',')

    return {
        // State
        query: queryHook.query,
        cuisines: cuisineHook.cuisines,
        results: resultsHook.results,
        loading: hasPendingChanges,
        error: executionHook.error,
        totalResults: resultsHook.totalResults,
        hasSearched: resultsHook.hasSearched,
        hasResults: resultsHook.hasResults,
        cuisineIsPending: cuisineHook.isDebouncing,
        queryIsPending: queryHook.isDebouncing,

        // Query actions
        updateQuery: queryHook.updateQuery,
        clearQuery: queryHook.clearQuery,

        // Cuisine actions
        selectCuisine: cuisineHook.selectCuisine,
        deselectCuisine: cuisineHook.deselectCuisine,
        toggleCuisine: cuisineHook.toggleCuisine,
        clearCuisines: cuisineHook.clearCuisines,
        hasCuisine: cuisineHook.hasCuisine,

        // Search actions
        executeSearch,
        clearResults: resultsHook.clearResults,
        clearError: executionHook.clearError,

        // Computed properties
        canSearch,
        cuisinesStringParam,
        hasAnyCuisines: cuisineHook.hasAnyCuisines
    }
}

export const PAGE_SIZE = 5
export function useSearchFeature(dependencies?: Partial<SearchDependencies>): SearchFeature {
    const navigate = useNavigate()
    const location = useLocation()

    const defaultDependencies = {
        searchService: searchService({ recipeRepository: recipeRepository() }),
        urlSync: urlSyncService({ navigate, location }),
        debounceMs: 1000,
        pageSize: PAGE_SIZE,
        ...dependencies
    }

    return {
        useGlobalSearch: useGlobalSearch.bind(null, defaultDependencies),
        useRecipeDetails: useRecipeDetails.bind(null, defaultDependencies)
    }
}