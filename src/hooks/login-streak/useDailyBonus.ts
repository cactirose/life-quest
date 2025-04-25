
import { useState, useCallback } from "react";
import { Character } from "@/types/character";
import { toast } from "sonner";
import { upsertCharacter } from "@/services/characterService";
import { upsertInventoryItem } from "@/services/inventoryService";
import { createStreakTrophy, calculateDailyBonus } from "@/features/character/utils/dailyLoginUtils";
import { startOfDay } from "date-fns"; // Added missing import

interface UseDailyBonusProps {
  character: Character | null;
  setGameData: React.Dispatch<React.SetStateAction<any>>;
}

export const useDailyBonus = ({ 
  character, 
  setGameData 
}: UseDailyBonusProps) => {
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  const claimDailyBonus = useCallback(async () => {
    if (!character || character.dailyBonusClaimed || isClaimingBonus) {
      if (character?.dailyBonusClaimed) {
        toast.error("You've already claimed today's bonus!");
      }
      return;
    }
    
    try {
      setIsClaimingBonus(true);
      
      // Calculate bonus based on streak
      const streak = character.loginStreak;
      const { xpBonus, coinBonus } = calculateDailyBonus(streak);
      
      // Every 7 days, give a special bonus
      let specialItem = null;
      if (streak % 7 === 0) {
        specialItem = createStreakTrophy(streak);
        
        // Sync new inventory item with Supabase
        if (specialItem) {
          await upsertInventoryItem(specialItem);
          toast.success(`You received a special trophy for your ${streak}-day streak!`);
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
      await upsertCharacter(updatedCharacter);
      
      // Update local state
      setGameData(prevData => {
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
      
      toast.success(`Daily bonus claimed! +${xpBonus} XP, +${coinBonus} coins`);
    } catch (error) {
      console.error("Error claiming daily bonus:", error);
      toast.error("Failed to claim daily bonus. Please try again.");
    } finally {
      setIsClaimingBonus(false);
    }
  }, [character, setGameData, isClaimingBonus]);

  const forceReset = useCallback(async (fetchServerTime: () => Promise<Date>) => {
    if (!character) return;
    
    const now = await fetchServerTime();
    setGameData(prevData => ({
      ...prevData,
      character: {
        ...character,
        lastLoginDate: now.toISOString(),
        dailyBonusClaimed: false
      }
    }));
    
    localStorage.setItem('lastStreakReset', startOfDay(now).toISOString());
    
    console.log("Forced reset of daily login status");
  }, [character, setGameData]);

  return {
    claimDailyBonus,
    forceReset,
    isClaimingBonus
  };
};
