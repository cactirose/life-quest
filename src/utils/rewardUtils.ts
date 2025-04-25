
import { GearItem } from "@/types/inventory";
import { toast } from "sonner";
import { generateId } from "./idGenerator";
import { StatName } from "@/types/character";
import { GameData } from "@/types/gameData";

// Reward types
interface BasicReward {
  xp: number;
  coins: number;
  stats?: Record<StatName, number>;
}

interface ComplexReward extends BasicReward {
  item?: GearItem;
  achievement?: string; // ID of achievement to unlock
}

export type Reward = BasicReward | ComplexReward;

// Processing rewards functions
export const processBasicReward = (gameData: GameData, reward: BasicReward): Partial<GameData> => {
  if (!gameData.character) return {};

  const { xp, coins, stats = {} } = reward;
  const character = { ...gameData.character };

  // Add XP and check for level up
  character.xp += xp;
  
  // Level up check
  while (character.xp >= character.nextLevelXp) {
    character.level += 1;
    character.xp -= character.nextLevelXp;
    character.nextLevelXp = Math.round(character.nextLevelXp * 1.5);
    
    // Notify user of level up
    toast.success(`Leveled up to ${character.level}!`, {
      description: `Keep up the good work!`
    });
  }
  
  // Add coins
  character.coins += coins;
  
  // Add stat bonuses
  Object.entries(stats).forEach(([stat, value]) => {
    const statName = stat as StatName;
    if (character.stats[statName] !== undefined) {
      character.stats[statName] += value;
    }
  });

  return { character };
};

export const processItemReward = (
  gameData: GameData,
  item: GearItem
): Partial<GameData> => {
  // Add item to inventory
  const inventory = [...(gameData.inventory || [])];
  const newItem = { ...item, id: item.id || generateId() };
  inventory.push(newItem);

  return { inventory };
};

export const processReward = (
  gameData: GameData,
  reward: Reward,
  message = "Reward received!"
): Partial<GameData> => {
  const updates: Partial<GameData> = {};
  
  // Process basic rewards (XP, coins, stats)
  const basicUpdates = processBasicReward(gameData, reward);
  Object.assign(updates, basicUpdates);
  
  // If the reward includes an item
  if ('item' in reward && reward.item) {
    const itemUpdates = processItemReward(gameData, reward.item);
    Object.assign(updates, itemUpdates);
    
    toast.success(`Received ${reward.item.name}!`, {
      description: `${reward.item.description || "A new item has been added to your inventory."}`
    });
  }
  
  // If the reward includes an achievement ID to unlock
  if ('achievement' in reward && reward.achievement && gameData.achievements) {
    const achievements = [...gameData.achievements];
    const achievementIndex = achievements.findIndex(a => a.id === reward.achievement);
    
    if (achievementIndex !== -1 && !achievements[achievementIndex].unlocked) {
      achievements[achievementIndex] = {
        ...achievements[achievementIndex],
        unlocked: true,
        dateUnlocked: new Date().toISOString()
      };
      
      updates.achievements = achievements;
      
      toast.success(`Achievement Unlocked: ${achievements[achievementIndex].title}`, {
        description: achievements[achievementIndex].description || ''
      });
    }
  }
  
  // Show a toast notification for the reward
  if (reward.xp > 0 || reward.coins > 0) {
    const rewardText = [
      reward.xp > 0 ? `+${reward.xp} XP` : '',
      reward.coins > 0 ? `+${reward.coins} coins` : '',
    ].filter(Boolean).join(', ');
    
    toast.success(message, { description: rewardText });
  }
  
  return updates;
};

// Function to apply rewards to game state
export const applyReward = (
  gameData: GameData, 
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void,
  reward: Reward,
  message?: string
): void => {
  const updates = processReward(gameData, reward, message);
  const changedFields = new Set(Object.keys(updates));
  setGameData(updates, changedFields);
};
