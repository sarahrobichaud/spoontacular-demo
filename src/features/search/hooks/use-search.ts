import { useEffect, useRef, useState } from 'react'
import { useSearchQuery } from './use-search-query'
import { useCuisineSelection } from './use-cuisine-selection'
import { useSearchExecution } from './use-search-execution'
import { useSearchResults } from './use-search-result'
import type { DetailedRecipe, GlobalSearchAPI, RecipeDetailsAPI, SearchDependencies, SearchFeature, SearchParams } from '../search-types'
import { recipeRepository } from '../data/recipe-repository'
import { searchService } from '../search-service'
import { useLocation, useSearchParams } from 'react-router'
import { usePagination } from './use-result-pagination'

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
    const [isLoading, setIsLoading] = useState(false)
    const [lastSearch, setLastSearch] = useState<SearchParams | null>(null)


    const queryHook = useSearchQuery(dependencies.debounceMs)
    const cuisineHook = useCuisineSelection(dependencies.debounceMs)
    const executionHook = useSearchExecution(dependencies.searchService)
    const resultsHook = useSearchResults()
    const location = useLocation();
    const [searchParams] = useSearchParams()

    const pagination = usePagination({
        pageSize: dependencies.pageSize || 5,
        totalResults: resultsHook.totalResults,
        defaultPage: Number(searchParams.get('page')) || 1
    })

    // Computed properties
    const paginationIsAvailable = pagination.isAvailable && queryHook.query.trim().length > 0
    const isSearchPage = location.pathname === '/search'
    const hasPendingChanges = executionHook.loading || isLoading || queryHook.isDebouncing || cuisineHook.isDebouncing
    const emptyInputs = queryHook.query.trim().length === 0 && cuisineHook.cuisineString.trim().length === 0
    const canSearch = !emptyInputs && (!isLoading || !isSearchPage)

    // Setup loading state
    useEffect(() => {
        if (queryHook.isDebouncing || cuisineHook.isDebouncing) {
            setIsLoading(true)
        }
    }, [queryHook.isDebouncing, cuisineHook.isDebouncing])

    // Execute search on page change
    useEffect(() => {
        if (canSearch) {
            executeSearch(pagination.activePage)
        }
    }, [pagination.activePage])

    // Automatic Search on changes
    useEffect(() => {
        const hasSearchInput = queryHook.debouncedQuery.trim().length > 0 || cuisineHook.cuisineString.trim().length > 0
        const isStable = !queryHook.isDebouncing && !cuisineHook.isDebouncing

        const shouldAutomaticallySearch = isSearchPage && hasSearchInput && isStable;

        if (!shouldAutomaticallySearch) {
            return;
        }

        setIsLoading(true)
        executeSearch(pagination.activePage)
    }, [queryHook.debouncedQuery, cuisineHook.cuisineString, queryHook.isDebouncing, cuisineHook.isDebouncing])

    const syncSearchParams = async (params: SearchParams) => {

        if (params.query.trim().length > 0) {
            queryHook.resetQuery(params.query)
        } else {
            queryHook.clearQuery()
        }

        if (params.cuisines.trim().length > 0) {
            cuisineHook.resetCuisines(params.cuisines.split(','))
        } else {
            cuisineHook.clearCuisines()
        }
    }

    const executeSearch = async (page: number = pagination.activePage) => {
        setIsLoading(true)

        const params = {
            query: queryHook.debouncedQuery,
            cuisines: cuisineHook.cuisineString,
            page: page,
            pageSize: dependencies.pageSize
        }
        const initialSearch = !lastSearch
        const sameQuery = lastSearch && lastSearch.query === params.query && lastSearch.cuisines === params.cuisines

        const shouldResetPagination = !sameQuery && !initialSearch

        if (shouldResetPagination) {
            params.page = 1;
        }

        const sameSearch = sameQuery && lastSearch.page === params.page
        const shouldAbort = emptyInputs || sameSearch

        if (shouldAbort) {
            setIsLoading(false)
            return
        }

        try {
            // Execute search
            const results = await executionHook.executeSearch(params)
            setLastSearch(params)

            if (results) {

                if (shouldResetPagination) {
                    pagination.reset()
                }

                resultsHook.setResults(results.recipes)
                resultsHook.setTotalResults(results.totalResults)
                resultsHook.setHasSearched(true)
                setIsLoading(false)
            }

        } catch (error) {
            console.error('Search failed:', error)
            setIsLoading(false)
        }
    }


    return {
        // State
        query: queryHook.query,
        cuisines: cuisineHook.cuisines,
        debouncedQuery: queryHook.debouncedQuery,
        debouncedCuisines: cuisineHook.debouncedCuisines,
        results: resultsHook.results,
        loading: hasPendingChanges,
        error: executionHook.error,
        totalResults: resultsHook.totalResults,
        hasSearched: resultsHook.hasSearched,
        hasResults: resultsHook.hasResults,
        cuisineIsPending: cuisineHook.isDebouncing,
        queryIsPending: queryHook.isDebouncing,
        pagination,

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
        syncSearchParams,
        clearResults: resultsHook.clearResults,
        clearError: executionHook.clearError,

        // Computed properties
        canSearch,
        paginationIsAvailable,
        cuisinesStringParam: cuisineHook.cuisineString,
        hasAnyCuisines: cuisineHook.hasAnyCuisines
    }
}

export const PAGE_SIZE = 5
export function useSearchFeature(dependencies?: Partial<SearchDependencies>): SearchFeature {

    const defaultDependencies = {
        searchService: searchService({ recipeRepository: recipeRepository() }),
        debounceMs: 500,
        pageSize: PAGE_SIZE,
        ...dependencies
    }

    return {
        useGlobalSearch: useGlobalSearch.bind(null, defaultDependencies),
        useRecipeDetails: useRecipeDetails.bind(null, defaultDependencies)
    }
}