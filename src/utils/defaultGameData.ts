
import { GameData } from "../types/gameData";
import { DEFAULT_CHARACTER } from "../types/character";

// Initial Empty Data
export const DEFAULT_GAME_DATA: GameData = {
  character: DEFAULT_CHARACTER,
  quests: [],
  inventory: [],
  shopItems: [],
  skillTree: [],
  challenges: [],
  habits: [],
  moods: [],
  achievements: [],
  
  // Character methods
  setCharacter: () => {},
  updateCharacterStat: () => {},
  
  // Quest methods
  addQuest: () => {},
  updateQuest: () => {},
  deleteQuest: () => {},
  completeQuestStep: () => {},
  completeQuest: () => {},
  
  // Inventory methods
  addToInventory: () => {},
  removeFromInventory: () => {},
  equipItem: () => {},
  unequipItem: () => {},
  
  // Shop methods
  purchaseItem: () => false,
  addShopItem: () => {},       // Added missing method
  updateShopItem: () => {},    // Added missing method
  deleteShopItem: () => {},    // Added missing method
  
  // Skill tree methods
  addSkillNode: () => "",
  updateSkillNode: () => {},
  deleteSkillNode: () => {},
  unlockSkillNode: () => {},
  
  // Challenge methods
  addChallenge: () => {},
  updateChallenge: () => {},
  deleteChallenge: () => {},
  incrementChallengeProgress: () => {},
  resetChallenges: () => {},
  completeChallenge: () => {},
  
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
