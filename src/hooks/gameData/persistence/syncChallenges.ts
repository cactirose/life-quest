
import { GameData } from '@/types/gameData';
import { upsertChallenge } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync challenges data
export const syncChallengesData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('challenges')) return true;
  
  let allChallengesSuccess = true;
  
  for (const challenge of gameData.challenges) {
    const success = await retrySyncOperation(
      async () => await upsertChallenge(challenge),
      `challenge-${challenge.id}`
    );
    
    if (!success) {
      allChallengesSuccess = false;
    }
  }
  
  return allChallengesSuccess;
};
