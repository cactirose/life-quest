
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
}

// Quest types
export type QuestType = "main" | "side";
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

// The actual data structure
interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  skillTree: SkillNode[];
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  addSkillNode: (node: Omit<SkillNode, "id">) => void;
  updateSkillNode: (node: SkillNode) => void;
  deleteSkillNode: (nodeId: string) => void;
  unlockSkillNode: (nodeId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  completeQuest: (questId: string) => void;
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
  stats: { ...DEFAULT_STATS }
};

// Initial Empty Data
const DEFAULT_GAME_DATA: GameData = {
  character: DEFAULT_CHARACTER,
  quests: [],
  inventory: [],
  shopItems: [],
  skillTree: [],
  setCharacter: () => {},
  updateCharacterStat: () => {},
  addQuest: () => {},
  updateQuest: () => {},
  deleteQuest: () => {},
  completeQuestStep: () => {},
  addToInventory: () => {},
  removeFromInventory: () => {},
  equipItem: () => {},
  unequipItem: () => {},
  addSkillNode: () => {},
  updateSkillNode: () => {},
  deleteSkillNode: () => {},
  unlockSkillNode: () => {},
  purchaseItem: () => false,
  completeQuest: () => {}
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

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load data from localStorage or use defaults with samples
  const loadInitialData = (): GameData => {
    const savedData = localStorage.getItem("rpgProductivityData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // First time setup with sample data
    return {
      ...DEFAULT_GAME_DATA,
      quests: SAMPLE_QUESTS.map(quest => ({ ...quest, id: generateId() })),
      shopItems: SAMPLE_SHOP_ITEMS,
      skillTree: SAMPLE_SKILL_TREE.map(node => ({ ...node, id: generateId() }))
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

  // Character methods
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

  // Quest methods
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

  // Inventory methods
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

  // Skill tree methods
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

  // Shop methods
  const purchaseItem = (itemId: string): boolean => {
    let success = false;

    setGameData(prevData => {
      const item = prevData.shopItems.find(i => i.id === itemId);
      if (!item) return prevData;

      // Check if player has enough coins and meets level requirement
      if (prevData.character.coins < item.cost || 
          prevData.character.level < item.levelRequired) {
        return prevData;
      }

      // Purchase successful
      success = true;
      
      return {
        ...prevData,
        character: {
          ...prevData.character,
          coins: prevData.character.coins - item.cost
        },
        inventory: [...prevData.inventory, { ...item, id: generateId() }],
      };
    });

    return success;
  };

  const contextValue: GameData = {
    ...gameData,
    setCharacter,
    updateCharacterStat,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuestStep,
    addToInventory,
    removeFromInventory,
    equipItem,
    unequipItem,
    addSkillNode,
    updateSkillNode,
    deleteSkillNode,
    unlockSkillNode,
    purchaseItem,
    completeQuest
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const useGameData = () => useContext(DataContext);
