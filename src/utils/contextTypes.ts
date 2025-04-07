
import { Character, StatName } from "../types/character";
import { Quest } from "../types/quests";
import { GearItem } from "../types/inventory";
import { SkillNode } from "../types/skills";
import { Habit } from "../types/habits";
import { MoodEntry, MoodType } from "../types/mood";
import { Achievement } from "../types/achievements";

export type GameDataUpdater = React.Dispatch<React.SetStateAction<any>>;

export interface CharacterContextValue {
  character: Character;
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: string, value: number) => void;
  checkDailyLogin: () => void;
  claimDailyBonus: () => void;
}

export interface QuestContextValue {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
}

export interface InventoryContextValue {
  inventory: GearItem[];
  shopItems: GearItem[];
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  updateInventoryItem: (item: GearItem) => void;
  toggleEquipped: (itemId: string) => void;
}

export interface SkillTreeContextValue {
  skillTree: SkillNode[];
  addSkillNode: (node: Omit<SkillNode, "id">) => string;
  updateSkillNode: (node: SkillNode) => void;
  deleteSkillNode: (nodeId: string) => void;
  unlockSkillNode: (nodeId: string) => void;
}

export interface HabitContextValue {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completionHistory">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string) => void;
  breakHabit: (habitId: string) => void;
}

export interface MoodContextType {
  moods: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  deleteMoodEntry: (entryId: string) => void;
}

export interface AchievementContextValue {
  achievements: Achievement[];
  checkAndUnlockAchievement: (achievementId: string) => boolean;
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
}
