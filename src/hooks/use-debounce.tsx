import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): [T, boolean, () => void] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    setTimer(setTimeout(() => {
      setDebouncedValue(value);
    }, delay));

    return () => {
      if(timer) {
        clearTimeout(timer);
      }
    };
  }, [value, delay]);

  const overrideDebounce = () => {
    if(timer) {
      clearTimeout(timer);
    }
    setDebouncedValue(value);
  }

  return [ debouncedValue, debouncedValue !== value,  overrideDebounce];
}
