import { createContext, useContext, useState } from 'react';
import { useDebounce } from '../hooks/use-debounce';

interface SearchContextType {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  query: string;
  queryHasChanged: boolean;
  resetQuery: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, queryHasChanged, resetQuery] = useDebounce(searchTerm, 500);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      query,
      queryHasChanged,
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