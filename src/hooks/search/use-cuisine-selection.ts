import { useState, useMemo } from 'react';
import { useDebounce } from '../use-debounce';
import type { CuisineSelection } from '../../types/search-types';

export function useCuisineSelection(debounceMs = 500): CuisineSelection {
	const [cuisines, setCuisines] = useState<string[]>([]);

	const {
		debouncedValue: debouncedCuisines,
		isDebouncing,
		reset,
	} = useDebounce(cuisines, debounceMs);

	const cuisineString = useMemo(() => {
		if (debouncedCuisines.length === 0) {
			return '';
		}
		return debouncedCuisines.join(',');
	}, [debouncedCuisines]);

	const selectCuisine = (cuisine: string) => {
		const normalizedCuisine = cuisine.toLowerCase().trim();
		setCuisines(prev => {
			if (prev.includes(normalizedCuisine)) {
				return prev; // Already selected
			}
			return [...prev, normalizedCuisine];
		});
	};

	const deselectCuisine = (cuisine: string) => {
		const normalizedCuisine = cuisine.toLowerCase().trim();
		setCuisines(prev => prev.filter(c => c !== normalizedCuisine));
	};

	const toggleCuisine = (cuisine: string) => {
		if (cuisine === 'all') {
			clearCuisines();
			return;
		}

		const normalizedCuisine = cuisine.toLowerCase().trim();
		setCuisines(prev => {
			if (prev.includes(normalizedCuisine)) {
				return prev.filter(c => c !== normalizedCuisine);
			}
			return [...prev, normalizedCuisine];
		});
	};

	const clearCuisines = () => {
		setCuisines([]);
	};

	const hasCuisine = (cuisine: string) => {
		return cuisines.includes(cuisine.toLowerCase().trim());
	};

	const hasAnyCuisines = cuisines.length > 0;

	const resetCuisines = (values: string[]) => {
		setCuisines(values);
		reset(values);
	};

	return {
		cuisines,
		cuisineString,
		debouncedCuisines,
		isDebouncing,
		selectCuisine,
		deselectCuisine,
		toggleCuisine,
		clearCuisines,
		hasCuisine,
		resetCuisines,
		hasAnyCuisines,
	};
}
