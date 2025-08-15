import type { DetailedRecipe } from '../../features/search/search-types';

interface RecipeHeaderProps {
    recipe: DetailedRecipe;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
    return (
        <div className='relative'>
            <img
                src={recipe.image}
                alt={recipe.title}
                className='w-full h-80 object-cover brightness-50'
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                <h1 className='text-3xl font-bold text-white'>{recipe.title}</h1>
            </div>
        </div>
    );
}
