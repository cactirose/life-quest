
export type GearType = "weapon" | "armor" | "accessory" | "consumable" | "special" | "shield" | "real-life";
export type GearRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface GearItem {
  id: string;
  name: string;
  description: string;
  type: GearType;
  rarity: GearRarity;
  icon: string;
  cost: number;
  statBonuses: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  equipped: boolean;
  levelRequired: number;
}

// Default items for testing
export const SAMPLE_SHOP_ITEMS: GearItem[] = [
  {
    id: "weapon-1",
    name: "Wooden Sword",
    description: "A simple wooden sword for beginners.",
    type: "weapon",
    rarity: "common",
    icon: "🗡️",
    cost: 10,
    statBonuses: { strength: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: "armor-1",
    name: "Leather Armor",
    description: "Basic protection made of leather.",
    type: "armor",
    rarity: "common",
    icon: "🥋",
    cost: 15,
    statBonuses: { constitution: 1 },
    equipped: false,
    levelRequired: 1
  },
  {
    id: "accessory-1",
    name: "Lucky Charm",
    description: "A small charm that brings luck to its owner.",
    type: "accessory",
    rarity: "rare",
    icon: "🍀",
    cost: 30,
    statBonuses: { charisma: 2 },
    equipped: false,
    levelRequired: 3
  },
  {
    id: "consumable-1",
    name: "Health Potion",
    description: "Restores health when used.",
    type: "consumable",
    rarity: "common",
    icon: "🧪",
    cost: 5,
    statBonuses: {},
    equipped: false,
    levelRequired: 1
  },
  {
    id: "special-1",
    name: "Book of Knowledge",
    description: "Contains ancient wisdom and knowledge.",
    type: "special",
    rarity: "epic",
    icon: "📚",
    cost: 50,
    statBonuses: { intelligence: 3, wisdom: 2 },
    equipped: false,
    levelRequired: 5
  }
];
