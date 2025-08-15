import type { DetailedRecipe } from '../../types/search-types';

interface RecipeSourceLinkProps {
	recipe: DetailedRecipe;
}

export function RecipeSourceLink({ recipe }: RecipeSourceLinkProps) {
	if (!recipe.sourceUrl) {
		return null;
	}

	return (
		<div className='mt-8 pt-4 border-t border-gray-200'>
			<a
				href={recipe.sourceUrl}
				target='_blank'
				rel='noopener noreferrer'
				className='text-blue-500 hover:underline inline-flex items-center'
			>
				<span>View original recipe</span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-4 w-4 ml-1'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<title>Open in new tab</title>
					<path
						fillRule='evenodd'
						d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
						clipRule='evenodd'
					/>
				</svg>
			</a>
		</div>
	);
}
