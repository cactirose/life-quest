
import { Character } from './character';
import { Quest } from './quests';
import { GearItem } from './inventory';
import { Habit } from './habits';
import { Achievement } from './achievements';
import { MoodEntry } from './mood';
import { Challenge } from './challenges';
import { SkillNode } from './skills';
import { ShoppingList } from './shoppingList';
import { JournalEntry } from './journal';

export interface GameData {
  character: Character;
  quests: Quest[];
  inventory: GearItem[];
  shopItems: GearItem[];
  habits: Habit[];
  moods: MoodEntry[];
  achievements: Achievement[];
  skillTree: SkillNode[];
  shoppingLists: ShoppingList[];
  journalEntries: JournalEntry[];
  challenges: Challenge[];
}
