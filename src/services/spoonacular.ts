import { fetchSpoonacular } from '../lib/spoon-api';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  servings: number;
  readyInMinutes: number;
  sourceName?: string;
  sourceUrl?: string;
  spoonacularScore?: number;
  healthScore?: number;
}

export interface DetailedRecipe extends Recipe {
  summary: string;
  instructions: string;
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        localizedName: string;
        image: string;
      }[];
    }[];
  }[];
  extendedIngredients: {
    id: number;
    aisle: string;
    image: string;
    name: string;
    amount: number;
    unit: string;
    unitShort: string;
    unitLong: string;
    originalString: string;
    metaInformation: string[];
  }[];
  diets: string[];
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

export interface RecipeSearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  maxReadyTime?: number;
  addRecipeInformation?: boolean
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  offset?: number;
  number?: number;
}

export interface RecipeSearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export async function complexSearch(params: RecipeSearchParams): Promise<RecipeSearchResponse> {
  return fetchSpoonacular<RecipeSearchResponse>('/recipes/complexSearch', params);
}

export async function getRecipeInformation(id: number): Promise<DetailedRecipe> {
  return fetchSpoonacular<DetailedRecipe>(`/recipes/${id}/information`, { includeNutrition: true });
}