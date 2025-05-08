import { useState, } from 'react';
import { complexSearch, type RecipeSearchResponse } from '../services/spoonacular';
import type { Recipe } from '../services/spoonacular';
import { mockRecipes } from '../data/mockRecipes';
import { useLocation, useNavigate } from 'react-router';


const generateMockResponse = async (query: string, offset: number, number: number): Promise<RecipeSearchResponse> => {
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );

  
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

  const navigate = useNavigate();

  const pathname = useLocation().pathname;

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

    if(pathname !== '/') {
        const searchParams = new URLSearchParams();
        searchParams.set('q', query);
        navigate(`/?${searchParams.toString()}`);
    }

    let resetOffset = false;
    if (!query?.trim()) return;
    
    setLoading(true);

    if(query !== lastQuery) {
      resetOffset = true;
    }

    setError(null);
    
    try {
      let offset = resetOffset ? 0 : (page - 1) * pageSize;

      const maxOffset = totalResults ? totalResults - pageSize : null;

      if(maxOffset && offset > maxOffset) {
        offset = 0;
      }
      
      const data = await complexSearch({ 
        query,
        offset,
        number: pageSize,
      });



      const { results, ...newMetadata } = data;
      
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