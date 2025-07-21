
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
  lastLoginDate?: Date;
  loginStreak: number;
  dailyBonusClaimed: boolean;
}
