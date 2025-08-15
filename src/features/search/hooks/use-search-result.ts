import { useState } from 'react';
import type { SearchResultsState } from '../search-types';
import type { Recipe } from '../search-types';

export function useSearchResults(): SearchResultsState & {
	setResults: (results: Recipe[]) => void;
	setTotalResults: (total: number) => void;
	setHasSearched: (hasSearched: boolean) => void;
} {
	const [results, setResults] = useState<Recipe[]>([]);
	const [totalResults, setTotalResults] = useState(0);
	const [hasSearched, setHasSearched] = useState(false);

	const hasResults = results.length > 0;

	const clearResults = () => {
		setResults([]);
		setTotalResults(0);
		setHasSearched(false);
	};

	return {
		results,
		totalResults,
		hasSearched,
		hasResults,
		setResults,
		setTotalResults,
		setHasSearched,
		clearResults,
	};
}
