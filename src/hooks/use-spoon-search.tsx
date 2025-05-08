import { useState, useEffect, useCallback } from 'react';
import { complexSearch, type RecipeSearchResponse } from '../services/spoonacular';

interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  [key: string]: any;
}

// Mock data for development
const mockRecipes = [
  {
    id: 1,
    title: "Pasta Carbonara",
    image: "https://placehold.co/400x300",
    imageType: "jpg",
    servings: 4,
    readyInMinutes: 30,
    sourceName: "Food Blog",
    sourceUrl: "https://example.com/pasta-carbonara",
    spoonacularScore: 85,
    healthScore: 45
  },
  {
    id: 2,
    title: "Chicken Curry",
    image: "https://placehold.co/400x300",
    imageType: "jpg",
    servings: 6,
    readyInMinutes: 45,
    sourceName: "Curry House",
    sourceUrl: "https://example.com/chicken-curry",
    spoonacularScore: 90,
    healthScore: 70
  },
  {
    id: 3,
    title: "Vegetable Stir Fry",
    image: "https://placehold.co/400x300",
    imageType: "jpg",
    servings: 2,
    readyInMinutes: 20,
    sourceName: "Healthy Eats",
    sourceUrl: "https://example.com/veggie-stir-fry",
    spoonacularScore: 95,
    healthScore: 90
  },
  {
    id: 4,
    title: "Beef Tacos",
    image: "https://placehold.co/400x300",
    imageType: "jpg",
    servings: 4,
    readyInMinutes: 25,
    sourceName: "Mexican Kitchen",
    sourceUrl: "https://example.com/beef-tacos",
    spoonacularScore: 88,
    healthScore: 60
  },
  {
    id: 5,
    title: "Mushroom Risotto",
    image: "https://placehold.co/400x300",
    imageType: "jpg",
    servings: 4,
    readyInMinutes: 40,
    sourceName: "Italian Cuisine",
    sourceUrl: "https://example.com/mushroom-risotto",
    spoonacularScore: 92,
    healthScore: 75
  }
];

// Function to generate mock search response
const generateMockResponse = (query: string, offset: number, number: number): RecipeSearchResponse => {
  // Filter recipes based on query to simulate search
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );
  
  // Paginate results
  const paginatedResults = filteredRecipes.slice(offset, offset + number);
  
  return {
    results: paginatedResults,
    offset,
    number,
    totalResults: filteredRecipes.length
  };
};


export function useSpoonSearch() {
  const [results, setResults] = useState<RecipeSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const reset = () => {
    setResults(null);
    setLoading(false);
    setError(null);
    setIsInitialSearch(true);
  }

  const searchRecipes = useCallback(async ({ 
    query, 
    page = 1, 
    pageSize = 10,
  }: {query: string, page: number, pageSize: number, [key: string]: any}) => {
    if (!query?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * pageSize;
      
      const data = await complexSearch({ 
        query,
        offset,
        number: pageSize,
      });

      const mockresults = generateMockResponse(query, offset, pageSize);

      console.log(mockresults);
      
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsInitialSearch(false);
      setLoading(false);
    }
  }, []);

  return { 
    searchRecipes,
    loading, 
    error, 
    searchResults: results,
    isInitialSearch,
    reset
  };
}