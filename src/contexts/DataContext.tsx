
import { createContext, useContext } from "react";
import { CombinedProvider } from "./CombinedProvider";
import { useGameDataManager } from "../hooks/gameData";
import { DEFAULT_GAME_DATA } from "../utils/defaultGameData";
import { useDataEffects } from "../hooks/useDataEffects";
import { GameData } from "../types/gameData";

// Create context providers
import {
  createCharacterContextValue,
  CharacterContext,
} from "./CharacterContext";
import { createQuestContextValue, QuestContext } from "./QuestContext";
import {
  createInventoryContextValue,
  InventoryContext,
} from "./InventoryContext";
import {
  createSkillTreeContextValue,
  SkillTreeContext,
} from "./SkillTreeContext";
import { createHabitContextValue, HabitContext } from "./HabitContext";
import { createMoodContextValue, MoodContext } from "./MoodContext";
import {
  createAchievementContextValue,
  AchievementContext,
} from "./AchievementContext";

// Create context
export const DataContext = createContext<GameData>(DEFAULT_GAME_DATA);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { gameData, setGameData } = useGameDataManager();

  // Create contexts
  const characterContextValue = createCharacterContextValue(
    gameData.character,
    setGameData
  );
  const questContextValue = createQuestContextValue(
    gameData.quests,
    setGameData
  );
  const inventoryContextValue = createInventoryContextValue(
    gameData.inventory,
    gameData.shopItems,
    setGameData
  );
  const skillTreeContextValue = createSkillTreeContextValue(
    gameData.skillTree,
    setGameData
  );
  const habitContextValue = createHabitContextValue(
    gameData.habits,
    setGameData
  );
  const moodContextValue = createMoodContextValue(gameData.moods, setGameData);
  const achievementContextValue = createAchievementContextValue(
    gameData.achievements,
    setGameData
  );

  // Handle side effects by explicitly passing the character context value
  useDataEffects(characterContextValue);

  // Combined context value
  const contextValue: GameData = {
    ...gameData,
    ...characterContextValue,
    ...questContextValue,
    ...inventoryContextValue,
    ...skillTreeContextValue,
    ...habitContextValue,
    ...moodContextValue,
    ...achievementContextValue,
    setGameData: setGameData,
  };

  // Use combined provider pattern
  return (
    <DataContext.Provider value={contextValue}>
      <CombinedProvider
        contextValue={contextValue}
        characterContextValue={characterContextValue}
        questContextValue={questContextValue}
        inventoryContextValue={inventoryContextValue}
        skillTreeContextValue={skillTreeContextValue}
        habitContextValue={habitContextValue}
        moodContextValue={moodContextValue}
        achievementContextValue={achievementContextValue}
      >
        {children}
      </CombinedProvider>
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const useGameData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useGameData must be used within a DataProvider");
  }
  return context;
};

// Re-export types
export type { Character, StatName, Stats } from "../types/character";
export type { Quest, QuestType, QuestStatus, QuestStep } from "../types/quests";
export type { GearItem, GearType, GearRarity } from "../types/inventory";
export type { SkillNode } from "../types/skills";
export type {
  Habit,
  HabitFrequency,
  HabitCompletion,
  DayOfWeek,
} from "../types/habits";
export type { MoodEntry, MoodType } from "../types/mood";
export type { Achievement, AchievementCategory } from "../types/achievements";
export type { GameData } from "../types/gameData";
