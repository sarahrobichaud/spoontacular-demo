import type { PaginationInfo } from './hooks/use-result-pagination';

// Core search state
export interface SearchState {
	query: string;
	cuisines: string[];
	results: Recipe[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	hasSearched: boolean;
}

// Search parameters for API calls
export interface SearchParams {
	query: string;
	cuisines: string;
	page?: number;
}

// Search results with metadata
export interface SearchResults {
	recipes: Recipe[];
	totalResults: number;
	offset: number;
	hasMore: boolean;
}
export interface SearchRepository {
	search(params: SearchParams): Promise<SearchResults>;
	getRecipeDetails(id: number): Promise<DetailedRecipe>;
}

// Services
export interface SearchService {
	search(params: SearchParams): Promise<SearchResults>;
	getRecipeDetails(id: number): Promise<DetailedRecipe>;
}

export interface RecipeRepository {
	generalSearch(params: RecipeSearchParams): Promise<RecipeSearchResponse>;
	getDetails(id: number): Promise<DetailedRecipe>;
}

export interface SearchServiceDependencies {
	recipeRepository: RecipeRepository;
}

export interface SearchDependencies {
	searchService: SearchService;
	debounceMs?: number;
	pageSize?: number;
}

export interface SearchQuery {
	query: string;
	debouncedQuery: string;
	isDebouncing: boolean;
	updateQuery: (query: string) => void;
	clearQuery: () => void;
	resetQuery: (value: string) => void;
}

export interface CuisineSelection {
	cuisines: string[];
	cuisineString: string;
	debouncedCuisines: string[];
	isDebouncing: boolean;
	selectCuisine: (cuisine: string) => void;
	deselectCuisine: (cuisine: string) => void;
	toggleCuisine: (cuisine: string) => void;
	clearCuisines: () => void;
	hasCuisine: (cuisine: string) => boolean;
	hasAnyCuisines: boolean;
	resetCuisines: (values: string[]) => void;
}

export interface SearchExecution {
	loading: boolean;
	error: string | null;
	executeSearch: (params: SearchParams) => Promise<SearchResults | null>;
	clearError: () => void;
}

export interface SearchResultsState {
	results: Recipe[];
	totalResults: number;
	hasSearched: boolean;
	hasResults: boolean;
	clearResults: () => void;
}

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
	addRecipeInformation?: boolean;
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
// Main search hook API
export interface GlobalSearchAPI {
	// State
	query: string;
	cuisines: string[];
	debouncedQuery: string;
	debouncedCuisines: string[];
	results: Recipe[];
	loading: boolean;
	error: string | null;
	totalResults: number;
	hasSearched: boolean;
	hasResults: boolean;
	cuisineIsPending: boolean;
	queryIsPending: boolean;

	pagination: PaginationInfo;
	paginationIsAvailable: boolean;

	// Query actions
	updateQuery: (query: string) => void;
	clearQuery: () => void;

	// Cuisine actions
	selectCuisine: (cuisine: string) => void;
	deselectCuisine: (cuisine: string) => void;
	toggleCuisine: (cuisine: string) => void;
	clearCuisines: () => void;
	hasCuisine: (cuisine: string) => boolean;

	// Search actions
	executeSearch: (page?: number) => Promise<void>;
	syncSearchParams: (params: SearchParams) => Promise<void>;
	clearResults: () => void;
	clearError: () => void;

	// Computed properties
	canSearch: boolean;
	cuisinesStringParam: string;
	hasAnyCuisines: boolean;
}

export interface RecipeDetailsAPI {
	recipe: DetailedRecipe | null;
	loading: boolean;
	error: string | null;
	searchByID: (id: number) => Promise<void>;
}

export interface SearchFeature {
	useGlobalSearch: () => GlobalSearchAPI;
	useRecipeDetails: () => RecipeDetailsAPI;
}
