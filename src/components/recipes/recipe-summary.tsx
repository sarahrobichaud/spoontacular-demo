import type { DetailedRecipe } from '../../features/search/search-types';

interface RecipeSummaryProps {
    recipe: DetailedRecipe;
}

export function RecipeSummary({ recipe }: RecipeSummaryProps) {
    return (
        <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-2'>Summary</h2>
            {/*This is safe*/}
            <div
                className='text-gray-400'
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
        </div>
    );
}
