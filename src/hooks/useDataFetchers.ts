
import { useGameData } from "@/contexts/DataContext";
import { Character } from "@/types/character";
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "./useDataStatus";

export const useDataFetchers = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchCharacter = async () => {
    try {
      const { character } = await import('@/services/characterService').then(module => ({
        character: module.fetchCharacter()
      }));
      
      const data = await character;
      if (data) {
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
      }
    } catch (error) {
      console.error("Error loading character:", error);
      updateStatus('character', 'error');
    }
  };
  
  const fetchQuests = async () => {
    try {
      const { quests } = await import('@/services/questService').then(module => ({
        quests: module.fetchQuests()
      }));
      
      const data = await quests;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, quests: data }));
      }
      updateStatus('quests', 'loaded');
    } catch (error) {
      console.error("Error loading quests:", error);
      updateStatus('quests', 'error');
    }
  };
  
  const fetchInventory = async () => {
    try {
      const { inventory, shopItems } = await import('@/services/inventoryService').then(module => ({
        inventory: module.fetchInventory(),
        shopItems: module.fetchShopItems()
      }));
      
      const inventoryData = await inventory;
      const shopItemsData = await shopItems;
      
      if (inventoryData && inventoryData.length > 0) {
        setGameData(prev => ({ ...prev, inventory: inventoryData }));
      }
      
      if (shopItemsData && shopItemsData.length > 0) {
        setGameData(prev => ({ ...prev, shopItems: shopItemsData }));
      }
      
      updateStatus('inventory', 'loaded');
    } catch (error) {
      console.error("Error loading inventory or shop items:", error);
      updateStatus('inventory', 'error');
    }
  };
  
  const fetchSkillTree = async () => {
    try {
      const { skillTree } = await import('@/services/skillTreeService').then(module => ({
        skillTree: module.fetchSkillTree()
      }));
      
      const data = await skillTree;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, skillTree: data }));
      }
      updateStatus('skillTree', 'loaded');
    } catch (error) {
      console.error("Error loading skill tree:", error);
      updateStatus('skillTree', 'error');
    }
  };
  
  const fetchChallenges = async () => {
    try {
      const { challenges } = await import('@/services/challengeService').then(module => ({
        challenges: module.fetchChallenges()
      }));
      
      const data = await challenges;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, challenges: data }));
      }
      updateStatus('challenges', 'loaded');
    } catch (error) {
      console.error("Error loading challenges:", error);
      updateStatus('challenges', 'error');
    }
  };
  
  const fetchHabits = async () => {
    try {
      const { habits } = await import('@/services/habitService').then(module => ({
        habits: module.fetchHabits()
      }));
      
      const data = await habits;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, habits: data }));
      }
      updateStatus('habits', 'loaded');
    } catch (error) {
      console.error("Error loading habits:", error);
      updateStatus('habits', 'error');
    }
  };
  
  const fetchMoods = async () => {
    try {
      const { moods } = await import('@/services/moodService').then(module => ({
        moods: module.fetchMoodEntries()
      }));
      
      const data = await moods;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, moods: data }));
      }
      updateStatus('moods', 'loaded');
    } catch (error) {
      console.error("Error loading moods:", error);
      updateStatus('moods', 'error');
    }
  };
  
  const fetchAchievements = async () => {
    try {
      const { achievements } = await import('@/services/achievementService').then(module => ({
        achievements: module.fetchAchievements()
      }));
      
      const data = await achievements;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, achievements: data }));
      }
      updateStatus('achievements', 'loaded');
    } catch (error) {
      console.error("Error loading achievements:", error);
      updateStatus('achievements', 'error');
    }
  };

  return {
    fetchCharacter,
    fetchQuests,
    fetchInventory,
    fetchSkillTree,
    fetchChallenges,
    fetchHabits,
    fetchMoods,
    fetchAchievements
  };
};
