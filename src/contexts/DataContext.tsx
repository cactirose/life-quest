
import { createContext, useContext } from "react";
import { GameData } from "@/types/gameData";
import { useGameDataManager } from "@/hooks/gameData/useGameDataManager";
import { useDataEffects } from "@/hooks/useDataEffects";
import { Skill } from "@/types/skills";
import { generateId } from "@/utils/idGenerator";
import { addSkill as addSkillService, updateSkill as updateSkillService, deleteSkill as deleteSkillService } from "@/services/skillService";
import { toast } from "sonner";

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
  const addSkill = async (skillData: Omit<Skill, "id" | "createdAt">) => {
    try {
      // First add to Supabase to get the real ID
      const skillId = await addSkillService(skillData);
      
      if (!skillId) {
        throw new Error("Failed to add skill to database");
      }

      // Then update local state with the real ID from Supabase
      const newSkill: Skill = {
        ...skillData,
        id: skillId,
        createdAt: new Date()
      };

      setGameData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));

      return skillId;
    } catch (error) {
      console.error("Error in addSkill:", error);
      toast.error("Failed to add skill");
      return null;
    }
  };

  const updateSkill = async (skill: Skill) => {
    try {
      // First update in Supabase
      const success = await updateSkillService(skill);
      
      if (!success) {
        throw new Error("Failed to update skill in database");
      }

      // Then update local state
      setGameData(prev => ({
        ...prev,
        skills: prev.skills.map(s => s.id === skill.id ? skill : s)
      }));
    } catch (error) {
      console.error("Error in updateSkill:", error);
      toast.error("Failed to update skill");
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      // First delete from Supabase
      const success = await deleteSkillService(skillId);
      
      if (!success) {
        throw new Error("Failed to delete skill from database");
      }

      // Then update local state
      setGameData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s.id !== skillId)
      }));
    } catch (error) {
      console.error("Error in deleteSkill:", error);
      toast.error("Failed to delete skill");
    }
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
