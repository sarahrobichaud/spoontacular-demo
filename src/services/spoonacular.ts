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

export interface RecipeSearchParams {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;
  maxReadyTime?: number;
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