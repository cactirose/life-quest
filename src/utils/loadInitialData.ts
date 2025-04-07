import { generateId } from "./idGenerator";
import { DEFAULT_CHARACTER } from "../types/character";
import { SAMPLE_QUESTS } from "../types/quests";
import { SAMPLE_SHOP_ITEMS } from "../types/inventory";
import { SAMPLE_SKILL_TREE } from "../types/skills";
import { SAMPLE_HABITS } from "../types/habits";
import { SAMPLE_ACHIEVEMENTS } from "../types/achievements";
import { GameData } from "../types/gameData";
import { StatName, Stats } from "../types/character";
import { GearItem, GearRarity, GearType } from "../types/inventory";
import { MoodEntry, MoodType } from "../types/mood";
import { Quest, QuestStatus, QuestType } from "../types/quests";
import { SkillNode } from "../types/skills";
import { Achievement, AchievementCategory } from "../types/achievements";

// Load data from localStorage or use defaults with samples
export const loadInitialGameData = async (): Promise<Partial<GameData>> => {
  try {
    const savedData = localStorage.getItem("rpgProductivityData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("Loaded data from localStorage:", parsedData);
      
      // Validate data has required collections
      if (!parsedData.challenges) parsedData.challenges = [];
      if (!parsedData.inventory) parsedData.inventory = [];
      if (!parsedData.habits) parsedData.habits = [];
      if (!parsedData.quests) parsedData.quests = [];
      if (!parsedData.skillTree) parsedData.skillTree = [];
      if (!parsedData.shopItems) parsedData.shopItems = [];
      if (!parsedData.moods) parsedData.moods = [];
      if (!parsedData.achievements) parsedData.achievements = [];
      
      return {
        character: parsedData.character || undefined,
        quests: parsedData.quests || [],
        inventory: parsedData.inventory || [],
        shopItems: parsedData.shopItems || [],
        skillTree: parsedData.skillTree || [],
        habits: parsedData.habits || [],
        moods: parsedData.moods || [],
        achievements: parsedData.achievements || [],
        journalEntries: [],
        shoppingLists: []
      };
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
      character: DEFAULT_CHARACTER,
      quests: SAMPLE_QUESTS.map(quest => ({ 
        ...quest, 
        id: generateId(),
        steps: quest.steps.map(step => ({ ...step, id: step.id || generateId() }))
      })),
      inventory: [], // Ensure inventory is explicitly set
      shopItems: SAMPLE_SHOP_ITEMS.map(item => ({ ...item, id: generateId() })),
      skillTree: SAMPLE_SKILL_TREE.map(node => ({ ...node, id: generateId() })),
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
      })),
      moods: [],
      journalEntries: [],
      shoppingLists: []
    };
  } catch (error) {
    console.error("Error loading initial game data:", error);
    return {};
  }
};
