import { StatName, Stats } from "../types/character";
import { GearItem, GearRarity, GearType } from "../types/inventory";
import { MoodEntry, MoodType } from "../types/mood";
import { Quest, QuestStatus, QuestType } from "../types/quests";
import { SkillNode } from "../types/skills";
import { Achievement, AchievementCategory } from "../types/achievements";

// Remove Challenge related imports and types

// Character Context
export interface CharacterContextValue {
  character: Character | null;
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
}

// Quest Context
export interface QuestContextValue {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id" | "status">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (id: string) => void;
  completeQuestStep: (questId: string, stepIndex: number) => void;
  completeQuest: (questId: string) => void;
}

// Inventory Context
export interface InventoryContextValue {
  inventory: GearItem[];
  shopItems: GearItem[];
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (id: string) => void;
  equipItem: (id: string) => void;
  unequipItem: (id: string) => void;
  purchaseItem: (item: GearItem) => boolean;
  addShopItem: (item: Omit<GearItem, "id">) => void;
  updateShopItem: (item: GearItem) => void;
  deleteShopItem: (id: string) => void;
}

// SkillTree Context
export interface SkillTreeContextValue {
  skillTree: SkillNode[];
  addSkillNode: (node: Omit<SkillNode, "id">) => string;
  updateSkillNode: (node: SkillNode) => void;
  deleteSkillNode: (id: string) => void;
  unlockSkillNode: (id: string) => void;
}

// Habit Context
export interface HabitContextValue {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  uncompleteHabit: (id: string) => void;
}

// Mood Context
export interface MoodContextValue {
  moods: MoodEntry[];
  addMoodEntry: (mood: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (mood: MoodEntry) => void;
  deleteMoodEntry: (id: string) => void;
}

// Achievement Context
export interface AchievementContextValue {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (id: string) => void;
  checkAndUnlockAchievement: (achievementId: string) => boolean;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  stats: Stats;
  loginStreak: number;
}

export interface Habit {
    id: string;
    name: string;
    description: string;
    frequency: string;
    streak: number;
    completionHistory: string[];
}
