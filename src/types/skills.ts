
import { StatName } from "./character";

// Skill types
export interface Skill {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  xp: number;
  createdAt: Date;
}

// Skill Node type for skill tree (legacy support)
export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  statBonuses: Record<StatName, number>;
  position: { x: number; y: number };
  connectedTo: string[];
}

// Helper function to calculate level and progress
export function getSkillLevelAndProgress(xp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
} {
  const level = Math.floor(0.1 * Math.sqrt(xp));
  const nextLevelXp = Math.pow((level + 1) / 0.1, 2);
  return {
    level,
    currentXp: xp,
    nextLevelXp
  };
}

// Sample skills for first run
export const SAMPLE_SKILLS: Omit<Skill, "id" | "createdAt">[] = [
  {
    name: "Focus",
    icon: "🧠",
    color: "#4CAF50",
    description: "Your ability to concentrate and maintain attention",
    xp: 0
  },
  {
    name: "Discipline",
    icon: "⚔️",
    color: "#2196F3",
    description: "Your ability to maintain consistent habits and routines",
    xp: 0
  },
  {
    name: "Creativity",
    icon: "🎨",
    color: "#9C27B0",
    description: "Your ability to think outside the box and generate new ideas",
    xp: 0
  }
];
