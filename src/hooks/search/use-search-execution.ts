import { useState, useRef } from 'react';
import type {
	SearchService,
	SearchExecution,
	SearchParams,
	SearchResults,
} from '../../types/search-types';

export function useSearchExecution(
	searchService: SearchService
): SearchExecution {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const requestIdRef = useRef(0);

	const executeSearch = async (
		params: SearchParams
	): Promise<SearchResults | null> => {
		const currentRequestId = ++requestIdRef.current;

		setLoading(true);

		setError(null);

		try {
			const results = await searchService.search(params);

			if (currentRequestId === requestIdRef.current) {
				return results;
			}

			return null;
		} catch (err) {
			if (currentRequestId === requestIdRef.current) {
				const errorMessage =
					err instanceof Error ? err.message : 'Search failed';
				setError(errorMessage);
			}

			return null;
		} finally {
			if (currentRequestId === requestIdRef.current) {
				setLoading(false);
			}
		}
	};

	const clearError = () => {
		setError(null);
	};

	return {
		loading,
		error,
		executeSearch,
		clearError,
	};
}
