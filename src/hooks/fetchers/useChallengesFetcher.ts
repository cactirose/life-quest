
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { Challenge } from "@/types/challenges";

export const useChallengesFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  // Since challenges have been removed, we'll provide a placeholder function
  const fetchChallenges = async (): Promise<Challenge[]> => {
    console.log("Challenges feature has been removed. Returning empty array.");
    return [];
  };

  return { fetchChallenges };
};
