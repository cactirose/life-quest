
import { useState } from "react";
import { Character } from "@/types/character";
import { toast } from "sonner";

export interface UseDailyBonusProps {
  character: Character;
  setCharacter?: (character: Character) => void;
}

export const useDailyBonus = ({ character, setCharacter }: UseDailyBonusProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Claim daily bonus
  const claimDailyBonus = async () => {
    if (!character || !setCharacter) {
      console.error("Cannot claim daily bonus: Character or setCharacter is undefined");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      if (character.dailyBonusClaimed) {
        toast.error("You've already claimed your daily bonus today");
        return;
      }
      
      // Calculate bonus amount based on streak
      const streakBonus = Math.min(character.loginStreak || 0, 7) * 5;
      const baseAmount = 20;
      const totalBonus = baseAmount + streakBonus;
      
      // Update character with bonus
      const updatedCharacter = {
        ...character,
        coins: character.coins + totalBonus,
        dailyBonusClaimed: true
      };
      
      // Update state
      setCharacter(updatedCharacter);
      
      toast.success(`Daily bonus claimed! +${totalBonus} coins`, {
        description: streakBonus > 0 ? `Includes +${streakBonus} streak bonus!` : undefined
      });
    } catch (error) {
      console.error("Error claiming daily bonus:", error);
      toast.error("Failed to claim daily bonus");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Force reset login streak (admin function)
  const forceReset = async (fetchServerTime?: () => Promise<Date>) => {
    if (!character || !setCharacter) {
      console.error("Cannot reset streak: Character or setCharacter is undefined");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Get the current server time if a fetch function is provided
      let serverDate: Date;
      if (fetchServerTime) {
        serverDate = await fetchServerTime();
      } else {
        serverDate = new Date();
      }
      
      // Reset streak and daily bonus claim
      const updatedCharacter = {
        ...character,
        loginStreak: 0,
        dailyBonusClaimed: false,
        lastLoginDate: serverDate.toISOString()
      };
      
      // Update state
      setCharacter(updatedCharacter);
      
      toast.info("Login streak has been reset");
    } catch (error) {
      console.error("Error resetting login streak:", error);
      toast.error("Failed to reset login streak");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    claimDailyBonus,
    forceReset,
    isProcessing
  };
};
