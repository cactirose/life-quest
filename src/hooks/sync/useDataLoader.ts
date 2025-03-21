import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";
import { loadInitialData } from "@/utils/loadInitialData";
import { loadAllGameData } from "@/services";
import { useIsMobile } from "../use-mobile";

export function useDataLoader(
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  syncFromSupabase: (signal?: AbortSignal) => Promise<void>,
  loadLocalData: () => void,
  hasLoadedData: React.MutableRefObject<boolean>,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const isMobile = useIsMobile();
  const syncTimeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    if (hasLoadedData.current || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        toast.error("You're offline. Using local data.");
        loadLocalData();
        hasLoadedData.current = true;
        return;
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();

      if (initialData) {
        console.log("Setting initial data while waiting for server data");
        setGameData((prevData) => ({
          ...prevData,
          ...initialData,
        }));
      }

      if (session) {
        storeSession(session);
        console.log("User is authenticated, fetching server data...");

        const timeoutDuration = isMobile ? 20000 : 30000;
        const timeoutPromise = new Promise((_, reject) => {
          syncTimeoutRef.current = window.setTimeout(() => {
            reject(new Error("Data load timeout"));
          }, timeoutDuration) as unknown as number;
        });

        try {
          console.log("Attempting to load all game data");

          const allData = (await Promise.race([
            loadAllGameData(),
            timeoutPromise,
          ])) as Partial<any>;

          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
          }

          if (Object.keys(allData).length > 0) {
            console.log("Successfully loaded data from server");

            const updatedData: Partial<any> = {};

            if (allData.character) updatedData.character = allData.character;
            if (allData.quests && allData.quests.length > 0)
              updatedData.quests = allData.quests;
            if (allData.inventory && allData.inventory.length > 0)
              updatedData.inventory = allData.inventory;
            if (allData.shopItems && allData.shopItems.length > 0)
              updatedData.shopItems = allData.shopItems;
            if (allData.skillTree && allData.skillTree.length > 0)
              updatedData.skillTree = allData.skillTree;
            if (allData.challenges && allData.challenges.length > 0)
              updatedData.challenges = allData.challenges;
            if (allData.habits && allData.habits.length > 0)
              updatedData.habits = allData.habits;
            if (allData.moods && allData.moods.length > 0)
              updatedData.moods = allData.moods;
            if (allData.achievements && allData.achievements.length > 0)
              updatedData.achievements = allData.achievements;

            setGameData((prevData) => ({
              ...prevData,
              ...updatedData,
            }));

            toast.success("Successfully loaded your game data", {
              id: "data-loaded",
            });
            hasLoadedData.current = true;
          } else {
            console.log(
              "No data received from server, falling back to progressive loading"
            );
            await syncFromSupabase(signal);
            hasLoadedData.current = true;
          }
        } catch (error) {
          console.error(
            "Error with quick load, falling back to progressive loading:",
            error
          );

          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
          }

          if ((error as Error).message === "Data load timeout") {
            toast.error(
              "Loading data is taking too long. Using what we have so far."
            );
            hasLoadedData.current = true;
          } else {
            try {
              await syncFromSupabase(signal);
              hasLoadedData.current = true;
            } catch (syncError) {
              console.error("Progressive sync also failed:", syncError);
              toast.error(
                "Could not load your data. Using local data instead."
              );
              loadLocalData();
              hasLoadedData.current = true;
            }
          }
        }
      } else {
        console.log("User is not authenticated, using local data only");
        loadLocalData();
        hasLoadedData.current = true;
      }
    } catch (error) {
      console.error("Error loading user data:", error);

      if (retryCount < maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 1000;
        toast.info(
          `Having trouble loading your data. Retrying in ${
            backoffTime / 1000
          } seconds...`
        );

        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          loadUserData();
        }, backoffTime);
      } else {
        toast.error("Failed to load your data. Using local data instead.");
        loadLocalData();
        hasLoadedData.current = true;
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    setGameData,
    syncFromSupabase,
    loadLocalData,
    retryCount,
    isMobile,
    isLoading,
    hasLoadedData,
    abortControllerRef,
    maxRetries,
  ]);

  const retryDataLoad = useCallback(() => {
    toast.info("Retrying data load...");
    hasLoadedData.current = false;
    setRetryCount(0);
    loadUserData();
  }, [loadUserData]);

  return {
    isLoading,
    setIsLoading,
    retryCount,
    loadUserData,
    retryDataLoad,
    syncTimeoutRef,
  };
}
