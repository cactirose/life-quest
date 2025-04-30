import { Skill } from "@/types/skills";
import { GameDataUpdater } from "@/utils/contextTypes";
import { generateId } from "@/utils/idGenerator";
import { addSkill as addSkillService, updateSkill as updateSkillService, deleteSkill as deleteSkillService, addXPToSkill } from "@/services/skillService";
import { toast } from "sonner";

export const useSkillManager = (
  skills: Skill[],
  setGameData: GameDataUpdater
) => {
  const addSkill = (skillData: Omit<Skill, "id" | "createdAt">) => {
    const newSkill = {
      ...skillData,
      id: generateId(),
      createdAt: new Date()
    };

    setGameData(prevData => ({
      ...prevData,
      skills: [...prevData.skills, newSkill]
    }));

    addSkillService(newSkill as Skill);
  };

  const updateSkill = (skill: Skill) => {
    setGameData(prevData => ({
      ...prevData,
      skills: prevData.skills.map(s => 
        s.id === skill.id ? skill : s
      )
    }));

    updateSkillService(skill);
  };

  const deleteSkill = (skillId: string) => {
    setGameData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(s => s.id !== skillId)
    }));

    deleteSkillService(skillId);
  };

  const addXpToSkill = async (skillId: string, xp: number) => {
    setGameData(prevData => {
      const skill = prevData.skills.find(s => s.id === skillId);
      if (!skill) return prevData;

      const updatedSkill = {
        ...skill,
        xp: skill.xp + xp
      };

      return {
        ...prevData,
        skills: prevData.skills.map(s => 
          s.id === skillId ? updatedSkill : s
        )
      };
    });

    await addXPToSkill(skillId, xp);
  };

  return {
    addSkill,
    updateSkill,
    deleteSkill,
    addXpToSkill
  };
}; 