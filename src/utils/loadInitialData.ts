
import { DEFAULT_GAME_DATA } from './defaultGameData';
import { Quest, QuestStatus, QuestType } from '../types/quests';
import { Habit } from '../types/habits';
import { Achievement } from '../types/achievements';
import { Character } from '../types/character';
import { Inventory } from '../types/inventory';
import { SkillTree } from '../types/skills';
import { Mood } from '../types/mood';
import { Challenge } from '../types/challenges';
import { generateId } from './idGenerator';

export interface LoadInitialDataParams {
  resetCharacter?: boolean;
  resetQuests?: boolean;
  resetHabits?: boolean;
  resetAchievements?: boolean;
  resetInventory?: boolean;
  resetSkillTree?: boolean;
  resetMoods?: boolean;
  resetChallenges?: boolean;
}

export function loadInitialData({
  resetCharacter = false,
  resetQuests = false,
  resetHabits = false,
  resetAchievements = false,
  resetInventory = false,
  resetSkillTree = false,
  resetMoods = false,
  resetChallenges = false,
}: LoadInitialDataParams = {}) {
  const loadedData = {
    character: DEFAULT_GAME_DATA.character,
    quests: DEFAULT_GAME_DATA.quests,
    habits: DEFAULT_GAME_DATA.habits,
    achievements: DEFAULT_GAME_DATA.achievements,
    inventory: DEFAULT_GAME_DATA.inventory,
    skillTrees: DEFAULT_GAME_DATA.skillTrees,
    moods: DEFAULT_GAME_DATA.moods,
    challenges: DEFAULT_GAME_DATA.challenges
  };

  const storedData = localStorage.getItem('gameData');

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      
      // Only load from storage if not resetting
      if (!resetCharacter && parsedData.character) {
        loadedData.character = parsedData.character;
      }
      
      if (!resetQuests && parsedData.quests) {
        loadedData.quests = parsedData.quests;
      }
      
      if (!resetHabits && parsedData.habits) {
        loadedData.habits = parsedData.habits;
      }
      
      if (!resetAchievements && parsedData.achievements) {
        loadedData.achievements = parsedData.achievements;
      }
      
      if (!resetInventory && parsedData.inventory) {
        loadedData.inventory = parsedData.inventory;
      }
      
      if (!resetSkillTree && parsedData.skillTrees) {
        loadedData.skillTrees = parsedData.skillTrees;
      }

      if (!resetMoods && parsedData.moods) {
        loadedData.moods = parsedData.moods;
      }

      if (!resetChallenges && parsedData.challenges) {
        loadedData.challenges = parsedData.challenges;
      }
    } catch (error) {
      console.error('Error parsing stored game data:', error);
    }
  }

  return loadedData;
}
