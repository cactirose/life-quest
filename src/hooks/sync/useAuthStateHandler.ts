
import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";
import { toast } from "sonner";
import { loadInitialData } from "@/utils/loadInitialData";

export function useAuthStateHandler(loadUserData: () => Promise<void>, setGameData: React.Dispatch<React.SetStateAction<any>>) {
  const hasLoadedData = useRef(false);

  const handleAuthStateChange = useCallback((event: string, session: any) => {
    console.log("Auth state changed:", event);
    
    // Use setTimeout to prevent deadlocks with Supabase
    setTimeout(() => {
      if (event === 'SIGNED_IN') {
        hasLoadedData.current = false;
        loadUserData();
      } else if (event === 'SIGNED_OUT') {
        const initialData = loadInitialData();
        setGameData(prevData => ({
          ...prevData,
          ...initialData,
        }));
        hasLoadedData.current = true;
        toast.info("Signed out - using local data");
      }
    }, 0);
  }, [loadUserData, setGameData]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    if (!hasLoadedData.current) {
      setTimeout(() => {
        if (hasLoadedData.current) return;
        loadUserData();
      }, 300);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, loadUserData]);

  return {
    hasLoadedData
  };
}
