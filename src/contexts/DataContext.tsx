import { createContext, useContext } from "react";
import { GameData } from "@/types/gameData";
import { useGameDataManager } from "@/hooks/gameData/useGameDataManager";
import { useDataEffects } from "@/hooks/useDataEffects";
import { Skill } from "@/types/skills";
import { generateId } from "@/utils/idGenerator";

// Import all context-related items in grouped imports
import {
  createCharacterContextValue,
  CharacterContext,
} from "./CharacterContext";
import { 
  createQuestContextValue, 
  QuestContext 
} from "./QuestContext";
import {
  createInventoryContextValue,
  InventoryContext,
} from "./InventoryContext";
import { 
  createHabitContextValue, 
  HabitContext 
} from "./HabitContext";
import { 
  createMoodContextValue, 
  MoodContext 
} from "./MoodContext";
import {
  createAchievementContextValue,
  AchievementContext,
  AchievementProvider,
} from "./AchievementContext";

// Create context
export const DataContext = createContext<GameData | null>(null);

export const useGameData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useGameData must be used within a DataProvider");
  }
  return context;
};

interface CombinedProviderProps {
  contextValue: GameData;
  children: React.ReactNode;
}

const CombinedProvider = ({ contextValue, children }: CombinedProviderProps) => {
  useDataEffects(contextValue);
  return children;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { gameData, setGameData } = useGameDataManager();

  // Create contexts
  const characterContextValue = createCharacterContextValue(
    gameData.character,
    setGameData
  );
  const questContextValue = createQuestContextValue(
    gameData.quests,
    gameData.achievements,
    gameData.skills,
    setGameData
  );
  const inventoryContextValue = createInventoryContextValue(
    gameData.inventory,
    gameData.shopItems,
    setGameData
  );
  const habitContextValue = createHabitContextValue(
    gameData,
    setGameData
  );
  const moodContextValue = createMoodContextValue(gameData.moods, setGameData);

  // Add these functions
  const addSkill = (skillData: Omit<Skill, "id" | "createdAt">) => {
    const id = generateId();
    const skill: Skill = {
      ...skillData,
      id,
      createdAt: new Date()
    };
    
    setGameData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    
    return id;
  };

  const updateSkill = (skill: Skill) => {
    setGameData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === skill.id ? skill : s)
    }));
  };

  const deleteSkill = (skillId: string) => {
    setGameData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId)
    }));
  };

  // Combined context value
  const contextValue: GameData = {
    ...gameData,
    ...characterContextValue,
    ...questContextValue,
    ...inventoryContextValue,
    ...habitContextValue,
    ...moodContextValue,
    skills: gameData.skills,
    addSkill,
    updateSkill,
    deleteSkill,
  };

  return (
    <DataContext.Provider value={contextValue}>
      <AchievementProvider 
        achievements={gameData.achievements}
        setGameData={setGameData}
      >
        <CombinedProvider contextValue={contextValue}>
          {children}
        </CombinedProvider>
      </AchievementProvider>
    </DataContext.Provider>
  );
};

// Re-export types
export type { Character, StatName, Stats } from "../types/character";
export type { Quest, QuestType, QuestStatus, QuestStep } from "../types/quests";
export type { GearItem, GearType, GearRarity } from "../types/inventory";
export type { Skill } from "../types/skills";
export type {
  Habit,
  HabitFrequency,
  HabitCompletion,
  DayOfWeek,
} from "../types/habits";
export type { MoodEntry, MoodType } from "../types/mood";
export type { Achievement, AchievementCategory } from "../types/achievements";
export type { GameData } from "../types/gameData";
