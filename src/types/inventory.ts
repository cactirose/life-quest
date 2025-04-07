
import { StatName } from "./character";

// Gear types
export type GearType = "weapon" | "armor" | "accessory" | "real-life";
export enum GearRarity {
  COMMON = "common",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary"
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  type: GearType;
  rarity: GearRarity;
  icon: string; // path to icon image
  cost: number;
  statBonuses: Partial<Record<StatName, number>>;
  equipped: boolean;
  levelRequired: number;
  realLifeReward?: boolean;
}

// For compatibility with existing code
export type Item = GearItem;
export enum ItemType {
  WEAPON = "weapon",
  ARMOR = "armor",
  ACCESSORY = "accessory",
  CONSUMABLE = "consumable",
  REAL_LIFE = "real-life"
}

// Sample shop items for first run
export const SAMPLE_SHOP_ITEMS: GearItem[] = [
  {
    id: "",
    name: "Wooden Sword",
    description: "A basic training sword",
    type: "weapon",
    rarity: GearRarity.COMMON,
    icon: "⚔️",
    cost: 20,
    statBonuses: { strength: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: "",
    name: "Leather Armor",
    description: "Simple protective gear",
    type: "armor",
    rarity: GearRarity.COMMON,
    icon: "🛡️",
    cost: 30,
    statBonuses: { constitution: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: "",
    name: "Scholar's Tome",
    description: "A book of ancient knowledge",
    type: "accessory",
    rarity: GearRarity.RARE,
    icon: "📖",
    cost: 50,
    statBonuses: { intelligence: 2, wisdom: 1 },
    equipped: false,
    levelRequired: 2
  },
  {
    id: "",
    name: "Charming Amulet",
    description: "Makes you more likable",
    type: "accessory",
    rarity: GearRarity.RARE,
    icon: "📿",
    cost: 50,
    statBonuses: { charisma: 3 },
    equipped: false,
    levelRequired: 2
  },
  {
    id: "",
    name: "Swift Boots",
    description: "Increases your agility",
    type: "armor",
    rarity: GearRarity.RARE,
    icon: "👢",
    cost: 65,
    statBonuses: { dexterity: 3 },
    equipped: false,
    levelRequired: 3
  },
  {
    id: "",
    name: "Dragon Slayer",
    description: "A legendary blade",
    type: "weapon",
    rarity: GearRarity.LEGENDARY,
    icon: "🗡️",
    cost: 200,
    statBonuses: { strength: 5, dexterity: 2 },
    equipped: false,
    levelRequired: 5
  },
  {
    id: "",
    name: "Movie Night",
    description: "Treat yourself to a movie",
    type: "real-life",
    rarity: GearRarity.COMMON,
    icon: "🎬",
    cost: 50,
    statBonuses: {},
    equipped: false,
    levelRequired: 1,
    realLifeReward: true
  },
  {
    id: "",
    name: "Coffee Break",
    description: "Enjoy a nice cup of coffee",
    type: "real-life",
    rarity: GearRarity.COMMON,
    icon: "☕",
    cost: 25,
    statBonuses: {},
    equipped: false,
    levelRequired: 1,
    realLifeReward: true
  }
];
