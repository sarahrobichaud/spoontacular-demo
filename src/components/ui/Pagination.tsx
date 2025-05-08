export type PaginationProps = { 
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded border disabled:opacity-50"
        aria-label="Previous page"
      >
        Previous
      </button>
      
      <span className="mx-2">
        Page {currentPage} of {totalPages}
      </span>
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}