import type { DetailedRecipe } from '../../features/search/search-types';

interface RecipeMetricsProps {
    recipe: DetailedRecipe;
}

export function RecipeMetrics({ recipe }: RecipeMetricsProps) {
    return (
        <div className='flex flex-wrap gap-2 mb-6'>
            <span className='glassy-badge'>⏱️ {recipe.readyInMinutes} mins</span>
            <span className='glassy-badge'>
                ❤️ {recipe.healthScore}% Health Score
            </span>
            <span className='glassy-badge'>👥 {recipe.servings} servings</span>
        </div>
    );
}
