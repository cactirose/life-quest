
import { GameData } from '@/types/gameData';
import { upsertSkillNode } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync skill tree data
export const syncSkillTreeData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('skillTree')) return true;
  
  let allSkillsSuccess = true;
  
  for (const node of gameData.skillTree) {
    const success = await retrySyncOperation(
      async () => await upsertSkillNode(node),
      `skill-${node.id}`
    );
    
    if (!success) {
      allSkillsSuccess = false;
    }
  }
  
  return allSkillsSuccess;
};
