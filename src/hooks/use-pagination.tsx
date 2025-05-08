import { useState } from "react";
import { useDebounce } from "./use-debounce";


export function usePagination(pageSize: number, totalResults: number) {

  const [currentPage, setCurrentPage] = useState(1);

  const [activePage, pendingPageChange, resetActivePage] = useDebounce(currentPage, 300);

  const offset = (currentPage - 1) * pageSize;

  const totalPages = Math.ceil(totalResults / pageSize);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  }

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  }

  const canGoToNextPage = currentPage < totalPages;

  const canGoToPreviousPage = currentPage > 1;

  const reset = () => {
    setCurrentPage(1);
    resetActivePage(1);
  }

  return { currentPage, activePage, pendingPageChange, reset, totalPages, canGoToNextPage, canGoToPreviousPage, handleNextPage, handlePreviousPage, offset, totalResults};
}

