import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import { AVAILABLE_CUISINES } from '../data/cuisines'
import { useSearch } from '../contexts/SearchContext'

export const CuisineSelector = (props: HTMLAttributes<HTMLDivElement>) => {
	const { includeAllCuisines, hasCuisine, toggleCuisine } = useSearch()
	return (
		<div {...props}>
			<button
				type='button'
				className={clsx('glassy-badge', {
					active: includeAllCuisines,
					interactive: !includeAllCuisines,
				})}
				onClick={() => toggleCuisine('all')}
			>
				All Cuisines
			</button>
			{AVAILABLE_CUISINES.map(c => (
				<button
					key={c}
					type='button'
					className={clsx(
						'glassy-badge interactive min-h-[44px] min-w-[44px]',
						{
							active: hasCuisine(c.toLowerCase()) && !includeAllCuisines,
						}
					)}
					onClick={() => toggleCuisine(c.toLowerCase())}
				>
					{c}
				</button>
			))}
		</div>
	)
}
