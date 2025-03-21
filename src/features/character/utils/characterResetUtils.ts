
import { Character, DEFAULT_CHARACTER } from "@/types/character";
import { Quest } from "@/types/quests";
import { GearItem } from "@/types/inventory";
import { SkillNode } from "@/types/skills";

/**
 * Prepares character data for reset
 */
export const prepareCharacterReset = (
  character: Character,
  quests: Quest[],
  skillTree: SkillNode[]
): {
  character: Character;
  quests: Quest[];
  skillTree: SkillNode[];
  inventory: GearItem[];
} => {
  const resetCharacter = {
    ...DEFAULT_CHARACTER,
    name: character.name
  };
  
  const resetQuests = quests.map(quest => ({
    ...quest,
    status: "active" as const,
    steps: quest.steps.map(step => ({
      ...step,
      completed: false
    }))
  }));
  
  const resetSkillTree = skillTree.map(node => 
    node.name === "Adventurer Basics" 
      ? { ...node, unlocked: true } 
      : { ...node, unlocked: false }
  );
  
  return {
    character: resetCharacter,
    quests: resetQuests,
    skillTree: resetSkillTree,
    inventory: []
  };
};
