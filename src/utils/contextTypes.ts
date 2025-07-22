import { Character } from "../types/character";
import { Quest } from "../types/quests";
import { Habit } from "../types/habits";
import { Skill } from "../types/skills";
import { Achievement } from "../types/achievements";
import { GearItem } from "../types/inventory";
import { MoodEntry } from "../types/mood";

export type GameDataUpdater = React.Dispatch<React.SetStateAction<any>>;

export interface CharacterContextType {
  character: Character | null;
  setCharacter?: (character: Character) => void;
}

export interface MoodContextType {
  moods: MoodEntry[];
  setMoods: (moods: MoodEntry[]) => void;
  addMood: (mood: MoodEntry) => void;
  addMoodEntry: (mood: MoodEntry) => void;
  updateMood: (mood: MoodEntry) => void;
  updateMoodEntry: (mood: MoodEntry) => void;
  deleteMood: (id: string) => void;
  deleteMoodEntry: (id: string) => void;
}
