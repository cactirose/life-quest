
export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export type StatName = keyof Stats;

export interface Character {
  id?: string;
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

export const DEFAULT_CHARACTER: Character = {
  id: undefined,
  name: "Adventurer",
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  coins: 50,
  portrait: "/placeholder.svg",
  bio: "A brave adventurer ready to conquer life's challenges.",
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  },
  lastLoginDate: null,
  loginStreak: 0,
  dailyBonusClaimed: false
};
