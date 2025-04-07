import { Achievement } from "../types/achievements";
import { Character, StatName } from "../types/character";
import { Habit } from "../types/habits";
import { Item } from "../types/inventory";
import { JournalEntry } from "../types/journal";
import { Quest } from "../types/quests";
import { SkillTree } from "../types/skills";
import { Challenge } from "../types/challenges";

// Character Context Types
export type CharacterContextType = {
  character: Character;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  updateStat: (stat: StatName, amount: number) => void;
  resetCharacter: () => void;
  updateCharacter: (character: Character) => void;
  claimDailyBonus: (xp: number, coins: number) => void;
};

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
  inventory: Item[];
  shopItems: Item[];
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  purchaseItem: (itemId: string) => boolean;
}

// Skill Tree Context Types
export interface SkillTreeContextType {
  skillTree: SkillTree[];
  addSkillNode: (node: Omit<SkillTree, "id">) => string;
  updateSkillNode: (node: SkillTree) => void;
  deleteSkillNode: (nodeId: string) => void;
  unlockSkillNode: (nodeId: string) => void;
}

// Challenge Context Types
export interface ChallengeContextType {
  challenges: Challenge[];
  addChallenge: (challenge: Omit<Challenge, "id">) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
  incrementChallengeProgress: (challengeId: string) => void;
  resetChallenges: () => void;
  completeChallenge: (challengeId: string) => void;
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
  moods: JournalEntry[];
  addMoodEntry: (entry: Omit<JournalEntry, "id">) => void;
  updateMoodEntry: (entry: JournalEntry) => void;
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
