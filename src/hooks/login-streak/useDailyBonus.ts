
import { useState, useCallback } from 'react';
import { Character } from '@/types/character';
import { GameData } from '@/types/gameData';
import { toast } from 'sonner';
import { calculateDailyLoginReward, allocateRewards, checkStreakAchievement } from '@/utils/rewardUtils';
import { format } from 'date-fns';

interface DailyBonusProps {
  character: Character;
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void;
}

export function useDailyBonus({ character, setGameData }: DailyBonusProps) {
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);

  const claimDailyBonus = useCallback(async () => {
    if (!character || character.dailyBonusClaimed) {
      if (character.dailyBonusClaimed) {
        toast.error("You've already claimed your daily bonus today!");
      }
      return;
    }

    try {
      setIsClaimingBonus(true);
      
      // Calculate rewards based on streak
      const rewards = calculateDailyLoginReward(character.loginStreak);
      
      // Update character with rewards
      const updatedCharacter = {
        ...character,
        dailyBonusClaimed: true,
      };
      
      // Allocate rewards and update character
      const finalCharacter = allocateRewards(updatedCharacter, rewards, setGameData);
      
      // Check for streak-based achievements
      checkStreakAchievement(finalCharacter.loginStreak, setGameData);
      
      toast.success(`Daily bonus claimed! Streak: ${character.loginStreak} days`);
    } catch (error) {
      console.error("Error claiming daily bonus:", error);
      toast.error("Failed to claim daily bonus. Please try again.");
    } finally {
      setIsClaimingBonus(false);
    }
  }, [character, setGameData]);

  const forceReset = useCallback(async (fetchServerTime: () => Promise<Date>) => {
    try {
      setIsClaimingBonus(true);
      
      const serverTime = await fetchServerTime();
      const today = format(serverTime, 'yyyy-MM-dd');
      
      const updatedCharacter = {
        ...character,
        lastLoginDate: today,
        dailyBonusClaimed: false,
        loginStreak: 1, // Reset streak to 1
      };
      
      setGameData({ character: updatedCharacter }, new Set(['character']));
      toast.success("Login streak has been reset");
    } catch (error) {
      console.error("Error resetting login streak:", error);
      toast.error("Failed to reset login streak");
    } finally {
      setIsClaimingBonus(false);
    }
  }, [character, setGameData]);

  return {
    claimDailyBonus,
    forceReset,
    isClaimingBonus
  };
}
