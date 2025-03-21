
import { StatName } from "@/types/character";
import { GearRarity, GearType } from "@/contexts/DataContext";

export const DEFAULT_STATS: Record<StatName, number> = {
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0
};

export const ITEM_ICONS = ["🗡️", "🛡️", "🧙", "🏹", "🪄", "💍", "👑", "🧪", "📚", "🔮", "🧠", "💪", "🎭", "⚔️", "🍕", "🍦", "🎮", "📱", "🎵", "🎬", "💤", "🌴", "🏖️", "🎁", "🎨"];

export interface ShopItemFormData {
  name: string;
  description: string;
  type: GearType;
  rarity: GearRarity;
  icon: string;
  cost: number;
  levelRequired: number;
  statBonuses: Record<StatName, number>;
}
