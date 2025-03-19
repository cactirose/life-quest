import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Character stats types
export type StatName = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

export type Stats = {
  [key in StatName]: number;
};

// Character type
export interface Character {
  name: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  portrait: string;
  bio: string;
  stats: Stats;
  lastLoginDate: string | null;
  loginStreak: number;
  dailyBonusClaimed: boolean;
}

// Quest types
export type QuestType = "main" | "side" | "boss";
export type QuestStatus = "active" | "completed";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  steps: QuestStep[];
  xpReward: number;
  coinReward: number;
  statRewards: Partial<Stats>;
}

// Gear types
export type GearType = "weapon" | "armor" | "accessory";
export type GearRarity = "common" | "rare" | "epic" | "legendary";

export interface GearItem {
  id: string;
  name: string;
  description: string;
  type: GearType;
  rarity: GearRarity;
  icon: string; // path to icon image
  cost: number;
  statBonuses: Partial<Stats>;
  equipped: boolean;
  levelRequired: number;
}

// Skill tree types
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  statBonuses: Partial<Stats>;
  position: { x: number, y: number };
  connectedTo: string[];
}

// Challenge types
export type ChallengeFrequency = "daily" | "weekly" | "monthly";
export type ChallengeStatus = "active" | "completed";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  xpReward: number;
  coinReward: number;
  specialReward?: GearItem;
  status: ChallengeStatus;
  requiredCount: number; // Number of tasks/habits/etc. to complete
  currentCount: number; // Current progress
  resetDate: string; // When the challenge resets
  statRewards: Partial<Stats>;
}

// Habit types
export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly" | "custom";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  frequency: HabitFrequency;
  customDays?: DayOfWeek[];
  streak: number;
  xpReward: number;
  coinReward: number;
  reminder?: string; // Time string for reminder
  completionHistory: HabitCompletion[];
  color: string; // CSS color for the habit
}

// Mood types
export type MoodType = "happy" | "motivated" | "neutral" | "tired" | "stressed" | "sad";

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodType;
  notes?: string;
}

// Achievement types
export type AchievementCategory = "quests" | "habits" | "skills" | "character" | "general";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  dateUnlocked?: string;
  requiredCount?: number; // For tracked achievements (e.g., complete 10 quests)
  currentCount?: number;
  specialReward?: GearItem;
}

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
  addSkillNode: (node: Omit<SkillNode, "id">) => void;
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

// Initial Stats
const DEFAULT_STATS: Stats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

// Initial Character
const DEFAULT_CHARACTER: Character = {
  name: "Adventurer",
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  coins: 50,
  portrait: "/placeholder.svg",
  bio: "A brave adventurer ready to conquer life's challenges.",
  stats: { ...DEFAULT_STATS },
  lastLoginDate: null,
  loginStreak: 0,
  dailyBonusClaimed: false
};

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
  addSkillNode: () => {},
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

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sample data for first run
const SAMPLE_QUESTS: Omit<Quest, "id">[] = [
  {
    title: "Begin Your Journey",
    description: "Complete these tasks to start your adventure!",
    type: "main",
    status: "active",
    steps: [
      { id: generateId(), description: "Create your character", completed: false },
      { id: generateId(), description: "Add your first custom quest", completed: false },
      { id: generateId(), description: "Explore the skill tree", completed: false }
    ],
    xpReward: 50,
    coinReward: 20,
    statRewards: { wisdom: 1, charisma: 1 }
  },
  {
    title: "Daily Exercise",
    description: "Stay active and healthy!",
    type: "side",
    status: "active",
    steps: [
      { id: generateId(), description: "30 minutes of cardio", completed: false },
      { id: generateId(), description: "15 minutes of stretching", completed: false }
    ],
    xpReward: 25,
    coinReward: 10,
    statRewards: { strength: 1, constitution: 1 }
  }
];

const SAMPLE_SHOP_ITEMS: GearItem[] = [
  {
    id: generateId(),
    name: "Wooden Sword",
    description: "A basic training sword",
    type: "weapon",
    rarity: "common",
    icon: "⚔️",
    cost: 20,
    statBonuses: { strength: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: generateId(),
    name: "Leather Armor",
    description: "Simple protective gear",
    type: "armor",
    rarity: "common",
    icon: "🛡️",
    cost: 30,
    statBonuses: { constitution: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: generateId(),
    name: "Scholar's Tome",
    description: "A book of ancient knowledge",
    type: "accessory",
    rarity: "rare",
    icon: "📖",
    cost: 50,
    statBonuses: { intelligence: 2, wisdom: 1 },
    equipped: false,
    levelRequired: 2
  },
  {
    id: generateId(),
    name: "Charming Amulet",
    description: "Makes you more likable",
    type: "accessory",
    rarity: "rare",
    icon: "📿",
    cost: 50,
    statBonuses: { charisma: 3 },
    equipped: false,
    levelRequired: 2
  },
  {
    id: generateId(),
    name: "Swift Boots",
    description: "Increases your agility",
    type: "armor",
    rarity: "rare",
    icon: "👢",
    cost: 65,
    statBonuses: { dexterity: 3 },
    equipped: false,
    levelRequired: 3
  },
  {
    id: generateId(),
    name: "Dragon Slayer",
    description: "A legendary blade",
    type: "weapon",
    rarity: "legendary",
    icon: "🗡️",
    cost: 200,
    statBonuses: { strength: 5, dexterity: 2 },
    equipped: false,
    levelRequired: 5
  }
];

const SAMPLE_SKILL_TREE: Omit<SkillNode, "id">[] = [
  {
    name: "Adventurer Basics",
    description: "The foundation of your journey",
    icon: "🌟",
    unlocked: true,
    statBonuses: { strength: 1, constitution: 1 },
    position: { x: 400, y: 300 },
    connectedTo: []
  }
];

// Sample challenges for first run
const SAMPLE_CHALLENGES: Omit<Challenge, "id">[] = [
  {
    title: "Daily Quester",
    description: "Complete 3 quest steps in a single day",
    frequency: "daily",
    xpReward: 25,
    coinReward: 15,
    status: "active",
    requiredCount: 3,
    currentCount: 0,
    resetDate: new Date(new Date().setHours(0, 0, 0, 0) + 86400000).toISOString(), // tomorrow
    statRewards: { wisdom: 1 }
  },
  {
    title: "Weekly Warrior",
    description: "Complete 5 quests this week",
    frequency: "weekly",
    xpReward: 100,
    coinReward: 50,
    status: "active",
    requiredCount: 5,
    currentCount: 0,
    resetDate: new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))).toISOString(), // next Sunday
    statRewards: { strength: 1, dexterity: 1 }
  },
  {
    title: "Monthly Mastermind",
    description: "Complete 15 quests this month",
    frequency: "monthly",
    xpReward: 250,
    coinReward: 150,
    specialReward: {
      id: generateId(),
      name: "Champion's Medallion",
      description: "A rare medallion awarded to those who consistently complete their quests",
      type: "accessory",
      rarity: "epic",
      icon: "🏅",
      cost: 200,
      statBonuses: { wisdom: 2, charisma: 2 },
      equipped: false,
      levelRequired: 3
    },
    status: "active",
    requiredCount: 15,
    currentCount: 0,
    resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(), // first day of next month
    statRewards: { intelligence: 2, wisdom: 2 }
  }
];

// Sample habits for first run
const SAMPLE_HABITS: Omit<Habit, "id" | "completionHistory" | "streak">[] = [
  {
    name: "Drink Water",
    description: "Stay hydrated by drinking water throughout the day",
    icon: "💧",
    frequency: "daily",
    xpReward: 10,
    coinReward: 5,
    reminder: "10:00",
    color: "#4682B4" // blue
  },
  {
    name: "Exercise",
    description: "Do at least 30 minutes of physical activity",
    icon: "🏃",
    frequency: "weekdays",
    xpReward: 20,
    coinReward: 10,
    reminder: "18:00",
    color: "#2E8B57" // green
  },
  {
    name: "Read",
    description: "Read for at least 20 minutes",
    icon: "📚",
    frequency: "daily",
    xpReward: 15,
    coinReward: 5,
    color: "#DAA520" // goldenrod
  }
];

// Sample achievements for first run
const SAMPLE_ACHIEVEMENTS: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">[] = [
  {
    title: "First Steps",
    description: "Complete your first quest",
    category: "quests",
    icon: "🏆",
    xpReward: 25,
    coinReward: 15,
    requiredCount: 1,
    currentCount: 0
  },
  {
    title: "Habit Master",
    description: "Maintain a 7-day streak in any habit",
    category: "habits",
    icon: "🌟",
    xpReward: 50,
    coinReward: 25,
    requiredCount: 7,
    currentCount: 0
  },
  {
    title: "Skill Hunter",
    description: "Unlock 3 skills in the skill tree",
    category: "skills",
    icon: "🔍",
    xpReward: 75,
    coinReward: 40,
    requiredCount: 3,
    currentCount: 0
  },
  {
    title: "Well Equipped",
    description: "Own a set of gear (weapon, armor, and accessory)",
    category: "character",
    icon: "⚔️",
    xpReward: 100,
    coinReward: 50
  }
];

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
      quests: SAMPLE_QUESTS.map(quest => ({ ...quest, id: generateId() })),
      shopItems: SAMPLE_SHOP_ITEMS,
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

  // Check daily login on mount
  useEffect(() => {
    checkDailyLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Daily reset challenges check
  useEffect(() => {
    resetChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CHARACTER METHODS
  const setCharacter = (character: Character) => {
    setGameData(prevData => ({
      ...prevData,
      character
    }));
  };

  const updateCharacterStat = (stat: StatName, value: number) => {
    setGameData(prevData => ({
      ...prevData,
      character: {
        ...prevData.character,
        stats: {
          ...prevData.character.stats,
          [stat]: value
        }
      }
    }));
  };

  // QUEST METHODS 
  const addQuest = (quest: Omit<Quest, "id">) => {
    const newQuest = {
      ...quest,
      id: generateId(),
      steps: quest.steps.map(step => ({
        ...step,
        id: step.id || generateId()
      }))
    };

    setGameData(prevData => ({
      ...prevData,
      quests: [...prevData.quests, newQuest]
    }));
  };

  const updateQuest = (quest: Quest) => {
    setGameData(prevData => ({
      ...prevData,
      quests: prevData.quests.map(q => 
        q.id === quest.id ? quest : q
      )
    }));
  };

  const deleteQuest = (questId: string) => {
    setGameData(prevData => ({
      ...prevData,
      quests: prevData.quests.filter(q => q.id !== questId)
    }));
  };

  const completeQuestStep = (questId: string, stepId: string) => {
    setGameData(prevData => {
      const updatedQuests = prevData.quests.map(quest => {
        if (quest.id !== questId) return quest;

        const updatedSteps = quest.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );

        return { ...quest, steps: updatedSteps };
      });

      return { ...prevData, quests: updatedQuests };
    });
  };

  const completeQuest = (questId: string) => {
    setGameData(prevData => {
      const quest = prevData.quests.find(q => q.id === questId);
      if (!quest || quest.status === "completed") return prevData;

      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + quest.xpReward,
        coins: prevData.character.coins + quest.coinReward,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(quest.statRewards).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Stats)
        }
      };

      // Update quest status
      const updatedQuests = prevData.quests.map(q => 
        q.id === questId ? { ...q, status: "completed" as QuestStatus } : q
      );

      return { 
        ...prevData, 
        character: updatedCharacter,
        quests: updatedQuests
      };
    });
  };

  // SHOP & INVENTORY METHODS
  const addToInventory = (item: GearItem) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: [...prevData.inventory, { ...item, id: item.id || generateId() }]
    }));
  };

  const removeFromInventory = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: prevData.inventory.filter(item => item.id !== itemId)
    }));
  };

  const equipItem = (itemId: string) => {
    setGameData(prevData => {
      const itemToEquip = prevData.inventory.find(item => item.id === itemId);
      if (!itemToEquip) return prevData;

      // Unequip any other items of the same type
      const updatedInventory = prevData.inventory.map(item => {
        if (item.type === itemToEquip.type) {
          return { ...item, equipped: item.id === itemId };
        }
        return item;
      });

      return { ...prevData, inventory: updatedInventory };
    });
  };

  const unequipItem = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: prevData.inventory.map(item => 
        item.id === itemId ? { ...item, equipped: false } : item
      )
    }));
  };

  // SKILL TREE METHODS
  const addSkillNode = (node: Omit<SkillNode, "id">) => {
    const newNode = {
      ...node,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      skillTree: [...prevData.skillTree, newNode]
    }));

    return newNode.id;
  };

  const updateSkillNode = (node: SkillNode) => {
    setGameData(prevData => ({
      ...prevData,
      skillTree: prevData.skillTree.map(n => 
        n.id === node.id ? node : n
      )
    }));
  };

  const deleteSkillNode = (nodeId: string) => {
    setGameData(prevData => {
      // Remove the node
      const updatedSkillTree = prevData.skillTree.filter(n => n.id !== nodeId);
      
      // Remove any connections to this node
      return {
        ...prevData,
        skillTree: updatedSkillTree.map(node => ({
          ...node,
          connectedTo: node.connectedTo.filter(id => id !== nodeId)
        }))
      };
    });
  };

  const unlockSkillNode = (nodeId: string) => {
    setGameData(prevData => {
      const node = prevData.skillTree.find(n => n.id === nodeId);
      if (!node || node.unlocked) return prevData;

      // Apply stat bonuses
      const updatedCharacter = {
        ...prevData.character,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(node.statBonuses).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Stats)
        }
      };

      // Mark as unlocked
      const updatedSkillTree = prevData.skillTree.map(n => 
        n.id === nodeId ? { ...n, unlocked: true } : n
      );

      return { 
        ...prevData, 
        character: updatedCharacter,
        skillTree: updatedSkillTree
      };
    });
  };

  // CHALLENGE METHODS
  const addChallenge = (challenge: Omit<Challenge, "id">) => {
    const newChallenge = {
      ...challenge,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      challenges: [...prevData.challenges, newChallenge]
    }));
  };

  const updateChallenge = (challenge: Challenge) => {
    setGameData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.map(c => 
        c.id === challenge.id ? challenge : c
      )
    }));
  };

  const deleteChallenge = (challengeId: string) => {
    setGameData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.filter(c => c.id !== challengeId)
    }));
  };

  const incrementChallengeProgress = (challengeId: string) => {
    setGameData(prevData => {
      const updatedChallenges = prevData.challenges.map(challenge => {
        if (challenge.id !== challengeId || challenge.status === "completed") return challenge;
        
        const newCount = challenge.currentCount + 1;
        return {
          ...challenge,
          currentCount: newCount,
          status: newCount >= challenge.requiredCount ? "completed" as ChallengeStatus : challenge.status
        };
      });
      
      return { ...prevData, challenges: updatedChallenges };
    });
  };
  
  const resetChallenges = () => {
    const today = new Date();
    
    setGameData(prevData => {
      const updatedChallenges = prevData.challenges.map(challenge => {
        const resetDate = new Date(challenge.resetDate);
        
        // If this challenge needs to be reset
        if (today >= resetDate) {
          let newResetDate: Date;
          
          // Calculate next reset date based on frequency
          switch (challenge.frequency) {
            case "daily":
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + 1);
              newResetDate.setHours(0, 0, 0, 0);
              break;
            case "weekly":
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + (7 - today.getDay()));
              newResetDate.setHours(0, 0, 0, 0);
              break;
            case "monthly":
              newResetDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
              break;
            default:
              newResetDate = new Date(today);
              newResetDate.setDate(today.getDate() + 1);
          }
          
          return {
            ...challenge,
            status: "active" as ChallengeStatus,
            currentCount: 0,
            resetDate: newResetDate.toISOString()
          };
        }
        
        return challenge;
      });
      
      return { ...prevData, challenges: updatedChallenges };
    });
  };
  
  const completeChallenge = (challengeId: string) => {
    setGameData(prevData => {
      const challenge = prevData.challenges.find(c => c.id === challengeId);
      if (!challenge || challenge.status === "completed") return prevData;
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + challenge.xpReward,
        coins: prevData.character.coins + challenge.coinReward,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(challenge.statRewards).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Stats)
        }
      };
      
      // Add special reward to inventory if provided
      let updatedInventory = [...prevData.inventory];
      if (challenge.specialReward) {
        updatedInventory = [...updatedInventory, {
          ...challenge.specialReward,
          id: challenge.specialReward.id || generateId()
        }];
      }
      
      // Update challenge status
      const updatedChallenges = prevData.challenges.map(c => 
        c.id === challengeId ? { ...c, status: "completed" as ChallengeStatus } : c
      );
      
      return { 
        ...prevData, 
        character: updatedCharacter,
        inventory: updatedInventory,
        challenges: updatedChallenges
      };
    });
  };

  // HABIT METHODS
  const addHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    const newHabit = {
      ...habit,
      id: generateId(),
      completionHistory: [],
      streak: 0
    };

    setGameData(prevData => ({
      ...prevData,
      habits: [...prevData.habits, newHabit]
    }));
  };

  const updateHabit = (habit: Habit) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.map(h => 
        h.id === habit.id ? habit : h
      )
    }));
  };

  const deleteHabit = (habitId: string) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.filter(h => h.id !== habitId)
    }));
  };

  const completeHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      // Check if already completed for this date
      const existingCompletion = habit.completionHistory.find(c => c.date === date);
      if (existingCompletion?.completed) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = existingCompletion
        ? habit.completionHistory.map(c => c.date === date ? { ...c, completed: true } : c)
        : [...habit.completionHistory, { date, completed: true }];
      
      // Calculate new streak
      const sortedHistory = [...updatedCompletionHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let newStreak = 0;
      // Calculate streak based on frequency
      if (habit.frequency === "daily") {
        // For daily habits, check consecutive days
        for (let i = 0; i < sortedHistory.length; i++) {
          if (!sortedHistory[i].completed) break;
          
          const currentDate = new Date(sortedHistory[i].date);
          if (i > 0) {
            const prevDate = new Date(sortedHistory[i-1].date);
            const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff !== 1) break;
          }
          
          newStreak++;
        }
      } else if (habit.frequency === "weekly") {
        // For weekly habits, count weeks with completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      } else {
        // For other frequencies, just count completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      }
      
      // Update habit
      const updatedHabit = {
        ...habit,
        completionHistory: updatedCompletionHistory,
        streak: newStreak
      };
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + habit.xpReward,
        coins: prevData.character.coins + habit.coinReward
      };
      
      // Check if any challenges should be updated
      let updatedChallenges = [...prevData.challenges];
      const habitChallenges = updatedChallenges.filter(
        c => c.status === "active" && 
        (c.title.toLowerCase().includes("habit") || c.description.toLowerCase().includes("habit"))
      );
      
      if (habitChallenges.length > 0) {
        updatedChallenges = updatedChallenges.map(challenge => {
          if (habitChallenges.find(c => c.id === challenge.id)) {
            const newCount = challenge.currentCount + 1;
            return {
              ...challenge,
              currentCount: newCount,
              status: newCount >= challenge.requiredCount ? "completed" as ChallengeStatus : challenge.status
            };
          }
          return challenge;
        });
      }
      
      // Check if any achievements should be updated
      let updatedAchievements = [...prevData.achievements];
      const habitAchievements = updatedAchievements.filter(
        a => !a.unlocked && a.category === "habits" && a.requiredCount && a.currentCount !== undefined
      );
      
      if (habitAchievements.length > 0) {
        updatedAchievements = updatedAchievements.map(achievement => {
          if (habitAchievements.find(a => a.id === achievement.id)) {
            if (achievement.title === "Habit Master" && newStreak >= (achievement.requiredCount || 0)) {
              return {
                ...achievement,
                unlocked: true,
                dateUnlocked: new Date().toISOString(),
                currentCount: newStreak
              };
            } else if (achievement.currentCount !== undefined) {
              const newCount = achievement.currentCount + 1;
              const newUnlocked = newCount >= (achievement.requiredCount || 0);
              
              return {
                ...achievement,
                currentCount: newCount,
                unlocked: newUnlocked,
                dateUnlocked: newUnlocked ? new Date().toISOString() : undefined
              };
            }
          }
          return achievement;
        });
      }
      
      return {
        ...prevData,
        character: updatedCharacter,
        habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
        challenges: updatedChallenges,
        achievements: updatedAchievements
      };
    });
  };
  
  const uncompleteHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habit = prevData.habits.find(h => h.id === habitId);
      if (!habit) return prevData;
      
      // Check if completed for this date
      const existingCompletion = habit.completionHistory.find(c => c.date === date);
      if (!existingCompletion?.completed) return prevData;
      
      // Update completion history
      const updatedCompletionHistory = habit.completionHistory.map(c => 
        c.date === date ? { ...c, completed: false } : c
      );
      
      // Recalculate streak
      const sortedHistory = [...updatedCompletionHistory]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let newStreak = 0;
      // Calculate streak based on frequency
      if (habit.frequency === "daily") {
        // For daily habits, check consecutive days
        for (let i = 0; i < sortedHistory.length; i++) {
          if (!sortedHistory[i].completed) break;
          
          const currentDate = new Date(sortedHistory[i].date);
          if (i > 0) {
            const prevDate = new Date(sortedHistory[i-1].date);
            const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff !== 1) break;
          }
          
          newStreak++;
        }
      } else if (habit.frequency === "weekly") {
        // For weekly habits, count weeks with completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      } else {
        // For other frequencies, just count completions
        newStreak = sortedHistory.filter(c => c.completed).length;
      }
      
      // Update habit
      const updatedHabit = {
        ...habit,
        completionHistory: updatedCompletionHistory,
        streak: newStreak
      };
      
      // Remove rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: Math.max(0, prevData.character.xp - habit.xpReward),
        coins: Math.max(0, prevData.character.coins - habit.coinReward)
      };
      
      return {
        ...prevData,
        character: updatedCharacter,
        habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
      };
    });
  };

  // MOOD METHODS
  const addMoodEntry = (entry: Omit<MoodEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      moods: [...prevData.moods, newEntry]
    }));
  };

  const updateMoodEntry = (entry: MoodEntry) => {
    setGameData(prevData => ({
      ...prevData,
      moods: prevData.moods.map(m => 
        m.id === entry.id ? entry : m
      )
    }));
  };

  const deleteMoodEntry = (entryId: string) => {
    setGameData(prevData => ({
      ...prevData,
      moods: prevData.moods.filter(m => m.id !== entryId)
    }));
  };

  // ACHIEVEMENT METHODS
  const addAchievement = (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => {
    const newAchievement = {
      ...achievement,
      id: generateId(),
      unlocked: false
    };

    setGameData(prevData => ({
      ...prevData,
      achievements: [...prevData.achievements, newAchievement]
    }));
  };

  const updateAchievement = (achievement: Achievement) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.map(a => 
        a.id === achievement.id ? achievement : a
      )
    }));
  };

  const deleteAchievement = (achievementId: string) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.filter(a => a.id !== achievementId)
    }));
  };

  const checkAndUnlockAchievement = (achievementId: string): boolean => {
    let unlocked = false;
    
    setGameData(prevData => {
      const achievement = prevData.achievements.find(a => a.id === achievementId);
      if (!achievement || achievement.unlocked) return prevData;
      
      unlocked = true;
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + achievement.xpReward,
        coins: prevData.character.coins + achievement.coinReward
      };
      
      // Add special reward to inventory if provided
      let updatedInventory = [...prevData.inventory];
      if (achievement.specialReward) {
        updatedInventory = [...updatedInventory, {
          ...achievement.specialReward,
          id: achievement.specialReward.id || generateId()
        }];
      }
      
      // Update achievement status
      const updatedAchievements = prevData.achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlocked: true, dateUnlocked: new Date().toISOString() } 
          : a
      );
      
      return { 
        ...prevData, 
        character: updatedCharacter,
        inventory: updatedInventory,
        achievements: updatedAchievements
      };
    });
    
    return unlocked;
  };

  // DAILY LOGIN METHODS
  const checkDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setGameData(prevData => {
      const { character } = prevData;
      const lastLoginDate = character.lastLoginDate 
        ? new Date(character.lastLoginDate).toISOString().split('T')[0]
        : null;
      
      // First login ever
      if (!lastLoginDate) {
        return {
          ...prevData,
          character: {
            ...character,
            lastLoginDate: today,
            loginStreak: 1,
            dailyBonusClaimed: false
          }
        };
      }
      
      // Same day login, do nothing
      if (lastLoginDate === today) {
        return prevData;
      }
      
      // Check if this is consecutive day
      const lastLogin = new Date(lastLoginDate);
      const currentDate = new Date(today);
      
      const timeDiff = currentDate.getTime() - lastLogin.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // Consecutive day
      if (dayDiff === 1) {
        return {
          ...prevData,
          character: {
            ...character,
            lastLoginDate: today,
            loginStreak: character.loginStreak + 1,
            dailyBonusClaimed: false
          }
        };
      }
      
      // Not consecutive, reset streak
      return {
        ...prevData,
        character: {
          ...character,
          lastLoginDate: today,
          loginStreak: 1,
          dailyBonusClaimed: false
        }
      };
    });
  };
  
  const claimDailyBonus = () => {
    setGameData(prevData => {
      const { character } = prevData;
      
      if (character.dailyBonusClaimed) return prevData;
      
      // Calculate bonus based on streak
      const streak = character.loginStreak;
      let xpBonus = 10 * streak;
      let coinBonus = 5 * streak;
      
      // Cap at reasonable values
      xpBonus = Math.min(xpBonus, 100);
      coinBonus = Math.min(coinBonus, 50);
      
      // Every 7 days, give a special bonus
      let specialItem: GearItem | null = null;
      if (streak % 7 === 0) {
        specialItem = {
          id: generateId(),
          name: `${streak}-Day Streak Trophy`,
          description: `Awarded for logging in ${streak} days in a row!`,
          type: "accessory",
          rarity: streak >= 28 ? "legendary" : streak >= 14 ? "epic" : streak >= 7 ? "rare" : "common",
          icon: "🏆",
          cost: 100,
          statBonuses: { charisma: Math.floor(streak / 7) },
          equipped: false,
          levelRequired: 1
        };
      }
      
      // Update character
      const updatedCharacter = {
        ...character,
        xp: character.xp + xpBonus,
        coins: character.coins + coinBonus,
        dailyBonusClaimed: true
      };
      
      // Update inventory if special item
      const updatedInventory = specialItem
        ? [...prevData.inventory, specialItem]
        : prevData.inventory;
      
      return {
        ...prevData,
        character: updatedCharacter,
        inventory: updatedInventory
      };
    });
  };

  const contextValue: GameData = {
    ...gameData,
    setCharacter,
    updateCharacterStat,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuestStep,
    completeQuest,
    addToInventory,
    removeFromInventory,
    equipItem,
    unequipItem,
    purchaseItem,
    addSkillNode,
    updateSkillNode,
    deleteSkillNode,
    unlockSkillNode,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    incrementChallengeProgress,
    resetChallenges,
    completeChallenge,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    checkAndUnlockAchievement,
    checkDailyLogin,
    claimDailyBonus
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const useGameData = () => useContext(DataContext);
