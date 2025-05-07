import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): { debouncedValue: T; isLoading: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, isLoading: debouncedValue !== value };
}
