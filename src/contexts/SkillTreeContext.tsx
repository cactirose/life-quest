
import { createContext, useContext } from "react";
import { SkillNode } from "../types/skills";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { SkillTreeContextType, GameDataUpdater } from "../utils/contextTypes";

export const SkillTreeContext = createContext<SkillTreeContextType>({} as SkillTreeContextType);

export const useSkillTree = () => useContext(SkillTreeContext);

export const createSkillTreeContextValue = (
  skillTree: SkillNode[],
  setGameData: GameDataUpdater
): SkillTreeContextType => {
  // SKILL TREE METHODS
  const addSkillNode = (node: Omit<SkillNode, "id">) => {
    const newNode = {
      ...node,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      skillTree: [...prevData.skillTree, newNode]
    }));

    return newNode.id;
  };

  const updateSkillNode = (node: SkillNode) => {
    setGameData(prevData => ({
      ...prevData,
      skillTree: prevData.skillTree.map(n => 
        n.id === node.id ? node : n
      )
    }));
  };

  const deleteSkillNode = (nodeId: string) => {
    setGameData(prevData => {
      // Remove the node
      const updatedSkillTree = prevData.skillTree.filter(n => n.id !== nodeId);
      
      // Remove any connections to this node
      return {
        ...prevData,
        skillTree: updatedSkillTree.map(node => ({
          ...node,
          connectedTo: node.connectedTo.filter(id => id !== nodeId)
        }))
      };
    });
  };

  const unlockSkillNode = (nodeId: string) => {
    setGameData(prevData => {
      const node = prevData.skillTree.find(n => n.id === nodeId);
      if (!node || node.unlocked) return prevData;

      // Apply stat bonuses
      const updatedCharacter = {
        ...prevData.character,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(node.statBonuses).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Record<StatName, number>)
        }
      };

      // Mark as unlocked
      const updatedSkillTree = prevData.skillTree.map(n => 
        n.id === nodeId ? { ...n, unlocked: true } : n
      );

      return { 
        ...prevData, 
        character: updatedCharacter,
        skillTree: updatedSkillTree
      };
    });
  };

  return {
    skillTree,
    addSkillNode,
    updateSkillNode,
    deleteSkillNode,
    unlockSkillNode
  };
};
