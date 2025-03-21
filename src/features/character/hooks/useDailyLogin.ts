
import { Character } from "@/types/character";
import { GameDataUpdater } from "@/utils/contextTypes";
import { upsertCharacter } from "@/services/characterService";
import { upsertInventoryItem } from "@/services/inventoryService";
import { checkConsecutiveLogin, calculateDailyBonus, createStreakTrophy } from "../utils/dailyLoginUtils";

export const useDailyLogin = (
  character: Character, 
  setGameData: GameDataUpdater
) => {
  const checkDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setGameData(prevData => {
      const { character } = prevData;
      const { isConsecutive, isFirstLogin, isSameDay } = checkConsecutiveLogin(character.lastLoginDate);
      
      // Same day login, do nothing
      if (isSameDay) return prevData;
      
      let updatedCharacter;
      
      // First login ever
      if (isFirstLogin) {
        updatedCharacter = {
          ...character,
          lastLoginDate: today,
          loginStreak: 1,
          dailyBonusClaimed: false
        };
      }
      // Consecutive day
      else if (isConsecutive) {
        updatedCharacter = {
          ...character,
          lastLoginDate: today,
          loginStreak: character.loginStreak + 1,
          dailyBonusClaimed: false
        };
      }
      // Not consecutive, reset streak
      else {
        updatedCharacter = {
          ...character,
          lastLoginDate: today,
          loginStreak: 1,
          dailyBonusClaimed: false
        };
      }
      
      // Sync with Supabase
      upsertCharacter(updatedCharacter);
      
      return {
        ...prevData,
        character: updatedCharacter
      };
    });
  };
  
  const claimDailyBonus = () => {
    setGameData(prevData => {
      const { character } = prevData;
      
      if (character.dailyBonusClaimed) return prevData;
      
      // Calculate bonus based on streak
      const streak = character.loginStreak;
      const { xpBonus, coinBonus } = calculateDailyBonus(streak);
      
      // Every 7 days, give a special bonus
      let specialItem = null;
      if (streak % 7 === 0) {
        specialItem = createStreakTrophy(streak);
        
        // Sync new inventory item with Supabase
        if (specialItem) {
          upsertInventoryItem(specialItem);
        }
      }
      
      // Update character
      const updatedCharacter = {
        ...character,
        xp: character.xp + xpBonus,
        coins: character.coins + coinBonus,
        dailyBonusClaimed: true
      };
      
      // Sync with Supabase
      upsertCharacter(updatedCharacter);
      
      // Update inventory if special item
      const updatedInventory = specialItem
        ? [...prevData.inventory, specialItem]
        : prevData.inventory;
      
      return {
        ...prevData,
        character: updatedCharacter,
        inventory: updatedInventory
      };
    });
  };

  return {
    checkDailyLogin,
    claimDailyBonus
  };
};
