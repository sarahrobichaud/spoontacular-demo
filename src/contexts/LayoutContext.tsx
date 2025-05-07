import { createContext, useContext, useState, type ReactNode, } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useDebounce } from '../hooks/use-debounce';

export const LayoutState = {
    CENTERED: 'centered',
    HEADER: 'header',
} as const;

export type LayoutState = (typeof LayoutState)[keyof typeof LayoutState];


interface LayoutContextType {
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  layoutState: LayoutState;
  setLayoutState: (state: LayoutState) => void;
  performSearch: (term: string) => void;
  isCentered: boolean;
  initialShiftHappened: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [initialShiftHappened, setInitialShiftHappened] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [layoutState, setLayoutState] = useState<LayoutState>(LayoutState.CENTERED);
  const navigate = useNavigate();
  const location = useLocation();

  const { debouncedValue: debouncedSearchTerm, isLoading } = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm && searchTerm === debouncedSearchTerm && layoutState === LayoutState.HEADER) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const evaluateLayoutState = () => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');

    if (q) {
      setSearchTerm(q);
      setLayoutState(LayoutState.HEADER);
    } else if (location.pathname === '/') {
      setLayoutState(LayoutState.CENTERED);
    } else {
      setLayoutState(LayoutState.HEADER);
    }
    setInitialShiftHappened(true);
  }

  useEffect(() => {
    evaluateLayoutState();
  }, [location]);

  useEffect(() => {
    evaluateLayoutState();
  }, []);

  const performSearch = (term: string) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setLayoutState(LayoutState.HEADER);
    navigate(`/?q=${encodeURIComponent(term)}`);
  };

  return (
    <LayoutContext.Provider
      value={{ searchTerm, setSearchTerm, layoutState, setLayoutState, performSearch, isCentered: layoutState === LayoutState.CENTERED, isLoading , initialShiftHappened }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}