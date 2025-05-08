import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useDebounce } from '../hooks/use-debounce';
import { usePagination } from '../hooks/use-pagination';
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
  data: Recipe[];
  handleSearch: () => void;
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    pendingPageChange: boolean;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
    canGoToNextPage: boolean;
    canGoToPreviousPage: boolean;
    offset: number;
    totalResults: number;
    available: boolean;
  }
  reset: () => void;
}


const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, queryHasChanged, resetQuery] = useDebounce(searchTerm, 500);

    const [loadingOverride, setLoadingOverride] = useState(false);
    const {setLayoutState} = useLayout();
    const [autoSearch, setAutoSearch] = useState(false);
    const [data, setData] = useState<Recipe[]>([]);
    const { loading, isInitialSearch,  metadata, searchResults, reset, searchRecipes} = useSpoonSearch();
    const pagination = usePagination(5, metadata.totalResults);

    const showLoader = loading || queryHasChanged || loadingOverride;

    const paginationAvailable = metadata.totalResults > 5;
    const isMobile = useIsMobile();
    const isMountingRef = useRef(true);
    const navigate = useNavigate();
    const location = useLocation();

    const resetSearch = () => {
        setSearchTerm('');
        setAutoSearch(false);
        setLayoutState(LayoutState.CENTERED);
        pagination.reset();
        reset();
        setData([]);
        resetQuery('');
    }

    // Auto Search
    useEffect(() => {

        if(!autoSearch && isMobile) return;

        pagination.reset();
        searchRecipes({ query, page: pagination.activePage, pageSize: 5 });

    }, [query, autoSearch]);


    // Update the results
    useEffect(() => {
        setData(searchResults);
        setLoadingOverride(false);
    }, [searchResults]);


    // Set the search term from the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        console.log({mounting: isMountingRef.current});

        if(isMountingRef.current) {
            isMountingRef.current = false;
            if (q && q !== searchTerm) {
                setLoadingOverride(true);
                setLayoutState(LayoutState.HEADER)
                setSearchTerm(q);
                setAutoSearch(true);
                navigate(`/?q=${encodeURIComponent(q)}`, { replace: true });
            } 
        }
    }, []);



    useEffect(() => {
        console.log("active page changed");

        // if(pagination.activePage === pagination.currentPage) return;    
        
        searchRecipes({ query, page: pagination.activePage, pageSize: 5 });
        
    }, [pagination.activePage]);

    const handleSearch = () => {
        if(isInitialSearch) {
            setLayoutState(LayoutState.HEADER)
            setAutoSearch(true);
        }
        searchRecipes({ query: searchTerm, page: 1, pageSize: 5 });
    }


  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      query,
      queryHasChanged,
      pagination: {
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