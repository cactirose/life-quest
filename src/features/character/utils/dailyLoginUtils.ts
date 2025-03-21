
import { Character } from "@/types/character";
import { GearItem } from "@/types/inventory";
import { generateId } from "@/utils/idGenerator";
import { upsertInventoryItem } from "@/services/inventoryService";

/**
 * Checks if today is consecutive to the last login date
 */
export const checkConsecutiveLogin = (lastLoginDate: string | null): {
  isConsecutive: boolean;
  isFirstLogin: boolean;
  isSameDay: boolean;
} => {
  const today = new Date().toISOString().split('T')[0];
  
  // First login ever
  if (!lastLoginDate) {
    return { isConsecutive: false, isFirstLogin: true, isSameDay: false };
  }
  
  // Parse dates for comparison
  const lastLogin = new Date(lastLoginDate);
  const lastLoginDay = lastLogin.toISOString().split('T')[0];
  const currentDate = new Date(today);
  
  // Same day login
  if (lastLoginDay === today) {
    return { isConsecutive: false, isFirstLogin: false, isSameDay: true };
  }
  
  // Check if consecutive day
  const timeDiff = currentDate.getTime() - lastLogin.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return { 
    isConsecutive: dayDiff === 1, 
    isFirstLogin: false, 
    isSameDay: false 
  };
};

/**
 * Creates a streak trophy item
 */
export const createStreakTrophy = (streak: number): GearItem => {
  return {
    id: generateId(),
    name: `${streak}-Day Streak Trophy`,
    description: `Awarded for logging in ${streak} days in a row!`,
    type: "accessory",
    rarity: streak >= 28 ? "legendary" : streak >= 14 ? "epic" : streak >= 7 ? "rare" : "common",
    icon: "🏆",
    cost: 100,
    statBonuses: { charisma: Math.floor(streak / 7) },
    equipped: false,
    levelRequired: 1
  };
};

/**
 * Calculates bonus amounts based on streak
 */
export const calculateDailyBonus = (streak: number): { xpBonus: number; coinBonus: number } => {
  let xpBonus = 10 * streak;
  let coinBonus = 5 * streak;
  
  // Cap at reasonable values
  xpBonus = Math.min(xpBonus, 100);
  coinBonus = Math.min(coinBonus, 50);
  
  return { xpBonus, coinBonus };
};
