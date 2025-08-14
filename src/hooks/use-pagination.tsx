import { useState } from 'react'
import { useDebounce } from './use-debounce'

export type PaginationInfo = {
	// Metadata
	currentPage: number
	activePage: number
	pendingPageChange: boolean
	totalPages: number
	canGoToNextPage: boolean
	canGoToPreviousPage: boolean
	offset: number
	totalResults: number
	isAvailable: boolean

	// Public API
	handleNextPage: () => void
	handlePreviousPage: () => void
	reset: () => void
}

export function usePagination(
	pageSize: number,
	totalResults: number
): PaginationInfo {
	const [currentPage, setCurrentPage] = useState(1)

	const [activePage, pendingPageChange, resetActivePage] = useDebounce(
		currentPage,
		1000
	)

	const offset = (currentPage - 1) * pageSize

	const totalPages = Math.ceil(totalResults / pageSize)

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1)
	}

	const handlePreviousPage = () => {
		setCurrentPage(currentPage - 1)
	}

	const canGoToNextPage = currentPage < totalPages

	const canGoToPreviousPage = currentPage > 1

	const reset = () => {
		setCurrentPage(1)
		resetActivePage(1)
	}

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
	}
}
