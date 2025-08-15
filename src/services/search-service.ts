import { mockDetailedRecipe, mockRecipes } from '../data/mock-recipes';
import { env } from '../env';
import type {
	DetailedRecipe,
	Recipe,
	RecipeSearchResponse,
	SearchParams,
	SearchResults,
	SearchService,
	SearchServiceDependencies,
} from '../types/search-types';

/**
 * A Debug function to generate mock responses for the search service
 * @param query
 * @param offset
 * @param number
 * @returns
 */
const generateMockResponse = async (
	query: string,
	offset: number,
	number: number
): Promise<RecipeSearchResponse> => {
	const filteredRecipes = mockRecipes.filter(recipe =>
		recipe.title.toLowerCase().includes(query.toLowerCase())
	);

	let paginatedResults: Recipe[] = [];
	if (filteredRecipes.length > 5) {
		paginatedResults = filteredRecipes.slice(offset, offset + number);
	} else {
		paginatedResults = filteredRecipes;
	}

	await new Promise(resolve => setTimeout(resolve, 1000));
	return {
		results: paginatedResults,
		offset,
		number,
		totalResults: filteredRecipes.length,
	};
};

export const searchService = (
	dependencies: SearchServiceDependencies
): SearchService => {
	const { recipeRepository } = dependencies;

	return {
		/**
		 * Search for recipes
		 * @param params - The search parameters
		 * @returns The search results
		 */
		async search(params: SearchParams): Promise<SearchResults> {
			const { query, cuisines, page = 1 } = params;
			const pageSize = 5;

			// Don't search if no query or cuisines
			if (!query.trim() && !cuisines.trim()) {
				return {
					recipes: [],
					totalResults: 0,
					offset: 0,
					hasMore: false,
				};
			}

			const offset = (page - 1) * pageSize;

			let response: RecipeSearchResponse;

			if (!env.useMockData) {
				console.log('Hitting Complex Search Endpoint');
				response = await recipeRepository.generalSearch({
					query: query.trim(),
					offset,
					number: pageSize,
					addRecipeInformation: true,
					cuisine: cuisines,
				});
			} else {
				response = await generateMockResponse(query, offset, pageSize);
			}

			return {
				recipes: response.results,
				totalResults: response.totalResults,
				offset: response.offset,
				hasMore:
					response.offset + response.results.length < response.totalResults,
			};
		},
		/**
		 * Get the details of a recipe
		 * @param id - The ID of the recipe
		 * @returns The recipe details
		 */
		async getRecipeDetails(id: number): Promise<DetailedRecipe> {
			if (!env.useMockData) {
				console.log('Hitting Details Endpoint');
				return recipeRepository.getDetails(id);
			}
			return mockDetailedRecipe;
		},
	};
};
