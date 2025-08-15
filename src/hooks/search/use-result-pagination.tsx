import { useState } from 'react';
import { useDebounce } from '../use-debounce';

export type PaginationInfo = {
	// Metadata
	currentPage: number;
	activePage: number;
	pendingPageChange: boolean;
	totalPages: number;
	canGoToNextPage: boolean;
	canGoToPreviousPage: boolean;
	offset: number;
	totalResults: number;
	isAvailable: boolean;

	// Public API
	handleNextPage: () => void;
	handlePreviousPage: () => void;
	reset: () => void;
};

export interface PaginationOptions {
	pageSize: number;
	totalResults: number;
	defaultPage: number;
}

export function usePagination({
	pageSize,
	totalResults,
	defaultPage,
}: PaginationOptions): PaginationInfo {
	const [currentPage, setCurrentPage] = useState(defaultPage);

	const {
		debouncedValue: activePage,
		isDebouncing: pendingPageChange,
		reset: resetActivePage,
	} = useDebounce(currentPage, 1000);

	const offset = (currentPage - 1) * pageSize;

	const totalPages = Math.ceil(totalResults / pageSize);

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const handlePreviousPage = () => {
		setCurrentPage(currentPage - 1);
	};

	const canGoToNextPage = currentPage < totalPages;

	const canGoToPreviousPage = currentPage > 1;

	const reset = () => {
		setCurrentPage(1);
		resetActivePage(1);
	};

	return {
		currentPage,
		activePage,
		pendingPageChange,
		reset,
		isAvailable: totalResults > pageSize,
		totalPages,
		canGoToNextPage,
		canGoToPreviousPage,
		handleNextPage,
		handlePreviousPage,
		offset,
		totalResults,
	};
}
