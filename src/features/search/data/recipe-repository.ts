import { mockDetailedRecipe, mockRecipes } from '../../../data/mockRecipes';
import { fetchSpoonacular } from '../../../lib/spoon-api'
import type { DetailedRecipe, RecipeRepository, RecipeSearchParams, RecipeSearchResponse } from '../search-types';

const DEBUG = true;

export const recipeRepository = (): RecipeRepository => {

	return {
		/**
		 * General search for recipes
		 * @param params - The search parameters
		 * @returns The search results
		 */
		async generalSearch(params: RecipeSearchParams): Promise<RecipeSearchResponse> {
			await new Promise(resolve => setTimeout(resolve, 1000))
			if (DEBUG) {
				const includes = mockRecipes.filter(recipe => {
					return recipe.title.toLowerCase().includes(params.query?.toLowerCase() ?? '')
				})
				const slicedRecipes = includes.slice(params.offset ?? 0, (params.offset ?? 0) + (params.number ?? 5))
				return {
					results: slicedRecipes,
					offset: params.offset ?? 0,
					number: slicedRecipes.length,
					totalResults: includes.length,
				}
			}
			return fetchSpoonacular<RecipeSearchResponse>(
				'/recipes/complexSearch',
				params
			)
		},
		/**
		 * Get the details of a recipe
		 * @param id - The ID of the recipe
		 * @returns The recipe details
		 */
		async getDetails(id: number): Promise<DetailedRecipe> {
			await new Promise(resolve => setTimeout(resolve, 1000))
			if (DEBUG) {
				return mockDetailedRecipe
			}
			return fetchSpoonacular<DetailedRecipe>(`/recipes/${id}/information`, {
				includeNutrition: true,
			})
		}
	}
}