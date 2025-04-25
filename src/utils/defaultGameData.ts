
import { GameData } from "../types/gameData";
import { DEFAULT_CHARACTER } from "../types/character";

// Initial Empty Data
export const DEFAULT_GAME_DATA: GameData = {
  character: DEFAULT_CHARACTER,
  quests: [],
  inventory: [],
  shopItems: [],
  skillTree: [],
  habits: [],
  moods: [],
  achievements: [],
  journalEntries: [], // Add empty journal entries array
  shoppingLists: [] // Add empty shopping lists array
};
