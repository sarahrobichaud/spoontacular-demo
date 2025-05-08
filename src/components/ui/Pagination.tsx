import { LoaderCircle } from 'lucide-react'
import type { PaginationInfo } from '../../hooks/use-pagination'
import type { HTMLAttributes } from 'react'

export type PaginationProps = {
	pagination: PaginationInfo
} & HTMLAttributes<HTMLDivElement>

export function Pagination({ pagination, ...props }: PaginationProps) {
	return (
		<div {...props}>
			<div className='flex items-center gap-2 py-2'>
				<p className='text-gray-400'>
					Page {pagination.currentPage} of {pagination.totalPages}
				</p>
				{pagination.pendingPageChange && (
					<LoaderCircle className='w-4 h-4 animate-spin' />
				)}
			</div>
			<div className='flex gap-2 w-full'>
				<button
					type='button'
					onClick={pagination.handlePreviousPage}
					disabled={!pagination.canGoToPreviousPage}
					className='button w-full'
				>
					Previous
				</button>
				<button
					type='button'
					onClick={pagination.handleNextPage}
					disabled={!pagination.canGoToNextPage}
					className='button w-full'
				>
					Next
				</button>
			</div>
		</div>
	)
}
