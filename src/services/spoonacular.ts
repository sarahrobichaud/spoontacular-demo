import { mockDetailedRecipe, mockRecipes } from '../data/mockRecipes';
import { fetchSpoonacular } from '../lib/spoon-api'

export interface Recipe {
	id: number
	title: string
	image: string
	imageType: string
	servings: number
	readyInMinutes: number
	sourceName?: string
	sourceUrl?: string
	spoonacularScore?: number
	healthScore?: number
}

export interface DetailedRecipe extends Recipe {
	summary: string
	instructions: string
	analyzedInstructions: {
		name: string
		steps: {
			number: number
			step: string
			ingredients: {
				id: number
				name: string
				localizedName: string
				image: string
			}[]
			equipment: {
				id: number
				name: string
				localizedName: string
				image: string
			}[]
		}[]
	}[]
	extendedIngredients: {
		id: number
		aisle: string
		image: string
		name: string
		amount: number
		unit: string
		unitShort: string
		unitLong: string
		originalString: string
		metaInformation: string[]
	}[]
	diets: string[]
	vegetarian: boolean
	vegan: boolean
	glutenFree: boolean
	dairyFree: boolean
}

export interface RecipeSearchParams {
	query?: string
	cuisine?: string
	diet?: string
	intolerances?: string
	includeIngredients?: string
	excludeIngredients?: string
	type?: string
	maxReadyTime?: number
	addRecipeInformation?: boolean
	sort?: string
	sortDirection?: 'asc' | 'desc'
	offset?: number
	number?: number
}

export interface RecipeSearchResponse {
	results: Recipe[]
	offset: number
	number: number
	totalResults: number
}

const DEBUG = true;

export async function complexSearch(
	params: RecipeSearchParams
): Promise<RecipeSearchResponse> {

	await new Promise(resolve => setTimeout(resolve, 1000))
	if (DEBUG) {
		const includes = mockRecipes.filter(recipe => {
			return recipe.title.toLowerCase().includes(params.query?.toLowerCase() ?? '')
		})
		console.log(includes)
		const slicedRecipes = includes.slice(params.offset ?? 0, (params.offset ?? 0) + (params.number ?? 5))
		console.log({ params })
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
}

export async function getRecipeInformation(
	id: number
): Promise<DetailedRecipe> {
	await new Promise(resolve => setTimeout(resolve, 1000))
	if (DEBUG) {
		return mockDetailedRecipe
	}
	return fetchSpoonacular<DetailedRecipe>(`/recipes/${id}/information`, {
		includeNutrition: true,
	})
}
