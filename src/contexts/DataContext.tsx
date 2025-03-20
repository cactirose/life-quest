import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DEFAULT_CHARACTER, Character, StatName } from "../types/character";
import { Quest } from "../types/quests";
import { GearItem } from "../types/inventory";
import { SkillNode } from "../types/skills";
import { Challenge } from "../types/challenges";
import { Habit } from "../types/habits";
import { MoodEntry } from "../types/mood";
import { Achievement } from "../types/achievements";
import { generateId } from "../utils/idGenerator";
import { SAMPLE_QUESTS } from "../types/quests";
import { SAMPLE_SHOP_ITEMS } from "../types/inventory";
import { SAMPLE_SKILL_TREE } from "../types/skills";
import { SAMPLE_CHALLENGES } from "../types/challenges";
import { SAMPLE_HABITS } from "../types/habits";
import { SAMPLE_ACHIEVEMENTS } from "../types/achievements";

// Create context providers
import { createCharacterContextValue, CharacterContext } from "./CharacterContext";
import { createQuestContextValue, QuestContext } from "./QuestContext";
import { createInventoryContextValue, InventoryContext } from "./InventoryContext";
import { createSkillTreeContextValue, SkillTreeContext } from "./SkillTreeContext";
import { createChallengeContextValue, ChallengeContext } from "./ChallengeContext";
import { createHabitContextValue, HabitContext } from "./HabitContext";
import { createMoodContextValue, MoodContext } from "./MoodContext";
import { createAchievementContextValue, AchievementContext } from "./AchievementContext";

// The actual data structure
interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  skillTree: SkillNode[];
  challenges: Challenge[];
  habits: Habit[];
  moods: MoodEntry[];
  achievements: Achievement[];
  
  // Character methods
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  
  // Quest methods
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
  
  // Inventory methods
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  
  // Shop methods
  purchaseItem: (itemId: string) => boolean;
  
  // Skill tree methods
  addSkillNode: (node: Omit<SkillNode, "id">) => string;
  updateSkillNode: (node: SkillNode) => void;
  deleteSkillNode: (nodeId: string) => void;
  unlockSkillNode: (nodeId: string) => void;
  
  // Challenge methods
  addChallenge: (challenge: Omit<Challenge, "id">) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
  incrementChallengeProgress: (challengeId: string) => void;
  resetChallenges: () => void;
  completeChallenge: (challengeId: string) => void;
  
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

// Initial Empty Data
const DEFAULT_GAME_DATA: GameData = {
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

// Create context
const DataContext = createContext<GameData>(DEFAULT_GAME_DATA);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load data from localStorage or use defaults with samples
  const loadInitialData = (): GameData => {
    const savedData = localStorage.getItem("rpgProductivityData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // Get tomorrow date for the initial daily challenge
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Get next Sunday for the initial weekly challenge
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
    nextSunday.setHours(0, 0, 0, 0);
    
    // Get first day of next month for the initial monthly challenge
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);
    
    // First time setup with sample data
    return {
      ...DEFAULT_GAME_DATA,
      quests: SAMPLE_QUESTS.map(quest => ({ 
        ...quest, 
        id: generateId(),
        steps: quest.steps.map(step => ({ ...step, id: step.id || generateId() }))
      })),
      shopItems: SAMPLE_SHOP_ITEMS.map(item => ({ ...item, id: generateId() })),
      skillTree: SAMPLE_SKILL_TREE.map(node => ({ ...node, id: generateId() })),
      challenges: SAMPLE_CHALLENGES.map(challenge => ({
        ...challenge,
        id: generateId(),
        resetDate: challenge.frequency === "daily" 
          ? tomorrow.toISOString()
          : challenge.frequency === "weekly"
            ? nextSunday.toISOString()
            : nextMonth.toISOString()
      })),
      habits: SAMPLE_HABITS.map(habit => ({
        ...habit,
        id: generateId(),
        completionHistory: [],
        streak: 0
      })),
      achievements: SAMPLE_ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        id: generateId(),
        unlocked: false
      }))
    };
  };

  const [gameData, setGameData] = useState<GameData>(loadInitialData);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
  }, [gameData]);

  // Check for level up
  useEffect(() => {
    const { character } = gameData;
    if (character.xp >= character.nextLevelXp) {
      // Level up!
      setGameData(prevData => ({
        ...prevData,
        character: {
          ...prevData.character,
          level: prevData.character.level + 1,
          xp: prevData.character.xp - prevData.character.nextLevelXp,
          nextLevelXp: Math.floor(prevData.character.nextLevelXp * 1.5),
          coins: prevData.character.coins + 25 // Level up bonus
        }
      }));
      
      // Display level up notification
      console.log("Level up!");
    }
  }, [gameData.character.xp]);

  // Create contexts
  const characterContextValue = createCharacterContextValue(gameData.character, setGameData);
  const questContextValue = createQuestContextValue(gameData.quests, setGameData);
  const inventoryContextValue = createInventoryContextValue(gameData.inventory, gameData.shopItems, setGameData);
  const skillTreeContextValue = createSkillTreeContextValue(gameData.skillTree, setGameData);
  const challengeContextValue = createChallengeContextValue(gameData.challenges, setGameData);
  const habitContextValue = createHabitContextValue(gameData.habits, setGameData);
  const moodContextValue = createMoodContextValue(gameData.moods, setGameData);
  const achievementContextValue = createAchievementContextValue(gameData.achievements, setGameData);

  // Check daily login on mount
  useEffect(() => {
    characterContextValue.checkDailyLogin();
  }, []);

  // Daily reset challenges check
  useEffect(() => {
    challengeContextValue.resetChallenges();
  }, []);

  // Combined context value
  const contextValue: GameData = {
    ...gameData,
    ...characterContextValue,
    ...questContextValue,
    ...inventoryContextValue,
    ...skillTreeContextValue,
    ...challengeContextValue,
    ...habitContextValue,
    ...moodContextValue,
    ...achievementContextValue
  };

  // Use nested provider pattern
  return (
    <DataContext.Provider value={contextValue}>
      <CharacterContext.Provider value={characterContextValue}>
        <QuestContext.Provider value={questContextValue}>
          <InventoryContext.Provider value={inventoryContextValue}>
            <SkillTreeContext.Provider value={skillTreeContextValue}>
              <ChallengeContext.Provider value={challengeContextValue}>
                <HabitContext.Provider value={habitContextValue}>
                  <MoodContext.Provider value={moodContextValue}>
                    <AchievementContext.Provider value={achievementContextValue}>
                      {children}
                    </AchievementContext.Provider>
                  </MoodContext.Provider>
                </HabitContext.Provider>
              </ChallengeContext.Provider>
            </SkillTreeContext.Provider>
          </InventoryContext.Provider>
        </QuestContext.Provider>
      </CharacterContext.Provider>
    </DataContext.Provider>
  );
};

// Custom hook for using the context - for backward compatibility
export const useGameData = () => useContext(DataContext);

// Re-export types
export type { Character, StatName, Stats } from "../types/character";
export type { Quest, QuestType, QuestStatus, QuestStep } from "../types/quests";
export type { GearItem, GearType, GearRarity } from "../types/inventory";
export type { SkillNode } from "../types/skills";
export type { Challenge, ChallengeFrequency, ChallengeStatus } from "../types/challenges";
export type { Habit, HabitFrequency, HabitCompletion, DayOfWeek } from "../types/habits";
export type { MoodEntry, MoodType } from "../types/mood";
export type { Achievement, AchievementCategory } from "../types/achievements";
