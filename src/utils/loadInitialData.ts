
import { generateId } from "./idGenerator";
import { DEFAULT_CHARACTER } from "../types/character";
import { SAMPLE_QUESTS } from "../types/quests";
import { SAMPLE_SHOP_ITEMS } from "../types/inventory";
import { SAMPLE_SKILLS } from "../types/skills";
import { SAMPLE_HABITS } from "../types/habits";
import { SAMPLE_ACHIEVEMENTS } from "../types/achievements";
import { GameData } from "../types/gameData";

// Load data from localStorage or use defaults with samples
export const loadInitialData = (): Omit<GameData, keyof Omit<GameData, 'character' | 'quests' | 'inventory' | 'shopItems' | 'skills' | 'habits' | 'moods' | 'achievements'>> => {
  const savedData = localStorage.getItem("rpgProductivityData");
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      console.log("Loaded data from localStorage:", parsedData);
      
      // Validate data has required collections
      if (!parsedData.inventory) parsedData.inventory = [];
      if (!parsedData.habits) parsedData.habits = [];
      if (!parsedData.quests) parsedData.quests = [];
      if (!parsedData.skills) parsedData.skills = [];
      if (!parsedData.shopItems) parsedData.shopItems = [];
      if (!parsedData.moods) parsedData.moods = [];
      if (!parsedData.achievements) parsedData.achievements = [];
      
      return parsedData;
    } catch (error) {
      console.error("Error parsing saved data:", error);
    }
  }
  
  // First time setup with sample data
  return {
    character: DEFAULT_CHARACTER,
    quests: SAMPLE_QUESTS.map(quest => ({ 
      ...quest, 
      id: generateId(),
      steps: quest.steps.map(step => ({ ...step, id: step.id || generateId() }))
    })),
    inventory: [],
    shopItems: SAMPLE_SHOP_ITEMS.map(item => ({ ...item, id: generateId() })),
    skills: SAMPLE_SKILLS.map(skill => ({ ...skill, id: generateId(), createdAt: new Date() })),
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
    moods: []
  };
};
