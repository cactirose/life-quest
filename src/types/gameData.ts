import { Character, StatName } from "./character";
import { Quest } from "./quests";
import { GearItem } from "./inventory";
import { Skill } from "./skills";
import { Habit } from "./habits";
import { MoodEntry } from "./mood";
import { Achievement } from "./achievements";
import { JournalEntry } from "./journal";
import { ShoppingList } from "./shoppingList";

// The actual data structure
export interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  skills: Skill[];
  habits: Habit[];
  moods: MoodEntry[];
  achievements: Achievement[];
  journalEntries: JournalEntry[];
  shoppingLists: ShoppingList[];
  
  // Character methods
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  
  // Quest methods
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => Promise<void>;
  
  // Inventory methods
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  
  // Shop methods
  purchaseItem: (itemId: string) => boolean;
  addShopItem: (item: Omit<GearItem, "id">) => void;
  updateShopItem: (item: GearItem) => void;
  deleteShopItem: (itemId: string) => void;
  
  // Skill methods
  addSkill: (skill: Omit<Skill, "id" | "createdAt">) => string;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (skillId: string) => void;
  
  // Habit methods
  addHabit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
  
  // Mood methods
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  deleteMoodEntry: (entryId: string) => void;
  
  // Achievement methods
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
  checkAndUnlockAchievement: (achievementId: string) => boolean;
  
  // Daily login methods
  checkDailyLogin: () => void;
  claimDailyBonus: () => void;
}
