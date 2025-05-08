import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { useDebounce } from '../hooks/use-debounce';
import { usePagination, type PaginationInfo } from '../hooks/use-pagination';
import { useLocation, useNavigate } from 'react-router';
import type { Recipe } from '../services/spoonacular';
import { LayoutState, useLayout } from './LayoutContext';
import { useSpoonSearch } from '../hooks/use-spoon-search';
import { useIsMobile } from '../hooks/use-mobile';

interface SearchContextType {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  query: string;
  queryHasChanged: boolean;
  hasCuisine: (cuisine: string) => boolean;
  toggleCuisine: (cuisine: string) => void;
  data: Recipe[];
  canSearch: boolean;
  handleSearch: () => void;
  loading: boolean;
  pagination: PaginationInfo & { available: boolean };
  includeAllCuisines: boolean;
  reset: () => void;
}


const PAGE_SIZE = 5;
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, queryHasChanged, resetQuery] = useDebounce(searchTerm, 500);
  const [cuisines, setCuisines] = useState<string[]>([]);

    const [loadingOverride, setLoadingOverride] = useState(false);
    const {setLayoutState} = useLayout();
    const [autoSearch, setAutoSearch] = useState(false);
    const [data, setData] = useState<Recipe[]>([]);
    const { loading, isInitialSearch,  metadata, searchResults, reset, searchRecipes} = useSpoonSearch();
    const pagination = usePagination(PAGE_SIZE, metadata.totalResults);

    const showLoader = loading || queryHasChanged || loadingOverride || pagination.pendingPageChange;

    const paginationAvailable = metadata.totalResults > 5;
    const isMobile = useIsMobile();
    const isMountingRef = useRef(true);
    const navigate = useNavigate();
    const location = useLocation();

    const cuisineParam = useMemo(() => {
        return cuisines.length > 0 ? cuisines.join(',') : '';
    }, [cuisines]);

    const resetSearch = () => {
        setSearchTerm('');
        setAutoSearch(false);
        setCuisines([]);
        setLayoutState(LayoutState.CENTERED);
        pagination.reset();
        reset();
        setData([]);
        resetQuery('');
    }
    const canSearch = useMemo(() => {
        return searchTerm.trim() !== '';
    }, [searchTerm]);

    // Auto Search
    useEffect(() => {

        if(!autoSearch || isMobile || location.pathname !== '/' || loading) return;

        pagination.reset();

        console.log("autoSearch", query);
        searchRecipes({ query, page: pagination.activePage, pageSize: 5, cuisine: cuisineParam });

    }, [query, autoSearch, cuisineParam]);


    // Update the results
    useEffect(() => {
        setData(searchResults);
        setLoadingOverride(false);
    }, [searchResults]);

    const hasCuisine = (cuisine: string) => {
        return cuisines.includes(cuisine);
    }


    // Set the search term from the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        const c = params.get('cuisine');
        if(isMountingRef.current) {
            isMountingRef.current = false;
            if (q && q !== searchTerm) {
                setLoadingOverride(true);
                setLayoutState(LayoutState.HEADER)
                setSearchTerm(q);
                if(c) {
                  const cuisineArray = c.split(',').map(item => item.trim().toLowerCase());
                  setCuisines(cuisineArray);
                }
                setAutoSearch(true);
                navigate(`/?q=${encodeURIComponent(q)}&cuisine=${encodeURIComponent(c || '')}`, { replace: true });
            } 
        }
    }, []);

    const toggleCuisine = (cuisine: string) => {
      if(cuisine === 'all') {
        setCuisines([]);
        return;
      }
      setCuisines(prev => {
        const exists = prev.includes(cuisine);
        if (exists) {
          return prev.filter(c => c !== cuisine);
        } else {
          return [...prev, cuisine];
        }
      });
    };


    useEffect(() => {
        searchRecipes({ query, page: pagination.activePage, pageSize: PAGE_SIZE, cuisine: cuisineParam });
    }, [pagination.activePage]);

    const handleSearch = () => {
        pagination.reset();
        if(location.pathname !== '/') {
          navigate(`/?q=${encodeURIComponent(searchTerm)}`, { replace: true });
        }

        console.log("handleSearch", searchTerm);
        searchRecipes({ query: searchTerm, page: 1, pageSize: PAGE_SIZE, cuisine: cuisineParam });
        if(isInitialSearch) {
            setLayoutState(LayoutState.HEADER)
            setAutoSearch(true);
        }
    }


  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      query,
      toggleCuisine,
      queryHasChanged,
      hasCuisine,
      includeAllCuisines: cuisines.length === 0,
      canSearch,
      pagination: {
        reset: pagination.reset,
        activePage: pagination.activePage,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        pendingPageChange: pagination.pendingPageChange,
        handleNextPage: pagination.handleNextPage,
        handlePreviousPage: pagination.handlePreviousPage,
        canGoToNextPage: pagination.canGoToNextPage,
        canGoToPreviousPage: pagination.canGoToPreviousPage,
        offset: pagination.offset,
        totalResults: pagination.totalResults,
        available: paginationAvailable
      },
      handleSearch,
      loading: showLoader,
      data,
      reset: resetSearch,
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