
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameData } from "@/types/gameData";
import { Character, StatName } from "@/types/character";
import { Quest, QuestStep } from "@/types/quests";
import { GearItem } from "@/types/inventory";
import { SkillNode } from "@/types/skills";
import { Challenge } from "@/types/challenges";
import { Habit, HabitCompletion } from "@/types/habits";
import { MoodEntry } from "@/types/mood";
import { Achievement } from "@/types/achievements";
import { Json } from "@/integrations/supabase/types";

// Helper functions to convert between Supabase and app types
const jsonToString = (value: any): string => {
  return typeof value === 'string' ? value : JSON.stringify(value);
};

// Type conversion helpers
const toQuestSteps = (steps: Json | null): QuestStep[] => {
  if (!steps) return [];
  
  const stepsArray = Array.isArray(steps) ? steps : [];
  return stepsArray.map(step => {
    if (typeof step !== 'object' || step === null) {
      return { id: '', description: '', completed: false };
    }
    return {
      id: typeof step.id === 'string' ? step.id : '',
      description: typeof step.description === 'string' ? step.description : '',
      completed: typeof step.completed === 'boolean' ? step.completed : false
    };
  });
};

const toHabitCompletions = (completions: Json | null): HabitCompletion[] => {
  if (!completions) return [];
  
  const completionsArray = Array.isArray(completions) ? completions : [];
  return completionsArray.map(completion => {
    if (typeof completion !== 'object' || completion === null) {
      return { date: '', completed: false };
    }
    return {
      date: typeof completion.date === 'string' ? completion.date : '',
      completed: typeof completion.completed === 'boolean' ? completion.completed : false
    };
  });
};

// Character methods
export const fetchCharacter = async (): Promise<Character | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching character:", error);
      return null;
    }

    if (!data) return null;

    // Map database fields to Character type
    return {
      name: data.name,
      level: data.level,
      xp: data.xp,
      nextLevelXp: data.next_level_xp,
      coins: data.coins,
      portrait: data.portrait || "/placeholder.svg",
      bio: data.bio || "A brave adventurer ready to conquer life's challenges.",
      stats: data.stats as any,
      lastLoginDate: data.last_login_date,
      loginStreak: data.login_streak,
      dailyBonusClaimed: data.daily_bonus_claimed
    } as Character;
  } catch (error) {
    console.error("Error in fetchCharacter:", error);
    return null;
  }
};

export const upsertCharacter = async (character: Character): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("characters")
      .upsert({
        user_id: user.id,
        name: character.name,
        level: character.level,
        xp: character.xp,
        next_level_xp: character.nextLevelXp,
        coins: character.coins,
        portrait: character.portrait,
        bio: character.bio,
        stats: character.stats,
        last_login_date: character.lastLoginDate,
        login_streak: character.loginStreak,
        daily_bonus_claimed: character.dailyBonusClaimed
      });

    if (error) {
      console.error("Error upserting character:", error);
      toast.error("Failed to save character data");
    }
  } catch (error) {
    console.error("Error in upsertCharacter:", error);
    toast.error("Failed to save character data");
  }
};

// Quests methods
export const fetchQuests = async (): Promise<Quest[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching quests:", error);
      return [];
    }

    // Map database fields to Quest type
    return data.map(quest => ({
      id: quest.id,
      title: quest.title,
      description: quest.description || "",
      type: quest.quest_type,
      difficulty: quest.difficulty || "medium",
      steps: toQuestSteps(quest.steps),
      status: quest.status,
      xpReward: quest.xp_reward,
      coinReward: quest.coin_reward,
      statRewards: quest.stat_rewards as any,
      dueDate: quest.due_date
    } as Quest));
  } catch (error) {
    console.error("Error in fetchQuests:", error);
    return [];
  }
};

export const upsertQuest = async (quest: Quest): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Convert QuestStep[] to Json for storage
    const stepsAsJson = quest.steps.map(step => ({
      id: step.id,
      description: step.description,
      completed: step.completed
    }));

    const { error } = await supabase
      .from("quests")
      .upsert({
        id: quest.id,
        user_id: user.id,
        title: quest.title,
        description: quest.description,
        quest_type: quest.type,
        difficulty: quest.difficulty || "medium",
        due_date: quest.dueDate,
        status: quest.status,
        xp_reward: quest.xpReward,
        coin_reward: quest.coinReward,
        stat_rewards: quest.statRewards,
        steps: stepsAsJson
      });

    if (error) {
      console.error("Error upserting quest:", error);
      toast.error("Failed to save quest data");
    }
  } catch (error) {
    console.error("Error in upsertQuest:", error);
    toast.error("Failed to save quest data");
  }
};

export const deleteQuest = async (questId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId);

    if (error) {
      console.error("Error deleting quest:", error);
      toast.error("Failed to delete quest");
    }
  } catch (error) {
    console.error("Error in deleteQuest:", error);
    toast.error("Failed to delete quest");
  }
};

// Inventory methods
export const fetchInventory = async (): Promise<GearItem[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.type,
      rarity: item.rarity,
      icon: item.icon || "",
      cost: item.cost,
      statBonuses: item.stat_bonuses as any,
      equipped: item.equipped,
      levelRequired: item.level_required || 1
    }) as GearItem);
  } catch (error) {
    console.error("Error in fetchInventory:", error);
    return [];
  }
};

export const upsertInventoryItem = async (item: GearItem): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("inventory_items")
      .upsert({
        id: item.id,
        user_id: user.data.user.id,
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity,
        icon: item.icon,
        cost: item.cost,
        stat_bonuses: item.statBonuses as any,
        equipped: item.equipped,
        level_required: item.levelRequired
      });

    if (error) {
      console.error("Error upserting inventory item:", error);
      toast.error("Failed to save inventory item");
    }
  } catch (error) {
    console.error("Error in upsertInventoryItem:", error);
    toast.error("Failed to save inventory item");
  }
};

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error);
    toast.error("Failed to delete inventory item");
  }
};

// Shop methods
export const fetchShopItems = async (): Promise<GearItem[]> => {
  try {
    const { data, error } = await supabase
      .from("shop_items")
      .select("*");

    if (error) {
      console.error("Error fetching shop items:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.type,
      rarity: item.rarity,
      icon: item.icon || "",
      cost: item.cost,
      statBonuses: item.stat_bonuses as any,
      levelRequired: item.level_required || 1,
      equipped: false // Shop items are not equipped by default
    }) as GearItem);
  } catch (error) {
    console.error("Error in fetchShopItems:", error);
    return [];
  }
};

// Skill Tree methods
export const fetchSkillTree = async (): Promise<SkillNode[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("skill_nodes")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching skill tree:", error);
      return [];
    }

    return data.map(node => ({
      id: node.id,
      name: node.name,
      description: node.description || "",
      icon: node.icon || "",
      unlocked: node.unlocked,
      statBonuses: node.stat_bonuses as any,
      position: node.position as unknown as { x: number, y: number },
      connectedTo: Array.isArray(node.connected_to) ? node.connected_to as string[] : []
    }) as SkillNode);
  } catch (error) {
    console.error("Error in fetchSkillTree:", error);
    return [];
  }
};

export const upsertSkillNode = async (node: SkillNode): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("skill_nodes")
      .upsert({
        id: node.id,
        user_id: user.data.user.id,
        name: node.name,
        description: node.description,
        icon: node.icon,
        unlocked: node.unlocked,
        stat_bonuses: node.statBonuses as any,
        position: node.position as any,
        connected_to: node.connectedTo as any
      });

    if (error) {
      console.error("Error upserting skill node:", error);
      toast.error("Failed to save skill node");
    }
  } catch (error) {
    console.error("Error in upsertSkillNode:", error);
    toast.error("Failed to save skill node");
  }
};

export const deleteSkillNode = async (nodeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("skill_nodes")
      .delete()
      .eq("id", nodeId);

    if (error) {
      console.error("Error deleting skill node:", error);
      toast.error("Failed to delete skill node");
    }
  } catch (error) {
    console.error("Error in deleteSkillNode:", error);
    toast.error("Failed to delete skill node");
  }
};

// Challenges methods
export const fetchChallenges = async (): Promise<Challenge[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description || "",
      frequency: challenge.frequency,
      xpReward: challenge.xp_reward,
      coinReward: challenge.coin_reward,
      statRewards: challenge.stat_rewards as any,
      specialReward: challenge.special_reward as any,
      requiredCount: challenge.required_count,
      currentCount: challenge.current_count,
      status: challenge.status,
      resetDate: challenge.reset_date || ""
    }) as Challenge);
  } catch (error) {
    console.error("Error in fetchChallenges:", error);
    return [];
  }
};

export const upsertChallenge = async (challenge: Challenge): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("challenges")
      .upsert({
        id: challenge.id,
        user_id: user.data.user.id,
        title: challenge.title,
        description: challenge.description,
        frequency: challenge.frequency,
        required_count: challenge.requiredCount,
        current_count: challenge.currentCount,
        status: challenge.status,
        xp_reward: challenge.xpReward,
        coin_reward: challenge.coinReward,
        stat_rewards: challenge.statRewards as any,
        special_reward: challenge.specialReward as any,
        reset_date: challenge.resetDate
      });

    if (error) {
      console.error("Error upserting challenge:", error);
      toast.error("Failed to save challenge");
    }
  } catch (error) {
    console.error("Error in upsertChallenge:", error);
    toast.error("Failed to save challenge");
  }
};

export const deleteChallenge = async (challengeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challengeId);

    if (error) {
      console.error("Error deleting challenge:", error);
      toast.error("Failed to delete challenge");
    }
  } catch (error) {
    console.error("Error in deleteChallenge:", error);
    toast.error("Failed to delete challenge");
  }
};

// Habits methods
export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching habits:", error);
      return [];
    }

    return data.map(habit => ({
      id: habit.id,
      name: habit.name,
      description: habit.description || "",
      icon: habit.icon || "",
      frequency: habit.frequency,
      customDays: habit.custom_days as any,
      streak: habit.streak,
      xpReward: habit.xp_reward,
      coinReward: habit.coin_reward,
      reminder: habit.reminder,
      completionHistory: toHabitCompletions(habit.completion_history),
      color: habit.color
    } as Habit));
  } catch (error) {
    console.error("Error in fetchHabits:", error);
    return [];
  }
};

export const upsertHabit = async (habit: Habit): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Convert HabitCompletion[] to Json for storage
    const completionsAsJson = habit.completionHistory.map(completion => ({
      date: completion.date,
      completed: completion.completed
    }));

    const { error } = await supabase
      .from("habits")
      .upsert({
        id: habit.id,
        user_id: user.id,
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        frequency: habit.frequency,
        custom_days: habit.customDays as any,
        streak: habit.streak,
        xp_reward: habit.xpReward,
        coin_reward: habit.coinReward,
        reminder: habit.reminder,
        completion_history: completionsAsJson,
        color: habit.color
      });

    if (error) {
      console.error("Error upserting habit:", error);
      toast.error("Failed to save habit");
    }
  } catch (error) {
    console.error("Error in upsertHabit:", error);
    toast.error("Failed to save habit");
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
    }
  } catch (error) {
    console.error("Error in deleteHabit:", error);
    toast.error("Failed to delete habit");
  }
};

// Mood entries methods
export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching mood entries:", error);
      return [];
    }

    return data.map(entry => ({
      id: entry.id,
      date: entry.date,
      mood: entry.mood,
      notes: entry.notes || ""
    }) as MoodEntry);
  } catch (error) {
    console.error("Error in fetchMoodEntries:", error);
    return [];
  }
};

export const upsertMoodEntry = async (entry: MoodEntry): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("mood_entries")
      .upsert({
        id: entry.id,
        user_id: user.data.user.id,
        date: entry.date,
        mood: entry.mood,
        notes: entry.notes
      });

    if (error) {
      console.error("Error upserting mood entry:", error);
      toast.error("Failed to save mood entry");
    }
  } catch (error) {
    console.error("Error in upsertMoodEntry:", error);
    toast.error("Failed to save mood entry");
  }
};

export const deleteMoodEntry = async (entryId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("mood_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Error deleting mood entry:", error);
      toast.error("Failed to delete mood entry");
    }
  } catch (error) {
    console.error("Error in deleteMoodEntry:", error);
    toast.error("Failed to delete mood entry");
  }
};

// Achievements methods
export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description || "",
      category: achievement.category,
      icon: achievement.icon || "",
      xpReward: achievement.xp_reward,
      coinReward: achievement.coin_reward,
      specialReward: achievement.special_reward as any,
      unlocked: achievement.unlocked,
      dateUnlocked: achievement.date_unlocked || undefined,
      requiredCount: achievement.required_count,
      currentCount: achievement.current_count
    }) as Achievement);
  } catch (error) {
    console.error("Error in fetchAchievements:", error);
    return [];
  }
};

export const upsertAchievement = async (achievement: Achievement): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("achievements")
      .upsert({
        id: achievement.id,
        user_id: user.data.user.id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        xp_reward: achievement.xpReward,
        coin_reward: achievement.coinReward,
        special_reward: achievement.specialReward as any,
        unlocked: achievement.unlocked,
        date_unlocked: achievement.dateUnlocked,
        required_count: achievement.requiredCount,
        current_count: achievement.currentCount
      });

    if (error) {
      console.error("Error upserting achievement:", error);
      toast.error("Failed to save achievement");
    }
  } catch (error) {
    console.error("Error in upsertAchievement:", error);
    toast.error("Failed to save achievement");
  }
};

export const deleteAchievement = async (achievementId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", achievementId);

    if (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement");
    }
  } catch (error) {
    console.error("Error in deleteAchievement:", error);
    toast.error("Failed to delete achievement");
  }
};

// Initial data loading
export const loadAllGameData = async (): Promise<Partial<GameData>> => {
  try {
    const character = await fetchCharacter();
    const quests = await fetchQuests();
    const inventory = await fetchInventory();
    const shopItems = await fetchShopItems();
    const skillTree = await fetchSkillTree();
    const challenges = await fetchChallenges();
    const habits = await fetchHabits();
    const moods = await fetchMoodEntries();
    const achievements = await fetchAchievements();

    return {
      character: character || undefined,
      quests,
      inventory,
      shopItems,
      skillTree,
      challenges,
      habits,
      moods,
      achievements
    };
  } catch (error) {
    console.error("Error loading game data:", error);
    toast.error("Failed to load game data");
    return {};
  }
};
