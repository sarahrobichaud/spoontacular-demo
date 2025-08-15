import type { DetailedRecipe } from '../../types/search-types';

interface RecipeHealthLabelsProps {
	recipe: DetailedRecipe;
}

export function RecipeHealthLabels({ recipe }: RecipeHealthLabelsProps) {
	const healthLabels = [
		...(recipe.diets || []),
		...[
			recipe.vegetarian ? 'Vegetarian' : null,
			recipe.vegan ? 'Vegan' : null,
			recipe.glutenFree ? 'Gluten-Free' : null,
			recipe.dairyFree ? 'Dairy-Free' : null,
		].filter(Boolean),
	];

	if (healthLabels.length === 0) {
		return null;
	}

	return (
		<div className='mb-6'>
			<h2 className='text-xl font-semibold mb-2'>Health Information</h2>
			<div className='flex flex-wrap gap-2'>
				{healthLabels.map((label: string | null, i: number) => {
					if (!label) return null;

					const capitalizedLabel = label
						.split(' ')
						.map(word => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');

					return (
						<span
							key={`${label || Math.random()}-${i}`}
							className='inline-flex items-center  px-3 py-1 rounded-full glassy-badge'
						>
							{capitalizedLabel}
						</span>
					);
				})}
			</div>
		</div>
	);
}
