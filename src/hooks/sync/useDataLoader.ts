import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";
import { loadInitialData } from "@/utils/loadInitialData";
import { loadAllGameData } from "@/services";
import { useIsMobile } from "../use-mobile";

export function useDataLoader(
  setGameData: React.Dispatch<React.SetStateAction<GameData>>,
  syncFromSupabase: (signal?: AbortSignal) => Promise<void>,
  loadLocalData: () => void,
  hasLoadedData: React.MutableRefObject<boolean>,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const isMobile = useIsMobile();
  const syncTimeoutRef = useRef<number | null>(null);

  const loadUserData = useCallback(async () => {
    setLoadingState('loading');
    
    try {
      // First try to load from local storage as immediate fallback
      loadLocalData();
      
      // Then attempt to sync with Supabase
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      // Implement progressive loading with timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Loading timeout')), 15000);
      });

      const dataPromise = loadAllGameData();
      
      const allData = await Promise.race([dataPromise, timeoutPromise]);
      
      if (Object.keys(allData).length > 0) {
        setGameData(prevData => ({
          ...prevData,
          ...allData,
        }));
        setLoadingState('success');
        hasLoadedData.current = true;
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setErrorDetails(error.message);
      setLoadingState('error');
      
      // Implement fallback strategy
      if (!hasLoadedData.current) {
        toast.error("Unable to load from server, using local data");
        loadLocalData();
      }
    }
  }, [loadLocalData, setGameData, hasLoadedData]);

  const retryDataLoad = useCallback(() => {
    toast.info("Retrying data load...");
    hasLoadedData.current = false;
    setRetryCount(0);
    loadUserData();
  }, [loadUserData]);

  return {
    loadingState,
    setLoadingState,
    errorDetails,
    retryCount,
    loadUserData,
    retryDataLoad,
    syncTimeoutRef,
  };
}
