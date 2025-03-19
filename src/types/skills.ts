
import { StatName } from "./character";

// Skill tree types
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  statBonuses: Partial<Record<StatName, number>>;
  position: { x: number, y: number };
  connectedTo: string[];
}

// Sample skill tree for first run
export const SAMPLE_SKILL_TREE: Omit<SkillNode, "id">[] = [
  {
    name: "Adventurer Basics",
    description: "The foundation of your journey",
    icon: "🌟",
    unlocked: true,
    statBonuses: { strength: 1, constitution: 1 },
    position: { x: 400, y: 300 },
    connectedTo: []
  }
];
