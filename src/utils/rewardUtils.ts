
import { Character } from '@/types/character';
import { GameData } from '@/types/gameData';

/**
 * Calculate rewards for completing an action
 */
export const calculateReward = (baseXp: number, baseCoins: number, character: Character) => {
  // Apply any bonuses based on character stats or equipped items
  const xpBonus = 1 + (character.stats.intelligence - 10) / 100;
  const coinsBonus = 1 + (character.stats.charisma - 10) / 100;

  const xp = Math.round(baseXp * xpBonus);
  const coins = Math.round(baseCoins * coinsBonus);

  return { xp, coins };
};

/**
 * Calculate rewards for daily login streak
 */
export const calculateDailyLoginReward = (streak: number): { xp: number, coins: number } => {
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
};

/**
 * Apply rewards to character stats
 */
export const allocateRewards = (
  gameData: GameData, 
  rewards: { xp?: number; coins?: number }
): GameData => {
  if (!gameData.character) return gameData;
  
  const character = { ...gameData.character };
  
  if (rewards.xp) {
    character.xp = character.xp + (rewards.xp || 0);
  }
  
  if (rewards.coins) {
    character.coins = character.coins + (rewards.coins || 0);
  }
  
  return {
    ...gameData,
    character
  };
};

/**
 * Check if a login streak has reached an achievement milestone
 */
export const checkStreakAchievement = (streak: number, achievements: any[]): string | null => {
  const streakMilestones = {
    3: 'login_streak_3',
    7: 'login_streak_7',
    14: 'login_streak_14',
    30: 'login_streak_30',
    90: 'login_streak_90',
    180: 'login_streak_180',
    365: 'login_streak_365'
  };
  
  // Find the highest milestone achieved
  const milestones = Object.keys(streakMilestones)
    .map(Number)
    .filter(days => streak >= days)
    .sort((a, b) => b - a);
  
  if (milestones.length === 0) return null;
  
  const highestMilestone = milestones[0];
  const achievementId = streakMilestones[highestMilestone];
  
  // Check if achievement already unlocked
  const achievement = achievements.find(a => a.id === achievementId);
  if (achievement?.unlocked) return null;
  
  return achievementId;
};

/**
 * Apply character stat changes and check for level up
 * @param gameData Current game data
 * @param statChanges Object with stat changes to apply
 * @returns Updated game data
 */
export const applyStatChanges = (
  gameData: GameData,
  statChanges: { [key: string]: number }
): GameData => {
  if (!gameData.character) return gameData;

  // Clone character to avoid direct state mutation
  const character = { ...gameData.character };
  
  // Apply stat changes
  Object.entries(statChanges).forEach(([stat, value]) => {
    if (stat === 'xp') {
      character.xp += value;
    } else if (stat === 'coins') {
      character.coins += value;
    } else if (stat in character.stats) {
      character.stats[stat] += value;
    }
  });
  
  return {
    ...gameData,
    character
  };
};
