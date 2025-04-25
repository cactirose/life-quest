
import { useCallback, useState } from 'react';
import { useGameData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import {
  calculateReward,
  applyStatChanges
} from '@/utils/rewardUtils';

export function useDailyBonus() {
  const { gameData, setGameData } = useGameData();
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);
  
  const calculateDailyLoginReward = useCallback((streak: number) => {
    // Base rewards
    let xp = 10;
    let coins = 5;
    
    // Bonus for streaks
    if (streak >= 7) {
      // Weekly bonus
      xp += 20;
      coins += 15;
    }
    
    if (streak >= 30) {
      // Monthly bonus
      xp += 50;
      coins += 25;
    }
    
    // Scale with streak length (diminishing returns)
    xp += Math.floor(Math.sqrt(streak) * 3);
    coins += Math.floor(Math.sqrt(streak) * 2);
    
    return { xp, coins };
  }, []);

  const claimDailyBonus = useCallback(async () => {
    if (!gameData.character) return;
    
    try {
      setIsClaimingBonus(true);
      
      const { loginStreak } = gameData.character;
      
      // Calculate rewards based on login streak
      const baseReward = calculateDailyLoginReward(loginStreak);
      
      // Apply any character bonuses
      const reward = calculateReward(
        baseReward.xp,
        baseReward.coins,
        gameData.character
      );

      // Update character
      const updatedGameData = applyStatChanges(gameData, {
        xp: reward.xp,
        coins: reward.coins
      });
      
      // Mark daily bonus as claimed
      const updatedCharacter = {
        ...updatedGameData.character,
        dailyBonusClaimed: true
      };
      
      // Check for streak achievements
      const achievementId = checkStreakAchievement(loginStreak);
      if (achievementId) {
        // Implement achievement unlocking logic here
        toast.success(`Achievement unlocked: ${achievementId}`);
      }
      
      // Save changes
      setGameData({
        ...updatedGameData,
        character: updatedCharacter
      }, new Set(['character']));
      
      // Show notification
      toast.success(
        `Daily bonus claimed!`, 
        { description: `+${reward.xp} XP, +${reward.coins} coins` }
      );
    } finally {
      setIsClaimingBonus(false);
    }
  }, [gameData, setGameData, calculateDailyLoginReward]);

  // Simple check for streak achievements - in a real app you would have a more complex system
  const checkStreakAchievement = (streak: number): string | null => {
    const streakMilestones = {
      3: 'login_streak_3_days',
      7: 'login_streak_7_days',
      14: 'login_streak_14_days',
      30: 'login_streak_30_days',
      90: 'login_streak_90_days',
      180: 'login_streak_180_days',
      365: 'login_streak_365_days'
    };
    
    // Find the highest milestone achieved
    const milestones = Object.keys(streakMilestones)
      .map(Number)
      .filter(days => streak >= days)
      .sort((a, b) => b - a);
    
    if (milestones.length === 0) return null;
    
    const highestMilestone = milestones[0];
    return streakMilestones[highestMilestone];
  };

  // Add a forceReset function to satisfy the API that useLoginStreak expects
  const forceReset = useCallback(() => {
    if (!gameData.character) return;
    
    const updatedCharacter = {
      ...gameData.character,
      loginStreak: 0,
      dailyBonusClaimed: false
    };
    
    setGameData({
      character: updatedCharacter
    }, new Set(['character']));
    
    toast.info("Login streak has been reset");
  }, [gameData, setGameData]);
  
  return { 
    claimDailyBonus, 
    forceReset,
    isClaimingBonus 
  };
}
