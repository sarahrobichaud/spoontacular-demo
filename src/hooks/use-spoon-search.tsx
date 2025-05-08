import { useRef, useState, } from 'react';
import { complexSearch, type RecipeSearchResponse } from '../services/spoonacular';
import type { Recipe } from '../services/spoonacular';
import { mockRecipes } from '../data/mockRecipes';
import { data, useLocation, useNavigate } from 'react-router';
import { env } from '../env';


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
  const latestRequestRef = useRef(0);

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

    let resetOffset = false;
    if (!query?.trim()) return;

    const currentRequestRef = ++latestRequestRef.current;
    
    setLoading(true);

    if(query !== lastQuery) {
      resetOffset = true;
    }

    setError(null);
    
    try {
      let offset = resetOffset ? 0 : (page - 1) * pageSize;

      let data: RecipeSearchResponse;

      console.log("--use spoon search--");
      if(!env.useMockData) {
        data = await complexSearch({ 
          query,
          offset,
          number: pageSize,
          addRecipeInformation: true,
        });
      } else {
        data = await generateMockResponse(query, offset, pageSize);
      }

      if(currentRequestRef !== latestRequestRef.current) {
        return; // discard old requests
      }

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