import { GameData } from "../types/gameData";
import { DEFAULT_CHARACTER } from "../types/character";
import { SAMPLE_SKILLS } from "@/types/skills";

// Initial Empty Data
export const DEFAULT_GAME_DATA: GameData = {
  character: DEFAULT_CHARACTER,
  quests: [],
  inventory: [],
  shopItems: [],
  skills: [],
  skillTree: [],
  habits: [],
  moods: [],
  achievements: [],
  journalEntries: [],
  shoppingLists: [],
  
  // Character methods
  setCharacter: () => {},
  updateCharacterStat: () => {},
  
  // Quest methods
  addQuest: () => {},
  updateQuest: () => {},
  deleteQuest: () => {},
  completeQuestStep: () => {},
  completeQuest: () => Promise.resolve(),
  
  // Inventory methods
  addToInventory: () => {},
  removeFromInventory: () => {},
  equipItem: () => {},
  unequipItem: () => {},
  
  // Shop methods
  purchaseItem: () => false,
  addShopItem: () => {},
  updateShopItem: () => {},
  deleteShopItem: () => {},
  
  // Skill methods
  addSkill: async () => "",
  updateSkill: async () => {},
  deleteSkill: async () => {},
  addXpToSkill: async () => {},

  // Habit methods
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  completeHabit: () => {},
  uncompleteHabit: () => {},
  
  // Mood methods
  addMoodEntry: () => {},
  updateMoodEntry: () => {},
  deleteMoodEntry: () => {},
  
  // Achievement methods
  addAchievement: () => {},
  updateAchievement: () => {},
  deleteAchievement: () => {},
  checkAndUnlockAchievement: () => false,
  
  // Daily login methods
  checkDailyLogin: () => {},
  claimDailyBonus: () => {}
};
