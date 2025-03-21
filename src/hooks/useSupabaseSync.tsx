
import { useEffect, useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { loadAllGameData } from "@/services";
import { toast } from "sonner";
import { loadInitialData } from "@/utils/loadInitialData";
import { storeSession } from "@/utils/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Character } from "@/types/character";

export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataStatus, setDataStatus] = useState({
    character: 'loading',
    quests: 'loading',
    inventory: 'loading',
    skillTree: 'loading',
    challenges: 'loading',
    habits: 'loading',
    moods: 'loading',
    achievements: 'loading'
  });
  const gameContext = useGameData();
  const { setGameData } = gameContext;

  // Load user data from Supabase when authenticated
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, load their data from Supabase
        setIsSyncing(true);
        storeSession(session);
        
        // Get local data first for immediate display
        const localData = localStorage.getItem("rpgProductivityData");
        const initialData = localData ? JSON.parse(localData) : loadInitialData();
        
        // First set initial data to show something immediately
        if (initialData) {
          // If we have a character name from the user's profile, use it
          if (session?.user?.user_metadata?.username) {
            initialData.character.name = session.user.user_metadata.username;
          }
          
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
        }
        
        // Then progressively update with remote data as it comes in
        const fetchCharacter = async () => {
          try {
            const { character } = await import('@/services/characterService').then(module => ({
              character: module.fetchCharacter()
            }));
            
            const data = await character;
            if (data) {
              setGameData(prev => ({ ...prev, character: data }));
              setDataStatus(prev => ({ ...prev, character: 'loaded' }));
            }
          } catch (error) {
            console.error("Error loading character:", error);
            setDataStatus(prev => ({ ...prev, character: 'error' }));
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
            setDataStatus(prev => ({ ...prev, quests: 'loaded' }));
          } catch (error) {
            console.error("Error loading quests:", error);
            setDataStatus(prev => ({ ...prev, quests: 'error' }));
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
            
            setDataStatus(prev => ({ ...prev, inventory: 'loaded' }));
          } catch (error) {
            console.error("Error loading inventory or shop items:", error);
            setDataStatus(prev => ({ ...prev, inventory: 'error' }));
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
            setDataStatus(prev => ({ ...prev, skillTree: 'loaded' }));
          } catch (error) {
            console.error("Error loading skill tree:", error);
            setDataStatus(prev => ({ ...prev, skillTree: 'error' }));
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
            setDataStatus(prev => ({ ...prev, challenges: 'loaded' }));
          } catch (error) {
            console.error("Error loading challenges:", error);
            setDataStatus(prev => ({ ...prev, challenges: 'error' }));
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
            setDataStatus(prev => ({ ...prev, habits: 'loaded' }));
          } catch (error) {
            console.error("Error loading habits:", error);
            setDataStatus(prev => ({ ...prev, habits: 'error' }));
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
            setDataStatus(prev => ({ ...prev, moods: 'loaded' }));
          } catch (error) {
            console.error("Error loading moods:", error);
            setDataStatus(prev => ({ ...prev, moods: 'error' }));
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
            setDataStatus(prev => ({ ...prev, achievements: 'loaded' }));
          } catch (error) {
            console.error("Error loading achievements:", error);
            setDataStatus(prev => ({ ...prev, achievements: 'error' }));
          }
        };
        
        // Start loading data in parallel
        Promise.all([
          fetchCharacter(),
          fetchQuests(),
          fetchInventory(),
          fetchSkillTree(),
          fetchChallenges(),
          fetchHabits(),
          fetchMoods(),
          fetchAchievements(),
        ]).finally(() => {
          setIsSyncing(false);
          setIsLoading(false);
          toast.success("Your data has been synced from the cloud");
        });
        
      } else {
        // No session, use local data
        const localData = localStorage.getItem("rpgProductivityData");
        const initialData = localData ? JSON.parse(localData) : loadInitialData();
        
        setGameData(prevData => ({
          ...prevData,
          ...initialData,
        }));
        console.log("Using local data (user not logged in)");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your data");
      
      // Fallback to local data
      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();
      
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      setIsLoading(false);
    }
  };

  // Subscribe to auth changes
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN') {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          // Reset to local data when signing out
          const initialData = loadInitialData();
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
          toast.info("Signed out - using local data");
        }
      }
    );

    // Initial load
    loadUserData();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, isSyncing, dataStatus };
}
