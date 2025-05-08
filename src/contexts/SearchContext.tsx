import { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  data: Recipe[];
  handleSearch: () => void;
  loading: boolean;
  pagination: PaginationInfo & { available: boolean };
  reset: () => void;
}


const PAGE_SIZE = 5;
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, queryHasChanged, resetQuery] = useDebounce(searchTerm, 500);

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

        if(!autoSearch || isMobile || location.pathname !== '/') return;

        pagination.reset();
        searchRecipes({ query, page: pagination.activePage, pageSize: 5 });

    }, [query, autoSearch]);


    // Update the results
    useEffect(() => {
        setData(searchResults);

        let timeout = setTimeout(() => {
            setLoadingOverride(false);
        }, 200); // safe buffer

        return () => clearTimeout(timeout);

    }, [searchResults]);



    // Set the search term from the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');

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
        setLoadingOverride(true);
        searchRecipes({ query, page: pagination.activePage, pageSize: PAGE_SIZE });
    }, [pagination.activePage]);

    const handleSearch = () => {
        pagination.reset();
        if(isInitialSearch) {
            setLayoutState(LayoutState.HEADER)
            setAutoSearch(true);
        }
        if(location.pathname !== '/') {
          navigate(`/?q=${encodeURIComponent(searchTerm)}`, { replace: true });
        }
        searchRecipes({ query: searchTerm, page: 1, pageSize: PAGE_SIZE });
    }


  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      query,
      queryHasChanged,
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