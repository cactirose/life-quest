
export type StatName = "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  portrait: string;
  bio: string;
  stats: Stats;
  lastLoginDate?: string | null;
  loginStreak: number;
  dailyBonusClaimed: boolean;
}

// Default stats
export const DEFAULT_STATS: Stats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

// Default character
export const DEFAULT_CHARACTER: Character = {
  id: "",
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
