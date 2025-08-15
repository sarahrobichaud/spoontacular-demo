import { useState } from 'react';
import { useDebounce } from '../use-debounce';
import type { SearchQuery } from '../../types/search-types';

export function useSearchQuery(debounceMs = 500): SearchQuery {
	const [query, setQuery] = useState('');

	const {
		debouncedValue: debouncedQuery,
		isDebouncing,
		reset,
	} = useDebounce(query, debounceMs);

	const updateQuery = (newQuery: string) => {
		setQuery(newQuery.trim());
	};

	const clearQuery = () => {
		setQuery('');
	};

	const resetQuery = (value: string) => {
		setQuery(value);
		reset(value);
	};

	return {
		query,
		debouncedQuery,
		isDebouncing,
		updateQuery,
		clearQuery,
		resetQuery,
	};
}
