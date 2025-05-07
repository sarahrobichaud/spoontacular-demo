import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useDebounce } from '../hooks/use-debounce';
import { LayoutState, useLayout } from './LayoutContext';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setLayoutState, isCentered } = useLayout();

  const { debouncedValue: debouncedSearchTerm, isLoading } = useDebounce(searchTerm, 500);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm && searchTerm === debouncedSearchTerm && !isCentered) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // Sync search term with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');

    if (q) {
      setSearchTerm(q);
    }
  }, [location]);

  const performSearch = (term: string) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setLayoutState(LayoutState.HEADER);
    navigate(`/?q=${encodeURIComponent(term)}`);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, performSearch, isLoading }}>
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