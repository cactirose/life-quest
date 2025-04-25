
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { CombinedProvider } from "./CombinedProvider";
import { useGameDataManager } from "@/hooks/gameData/useGameDataManager";
import { DEFAULT_GAME_DATA } from "../utils/defaultGameData";
import { useDataEffects } from "../hooks/useDataEffects";
import { GameData, DataContextType } from "@/types/gameData";
import { DEFAULT_CHARACTER } from "@/types/character";
import { SaveButton } from "@/components/ui/SaveButton";
import { CharacterProvider } from "./CharacterContext";

// Create context providers
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

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const {
    gameData,
    setGameData,
    isLoading,
    loadingProgress,
    error,
    refreshData,
    saveState,
    manualSave
  } = useGameDataManager();
  
  const [mounted, setMounted] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure gameData has all required properties with defaults
  const safeGameData = {
    ...DEFAULT_GAME_DATA,
    ...gameData,
    character: {
      ...DEFAULT_CHARACTER,
      ...(gameData?.character || {})
    }
  };

  // Create contexts
  const questContextValue = createQuestContextValue(
    safeGameData.quests || [],
    setGameData
  );
  const inventoryContextValue = createInventoryContextValue(
    safeGameData.inventory || [],
    safeGameData.shopItems || [],
    setGameData
  );
  const skillTreeContextValue = createSkillTreeContextValue(
    safeGameData.skillTree || [],
    setGameData
  );
  const habitContextValue = createHabitContextValue(
    safeGameData.habits || [],
    setGameData
  );
  const moodContextValue = createMoodContextValue(safeGameData.moods || [], setGameData);
  const achievementContextValue = createAchievementContextValue(
    safeGameData.achievements || [],
    setGameData
  );

  // Handle side effects
  useDataEffects(safeGameData, setGameData);

  // Modified: Wrap the return of manualSave to ensure it returns Promise<void>
  const manualSaveWrapper = async (): Promise<void> => {
    await manualSave();
  };

  // Create the full context value with all required properties
  const contextValue: DataContextType = {
    gameData: safeGameData,
    setGameData,
    isLoading,
    loadingProgress,
    error,
    refreshData,
    saveState,
    manualSave: manualSaveWrapper,  // Use the wrapper function
    
    // Add direct properties for easier access throughout the app
    character: safeGameData.character,
    quests: safeGameData.quests,
    inventory: safeGameData.inventory,
    shopItems: safeGameData.shopItems,
    habits: safeGameData.habits, 
    moods: safeGameData.moods,
    achievements: safeGameData.achievements,
    
    // Add methods from context values
    ...questContextValue,
    ...inventoryContextValue,
    // Update equipItem and unequipItem to use the correct method names
    equipItem: inventoryContextValue.equipItem,
    unequipItem: inventoryContextValue.unequipItem,
    ...habitContextValue,
    ...moodContextValue,
    ...achievementContextValue
  };

  // Don't render anything on server or during hydration to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <DataContext.Provider value={contextValue}>
      <CharacterProvider>
        <CombinedProvider
          contextValue={contextValue}
          questContextValue={questContextValue}
          inventoryContextValue={inventoryContextValue}
          skillTreeContextValue={skillTreeContextValue}
          habitContextValue={habitContextValue}
          moodContextValue={moodContextValue}
          achievementContextValue={achievementContextValue}
        >
          {children}
          
          {/* Global Save Button */}
          <SaveButton 
            isSaving={saveState.isSaving}
            lastSaveTime={saveState.lastSaveTime}
            onSave={manualSaveWrapper}
            pendingChanges={saveState.pendingChanges}
          />
        </CombinedProvider>
      </CharacterProvider>
    </DataContext.Provider>
  );
}

export function useGameData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useGameData must be used within a DataProvider");
  }
  return context;
}

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
