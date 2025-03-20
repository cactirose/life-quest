
import { generateId } from "./idGenerator";
import { DEFAULT_CHARACTER } from "../types/character";
import { SAMPLE_QUESTS } from "../types/quests";
import { SAMPLE_SHOP_ITEMS } from "../types/inventory";
import { SAMPLE_SKILL_TREE } from "../types/skills";
import { SAMPLE_CHALLENGES } from "../types/challenges";
import { SAMPLE_HABITS } from "../types/habits";
import { SAMPLE_ACHIEVEMENTS } from "../types/achievements";
import { GameData } from "../types/gameData";

// Load data from localStorage or use defaults with samples
export const loadInitialData = (): Omit<GameData, keyof Omit<GameData, 'character' | 'quests' | 'inventory' | 'shopItems' | 'skillTree' | 'challenges' | 'habits' | 'moods' | 'achievements'>> => {
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
    character: DEFAULT_CHARACTER,
    quests: SAMPLE_QUESTS.map(quest => ({ 
      ...quest, 
      id: generateId(),
      steps: quest.steps.map(step => ({ ...step, id: step.id || generateId() }))
    })),
    inventory: [], // Ensure inventory is explicitly set
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
    })),
    moods: []
  };
};
