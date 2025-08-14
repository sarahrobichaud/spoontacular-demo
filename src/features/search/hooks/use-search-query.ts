import { useState } from 'react'
import { useAdvancedDebounce } from '../../../hooks/use-advanced-debounce'
import type { SearchQuery } from '../search-types'

export function useSearchQuery(debounceMs: number = 500): SearchQuery {
    const [query, setQuery] = useState('')

    const { debouncedValue: debouncedQuery, isDebouncing } = useAdvancedDebounce(
        query,
        debounceMs
    )

    const updateQuery = (newQuery: string) => {
        setQuery(newQuery.trim())
    }

    const clearQuery = () => {
        setQuery('')
    }

    return {
        query,
        debouncedQuery,
        isDebouncing,
        updateQuery,
        clearQuery
    }
}