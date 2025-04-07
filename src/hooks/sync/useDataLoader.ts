import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { GameData } from "@/types/gameData";
import { loadGameData } from "@/services";
import { useDataStatus } from "../useDataStatus";

export const useDataLoader = (
  setGameData: React.Dispatch<React.SetStateAction<GameData>>,
  resetStatus: () => void,
  updateStatus: (key: keyof GameData, status: 'loading' | 'loaded' | 'error') => void,
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const loadingProgressRef = useRef(0);

  const loadInitialData = useCallback(async () => {
    if (!isAuthenticated || isAuthLoading || loading) return;

    setLoading(true);
    resetStatus();
    loadingProgressRef.current = 0;
    setLoadingProgress(0);

    try {
      const initialData = await loadGameData();

      // Update game data in state
      setGameData((prev) => ({
        ...DEFAULT_GAME_DATA,
        ...prev,
        ...initialData,
      }));

      console.log("Initial data loaded successfully");
      setLoadingProgress(100);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setLoadingProgress(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, setGameData, resetStatus, setLoadingProgress, loading]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading && !loading) {
      loadInitialData();
    }
  }, [isAuthenticated, isAuthLoading, loadInitialData, loading]);

  return { loading };
};
