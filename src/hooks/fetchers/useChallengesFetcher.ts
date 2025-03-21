
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useChallengesFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchChallenges = async (signal?: AbortSignal) => {
    try {
      updateStatus('challenges', 'loading');
      
      const { fetchChallenges } = await import('@/services/challengeService');
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Challenges fetch aborted");
        return null;
      }
      
      const data = await fetchChallenges();
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, challenges: data }));
      }
      updateStatus('challenges', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Challenges fetch aborted");
        return null;
      }
      
      console.error("Error loading challenges:", error);
      updateStatus('challenges', 'error');
      return null;
    }
  };

  return { fetchChallenges };
};
