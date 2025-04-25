
import { Character } from './character';
import { Quest } from './quests';
import { GearItem } from './inventory';
import { SkillNode } from './skills';
import { Habit } from './habits';
import { MoodEntry } from './mood';
import { Achievement } from './achievements';
import { JournalEntry } from './journal';
import { ShoppingList } from './shopping';

export interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  skillTree: SkillNode[];
  habits: Habit[];
  moods: MoodEntry[];
  achievements: Achievement[];
  journalEntries?: JournalEntry[];
  shoppingLists?: ShoppingList[];
  lastUpdate?: string;
  version?: string;
}

export interface DataContextType {
  gameData: GameData;
  setGameData: (newData: Partial<GameData>, changedFields?: Set<string>) => void;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  refreshData: () => Promise<void>;
  saveState: {
    isSaving: boolean;
    lastSaveTime: Date | null;
    pendingChanges: Set<string>;
  };
  manualSave: () => Promise<void>;
  
  // Character properties
  character: Character;
  
  // Quest properties
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
  
  // Inventory properties
  inventory: GearItem[];
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  
  // Shop properties
  shopItems: GearItem[];
  purchaseItem: (itemId: string) => boolean;
  addShopItem: (item: GearItem) => void;
  updateShopItem: (item: GearItem) => void;
  deleteShopItem: (itemId: string) => void;
  
  // Habits properties
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "completionHistory">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date?: string) => void;
  uncompleteHabit: (habitId: string, date?: string) => void;
  
  // Mood properties
  moods: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  deleteMoodEntry: (entryId: string) => void;
  
  // Achievement properties
  achievements: Achievement[];
}

export type GameDataUpdater = (newData: Partial<GameData>, changedFields?: Set<string>) => void;
