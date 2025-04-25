import { Character, StatName } from "../types/character";
import { Quest } from "../types/quests";
import { GearItem } from "../types/inventory";
import { SkillNode } from "../types/skills";
import { Habit } from "../types/habits";
import { MoodEntry } from "../types/mood";
import { Achievement } from "../types/achievements";

// Common Context State Updater Type
export type GameDataUpdater = React.Dispatch<React.SetStateAction<any>>;

// Character Context Types
export interface CharacterContextType {
  character: Character;
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  checkDailyLogin: () => void;
  claimDailyBonus: () => void;
}

// Quest Context Types
export interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
}

// Inventory Context Types
export interface InventoryContextType {
  inventory: GearItem[];
  shopItems: GearItem[];
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  purchaseItem: (itemId: string) => boolean;
}

// Skill Tree Context Types
export interface SkillTreeContextType {
  skillTree: SkillNode[];
  addSkillNode: (node: Omit<SkillNode, "id">) => string;
  updateSkillNode: (node: SkillNode) => void;
  deleteSkillNode: (nodeId: string) => void;
  unlockSkillNode: (nodeId: string) => void;
}

// Habit Context Types
export interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
}

// Mood Context Types
export interface MoodContextType {
  moods: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  deleteMoodEntry: (entryId: string) => void;
}

// Achievement Context Types
export interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
  checkAndUnlockAchievement: (achievementId: string) => boolean;
}
