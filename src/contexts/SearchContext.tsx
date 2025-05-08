import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDebounce } from '../hooks/use-debounce';
import { useSpoonSearch } from '../hooks/use-spoon-search';
import { LayoutState, useLayout } from './LayoutContext';
import type { RecipeSearchResponse } from '../services/spoonacular';
import { useIsMobile } from '../hooks/use-mobile';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  triggerSearch: () => void;
  isLoading: boolean;
  data: RecipeSearchResponse | null;
  reset: () => void;
}

type SearchOptions = {
  query: string;
  page: number;
  pageSize: number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, hasPendingChange, overrideDebounce] = useDebounce(searchTerm, 500);
  const { isCentered , setLayoutState} = useLayout();

  const { searchRecipes , isInitialSearch, loading, searchResults, reset} = useSpoonSearch();

  const [lastTrigger, setLastTrigger] = useState(0);
  const isMobile = useIsMobile();

  const searchCallback = useCallback((options: SearchOptions) => {
      setLastTrigger(Date.now());
      searchRecipes(options);
  }, [searchRecipes, setLastTrigger]);


  useEffect(() => {
    if(lastTrigger > Date.now() - 500) {
      return;
    }

    if (query.trim() && !hasPendingChange && !isCentered && !isMobile) {
      searchCallback({ query, page: 1, pageSize: 5 });
    }
  }, [query, hasPendingChange, searchRecipes]);


  const triggerSearch = () => {
    overrideDebounce(); 
    searchCallback({ query, page: 1, pageSize: 5 });
  }


  useEffect(() => {
    if(!isInitialSearch) {
      setLayoutState(LayoutState.HEADER);
    }
  }, [isInitialSearch]);


  const handleReset = () => {
    reset();
    setSearchTerm('');
    overrideDebounce();
    setLayoutState(LayoutState.CENTERED);
  }

  return (
    <SearchContext.Provider value={{ 
      searchTerm,
      setSearchTerm, 
      triggerSearch,
      isLoading: loading || hasPendingChange,
      data: searchResults,
      reset: handleReset
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}