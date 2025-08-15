import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { AVAILABLE_CUISINES } from '../../data/cuisines';
import type { GlobalSearchAPI } from '../../features/search/search-types';

interface CuisineSelectorProps extends HTMLAttributes<HTMLDivElement> {
	search: GlobalSearchAPI;
}

export const CuisineSelector = ({ search, ...props }: CuisineSelectorProps) => {
	const { hasAnyCuisines, hasCuisine, toggleCuisine } = search;
	return (
		<div {...props}>
			<button
				type='button'
				className={clsx('glassy-badge', {
					active: !hasAnyCuisines,
					interactive: hasAnyCuisines,
				})}
				disabled={!hasAnyCuisines}
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
							active: hasCuisine(c.toLowerCase()),
						}
					)}
					onClick={() => toggleCuisine(c.toLowerCase())}
				>
					{c}
				</button>
			))}
		</div>
	);
};
