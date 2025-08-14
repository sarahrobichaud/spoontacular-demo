import { useState, useRef } from 'react'
import type { SearchService, SearchExecution, SearchParams, SearchResults } from '../search-types'

export function useSearchExecution(searchService: SearchService): SearchExecution {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const requestIdRef = useRef(0)

    const executeSearch = async (params: SearchParams): Promise<SearchResults | null> => {
        // Increment request ID to handle race conditions
        const currentRequestId = ++requestIdRef.current

        setLoading(true)
        setError(null)

        try {
            const results = await searchService.search(params)

            // Check if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                // Results will be handled by the composed hook
                return results;
            }

            return null;
        } catch (err) {
            // Only set error if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                const errorMessage = err instanceof Error ? err.message : 'Search failed'
                setError(errorMessage)
            }

            return null;
        } finally {
            // Only set loading false if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                setLoading(false)
            }
        }
    }

    const clearError = () => {
        setError(null)
    }

    return {
        loading,
        error,
        executeSearch,
        clearError
    }
}