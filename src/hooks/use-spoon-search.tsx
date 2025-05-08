import { useState, useEffect, useCallback } from 'react';
import { complexSearch, type RecipeSearchResponse } from '../services/spoonacular';
import type { Recipe } from '../services/spoonacular';
import { mockRecipes } from '../data/mockRecipes';

interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  [key: string]: any;
}

// Function to generate mock search response
const generateMockResponse = async (query: string, offset: number, number: number): Promise<RecipeSearchResponse> => {
  // Filter recipes based on query to simulate search
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );

  
  // Paginate results
  let paginatedResults: Recipe[] = [];
  if(filteredRecipes.length > 5) {
    paginatedResults = filteredRecipes.slice(offset, offset + number);
  } else {
    paginatedResults = filteredRecipes;
  }

  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    results: paginatedResults,
    offset,
    number,
    totalResults: filteredRecipes.length
  };
};


export function useSpoonSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialSearch, setIsInitialSearch] = useState(true);
  const [lastQuery, setLastQuery] = useState('');

  const [totalResults, setTotalResults] = useState<number | 0>(0);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState<Recipe[]>([]);


  const reset = () => {
    setResults([]);
    setLoading(false);
    setError(null);
    setIsInitialSearch(true);
  }

  const searchRecipes = async ({ 
    query, 
    page = 1, 
    pageSize = 10,
  }: {query: string, page: number, pageSize: number, [key: string]: any}) => {
    if (!query?.trim()) return;
    
    setLoading(true);

    if(query !== lastQuery) {
        setOffset(0);
    }

    setError(null);
    
    try {
      const offset = (page - 1) * pageSize;

      // If it gets out of sync, clip it 
      const maxOffset = totalResults ? totalResults - pageSize : null;
      if(maxOffset && offset > maxOffset) {
        setOffset(maxOffset);
      }
      
    //   const data = await complexSearch({ 
    //     query,
    //     offset,
    //     number: pageSize,
    //   });


      const mockData = await generateMockResponse(query, offset, pageSize);

      const { results, ...newMetadata } = mockData;
      
      setResults(results);
      setTotalResults(newMetadata.totalResults);
      setOffset(newMetadata.offset);
      setIsInitialSearch(false);
      setLastQuery(query);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }


  return { 
    searchRecipes,
    loading, 
    error, 
    searchResults: results,
    metadata: {
      totalResults,
      offset,
    },
    isInitialSearch,
    reset
  };
}