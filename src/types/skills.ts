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

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  xp: number;
  created_at: string;
  updated_at: string;
}

export type SkillName = 
  | 'strength'
  | 'dexterity' 
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'
  | 'crafting'
  | 'cooking'
  | 'gardening'
  | 'fitness'
  | 'meditation'
  | 'learning';

export interface SkillDefinition {
  name: SkillName;
  description: string;
  primaryStat: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
  icon: string; // Material icon name
}

export const SKILL_DEFINITIONS: Record<SkillName, SkillDefinition> = {
  strength: {
    name: 'strength',
    description: 'Physical power and raw muscle strength',
    primaryStat: 'strength',
    icon: 'fitness_center'
  },
  dexterity: {
    name: 'dexterity',
    description: 'Agility, reflexes and hand-eye coordination',
    primaryStat: 'dexterity', 
    icon: 'sports_martial_arts'
  },
  constitution: {
    name: 'constitution',
    description: 'Health, stamina and resilience',
    primaryStat: 'constitution',
    icon: 'favorite'
  },
  intelligence: {
    name: 'intelligence',
    description: 'Mental acuity, information recall and analytical skills',
    primaryStat: 'intelligence',
    icon: 'psychology'
  },
  wisdom: {
    name: 'wisdom',
    description: 'Common sense, awareness and intuition',
    primaryStat: 'wisdom',
    icon: 'lightbulb'
  },
  charisma: {
    name: 'charisma',
    description: 'Force of personality and leadership',
    primaryStat: 'charisma',
    icon: 'groups'
  },
  crafting: {
    name: 'crafting',
    description: 'Creating and building things with your hands',
    primaryStat: 'dexterity',
    icon: 'construction'
  },
  cooking: {
    name: 'cooking',
    description: 'Preparing and cooking food',
    primaryStat: 'intelligence',
    icon: 'restaurant'
  },
  gardening: {
    name: 'gardening',
    description: 'Growing and caring for plants',
    primaryStat: 'wisdom',
    icon: 'yard'
  },
  fitness: {
    name: 'fitness',
    description: 'Physical exercise and athletic ability',
    primaryStat: 'constitution',
    icon: 'directions_run'
  },
  meditation: {
    name: 'meditation',
    description: 'Mental focus and mindfulness',
    primaryStat: 'wisdom',
    icon: 'self_improvement'
  },
  learning: {
    name: 'learning',
    description: 'Acquiring and retaining new knowledge',
    primaryStat: 'intelligence',
    icon: 'school'
  }
};
