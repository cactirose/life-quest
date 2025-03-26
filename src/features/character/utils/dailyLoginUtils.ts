
// Ensure this file exists or create it if it doesn't
import { format, differenceInCalendarDays, startOfDay } from "date-fns";
import { GearItem, GearRarity } from "@/types/inventory";
import { generateId } from "@/utils/idGenerator";

export const checkConsecutiveLogin = (lastLoginDate: string | undefined | null) => {
  // If no last login, this is the first login
  if (!lastLoginDate) {
    return {
      isFirstLogin: true,
      isConsecutive: false,
      isSameDay: false
    };
  }

  const now = startOfDay(new Date());
  const lastLogin = startOfDay(new Date(lastLoginDate));
  
  // Calculate days between last login and today
  const daysBetween = differenceInCalendarDays(now, lastLogin);
  
  return {
    isFirstLogin: false,
    isConsecutive: daysBetween === 1, // Exactly 1 day since last login
    isSameDay: daysBetween === 0      // Same day login
  };
};

export const calculateDailyBonus = (streak: number) => {
  // Base rewards
  let xpBonus = 20;
  let coinBonus = 10;
  
  // Additional rewards based on streak
  if (streak >= 7) {
    // Weekly bonus
    xpBonus += 50;
    coinBonus += 25;
  }
  
  if (streak >= 30) {
    // Monthly bonus
    xpBonus += 200;
    coinBonus += 100;
  }
  
  // Small incremental bonus for each day
  xpBonus += (streak - 1) * 2;
  coinBonus += Math.floor((streak - 1) / 2);
  
  return { xpBonus, coinBonus };
};

export const createStreakTrophy = (streak: number): GearItem => {
  let rarity: GearRarity = "common";
  let name = "Login Streak Trophy";
  let description = `A trophy for maintaining a ${streak}-day login streak.`;
  
  // Determine rarity based on streak length
  if (streak >= 365) {
    rarity = "legendary";
    name = "Year-long Dedication Trophy";
  } else if (streak >= 180) {
    rarity = "epic";
    name = "Half-Year Commitment Trophy";
  } else if (streak >= 90) {
    rarity = "rare";
    name = "Season-long Consistency Trophy";
  } else if (streak >= 30) {
    rarity = "uncommon";
    name = "Monthly Dedication Trophy";
  }
  
  return {
    id: generateId(),
    name,
    description,
    type: "trophy",
    rarity,
    icon: "🏆",
    cost: 0,
    equipped: false,
    statBonuses: {
      charisma: Math.min(5, Math.floor(streak / 30)), // Max +5 charisma
      wisdom: Math.min(3, Math.floor(streak / 60))    // Max +3 wisdom
    }
  };
};
