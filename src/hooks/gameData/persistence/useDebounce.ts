
import { useCallback, useRef } from "react";

export const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay) as unknown as number;
  }, [callback, delay]);
};
