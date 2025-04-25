
import { Character } from './character';
import { Quest } from './quests';
import { GearItem } from './inventory';
import { SkillNode } from './skills';
import { Habit } from './habits';
import { MoodEntry } from './mood';
import { Achievement } from './achievements';

export interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  skillTree: SkillNode[];
  habits: Habit[];
  moods: MoodEntry[];
  achievements: Achievement[];
  lastUpdate?: string;
  version?: string;
}

export interface DataContextType {
  gameData: GameData;
  setGameData: (newData: Partial<GameData>, changedFields?: Set<string>) => void;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  refreshData: () => Promise<void>;
  saveState: {
    isSaving: boolean;
    lastSaveTime: Date | null;
    pendingChanges: Set<string>;
  };
  manualSave: () => Promise<void>;
}

export type GameDataUpdater = (newData: Partial<GameData>, changedFields: Set<string>) => void;
