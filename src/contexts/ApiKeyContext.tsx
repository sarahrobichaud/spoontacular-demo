import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isLoaded: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

const LOCAL_STORAGE_KEY = 'spoonacular_api_key'; // this is fine for a job demo

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedKey) {
      setApiKeyState(storedKey);
    }
    setIsLoaded(true);
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
    setApiKeyState(key);
    window.location.reload();
  };

  const clearApiKey = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setApiKeyState(null);
    window.location.reload();
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isLoaded }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
} 