
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

// Initial Stats
export const DEFAULT_STATS: Stats = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
};

// Initial Character
export const DEFAULT_CHARACTER: Character = {
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
