import { generateId } from "./idGenerator";
import { GearItem, GearType } from "@/types/inventory";

/**
 * Creates a special trophy item for achieving a login streak milestone
 * @param streak The login streak count
 * @returns A new trophy item
 */
export const createStreakTrophy = (streak: number): GearItem => {
  const milestoneLevel = Math.floor(streak / 7);
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const tier = tiers[Math.min(milestoneLevel - 1, tiers.length - 1)];

  return {
    id: generateId(),
    name: `${tier} Streak Trophy`,
    description: `Awarded for maintaining a ${streak}-day login streak!`,
    type: "special" as GearType,
    rarity: 'rare',
    icon: '🏆',
    cost: streak * 10,
    equipped: false,
    levelRequired: 1,
    statBonuses: {
      charisma: Math.floor(streak / 7), // Bonus increases with streak milestones
      wisdom: Math.floor(streak / 14)   // Additional wisdom bonus for longer streaks
    }
  };
}; 