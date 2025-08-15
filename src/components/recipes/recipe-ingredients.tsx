import type { DetailedRecipe } from '../../features/search/search-types';

interface RecipeIngredientsProps {
    recipe: DetailedRecipe;
}

export function RecipeIngredients({ recipe }: RecipeIngredientsProps) {
    return (
        <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Ingredients</h2>
            <div className='bg-gray-700/50 p-4 rounded-lg'>
                <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {recipe.extendedIngredients.map((ingredient, index) => {
                        const capitalizedName = ingredient.name
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        return (
                            <li
                                key={`${ingredient.id}-${index}`}
                                className='flex items-start'
                            >
                                <img
                                    src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                                    alt={capitalizedName}
                                    className='w-10 h-10 object-cover rounded mr-3 mt-1'
                                    onError={e => {
                                        e.currentTarget.src = 'http://placehold.co/100x100';
                                    }}
                                />
                                <div>
                                    <span className='font-medium'>{capitalizedName}</span>
                                    <span className='text-gray-400 block'>
                                        {ingredient.amount} {ingredient.unit}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
