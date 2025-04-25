
import { toast } from "sonner";
import { Character, StatName } from "@/types/character";
import { GameData } from "@/types/gameData";

export interface RewardPayload {
  xp?: number;
  coins?: number;
  stats?: Partial<Record<StatName, number>>;
}

/**
 * Calculate XP needed for the next level
 * Using a common RPG formula: baseXP * (level ^ 1.8)
 */
export function calculateNextLevelXp(level: number): number {
  const baseXP = 100;
  return Math.floor(baseXP * Math.pow(level, 1.8));
}

/**
 * Allocate rewards (XP, coins, stats) to the character
 * Handles level-ups automatically
 */
export function allocateRewards(
  character: Character,
  rewards: RewardPayload,
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void
): Character {
  if (!character) return character;

  let { xp, level, nextLevelXp, coins } = character;
  const updatedCharacter = { ...character };
  let leveledUp = false;

  // Add XP if provided
  if (rewards.xp && rewards.xp > 0) {
    xp += rewards.xp;
    // Check for level up
    while (xp >= nextLevelXp) {
      level += 1;
      xp -= nextLevelXp;
      nextLevelXp = calculateNextLevelXp(level);
      leveledUp = true;
    }
    updatedCharacter.xp = xp;
    updatedCharacter.level = level;
    updatedCharacter.nextLevelXp = nextLevelXp;
  }

  // Add coins if provided
  if (rewards.coins && rewards.coins > 0) {
    updatedCharacter.coins = coins + rewards.coins;
  }

  // Update stats if provided
  if (rewards.stats) {
    const updatedStats = { ...updatedCharacter.stats };
    Object.entries(rewards.stats).forEach(([stat, value]) => {
      if (value) {
        updatedStats[stat as StatName] = (updatedStats[stat as StatName] || 0) + value;
      }
    });
    updatedCharacter.stats = updatedStats;
  }

  // Update game data
  setGameData({ character: updatedCharacter }, new Set(['character']));

  // Show appropriate toasts for feedback
  if (rewards.xp) toast.success(`Gained ${rewards.xp} XP!`);
  if (rewards.coins) toast.success(`Gained ${rewards.coins} coins!`);
  if (leveledUp) toast.success(`Level up! You are now level ${level}!`);
  
  return updatedCharacter;
}

/**
 * Calculate daily login rewards based on streak
 * Rewards increase with streak, with a cap at 7 days
 */
export function calculateDailyLoginReward(streak: number): RewardPayload {
  const baseXp = 25;
  const baseCoins = 15;
  const cappedStreak = Math.min(streak, 7); // Cap at day 7
  
  // Exponential increase with streak
  const multiplier = Math.pow(1.3, cappedStreak - 1);
  
  return {
    xp: Math.floor(baseXp * multiplier),
    coins: Math.floor(baseCoins * multiplier)
  };
}

/**
 * Check if an achievement should be completed based on a streak
 */
export function checkStreakAchievement(
  streak: number, 
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void
): void {
  // Check for streak-based achievements
  const streakAchievements = [
    { days: 7, id: "7-day-streak" },
    { days: 14, id: "14-day-streak" },
    { days: 30, id: "30-day-streak" }
  ];
  
  streakAchievements.forEach(achievement => {
    if (streak >= achievement.days) {
      // Update achievement progress/unlock status
      completeAchievement(achievement.id, setGameData);
    }
  });
}

/**
 * Complete an achievement by ID
 */
export function completeAchievement(
  achievementId: string,
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void
): void {
  setGameData(prevData => {
    const achievements = [...prevData.achievements || []];
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].unlocked) {
      // Clone achievement and update its status
      const updatedAchievement = {
        ...achievements[achievementIndex],
        unlocked: true,
        dateUnlocked: new Date().toISOString()
      };
      
      // Create a new array with the updated achievement
      const updatedAchievements = [...achievements];
      updatedAchievements[achievementIndex] = updatedAchievement;
      
      // Apply any rewards from the achievement
      if (updatedAchievement.xpReward || updatedAchievement.coinReward) {
        const character = { ...prevData.character };
        allocateRewards(
          character,
          {
            xp: updatedAchievement.xpReward,
            coins: updatedAchievement.coinReward
          },
          setGameData
        );
      }
      
      toast.success(`Achievement unlocked: ${updatedAchievement.title}!`);
      return { ...prevData, achievements: updatedAchievements };
    }
    
    return prevData;
  }, new Set(['achievements']));
}
