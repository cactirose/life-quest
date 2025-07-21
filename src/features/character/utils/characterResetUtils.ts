
import { Character, DEFAULT_CHARACTER } from "@/types/character";
import { Quest } from "@/types/quests";
import { GearItem } from "@/types/inventory";
import { Skill } from "@/types/skills";

/**
 * Prepares character data for reset
 */
export const prepareCharacterReset = (
  character: Character,
  quests: Quest[],
  skills: Skill[]
): {
  character: Character;
  quests: Quest[];
  skills: Skill[];
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
  
  const resetSkills = skills.map(skill => ({
    ...skill,
    xp: 0
  }));
  
  return {
    character: resetCharacter,
    quests: resetQuests,
    skills: resetSkills,
    inventory: []
  };
};
