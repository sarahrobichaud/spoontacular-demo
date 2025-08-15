import { Link } from 'react-router';
import type { GlobalSearchAPI } from '../../types/search-types';

interface RecipeBackButtonProps {
	search: GlobalSearchAPI;
	searchParams: URLSearchParams;
}

export function RecipeBackButton({
	search,
	searchParams,
}: RecipeBackButtonProps) {
	const BackIcon = () => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-5 w-5 mr-1'
			viewBox='0 0 20 20'
			fill='currentColor'
		>
			<title>Back</title>
			<path
				fillRule='evenodd'
				d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
				clipRule='evenodd'
			/>
		</svg>
	);

	if (search.query && search.totalResults >= 1) {
		return (
			<Link
				to={`/search?query=${search.query}&cuisines=${search.cuisinesStringParam}&page=${searchParams.get('pageRef') ?? 1}`}
				className='button mb-4 inline-block gap-2'
			>
				<div className='flex items-center gap-2'>
					<BackIcon />
					<span>Back to {search.totalResults} results</span>
				</div>
			</Link>
		);
	}

	return (
		<a
			href='/'
			className='button mb-4 inline-block gap-2'
		>
			<div className='flex items-center gap-2'>
				<BackIcon />
				<span>Back to search</span>
			</div>
		</a>
	);
}
