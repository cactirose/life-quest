import { Character } from "../types/character";
import { Quest } from "../types/quests";
import { Habit } from "../types/habits";
import { Skill } from "../types/skills";
import { Achievement } from "../types/achievements";
import { InventoryItem } from "../types/inventory";
import { MoodEntry } from "../types/mood";

export type GameDataUpdater = React.Dispatch<React.SetStateAction<any>>;
