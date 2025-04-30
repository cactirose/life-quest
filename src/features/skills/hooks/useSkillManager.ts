import { Skill } from "@/types/skills";
import { GameDataUpdater } from "@/utils/contextTypes";
import { addSkill as addSkillService, updateSkill as updateSkillService, deleteSkill as deleteSkillService, addXPToSkill } from "@/services/skillService";
import { toast } from "sonner";

export const useSkillManager = (
  skills: Skill[],
  setGameData: GameDataUpdater
) => {
  const addSkill = async (skillData: Omit<Skill, "id" | "createdAt">) => {
    try {
      // First add to Supabase to get the real ID
      const skillId = await addSkillService(skillData);
      
      if (!skillId) {
        throw new Error("Failed to add skill to database");
      }

      // Then update local state with the real ID from Supabase
      const newSkill: Skill = {
        ...skillData,
        id: skillId,
        createdAt: new Date()
      };

      setGameData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, newSkill]
      }));

      return skillId;
    } catch (error) {
      console.error("Error in addSkill:", error);
      toast.error("Failed to add skill");
      return null;
    }
  };

  const updateSkill = async (skill: Skill) => {
    try {
      // First update in Supabase
      const success = await updateSkillService(skill);
      
      if (!success) {
        throw new Error("Failed to update skill in database");
      }

      // Then update local state
      setGameData(prevData => ({
        ...prevData,
        skills: prevData.skills.map(s => 
          s.id === skill.id ? skill : s
        )
      }));
    } catch (error) {
      console.error("Error in updateSkill:", error);
      toast.error("Failed to update skill");
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      // First delete from Supabase
      const success = await deleteSkillService(skillId);
      
      if (!success) {
        throw new Error("Failed to delete skill from database");
      }

      // Then update local state
      setGameData(prevData => ({
        ...prevData,
        skills: prevData.skills.filter(s => s.id !== skillId)
      }));
    } catch (error) {
      console.error("Error in deleteSkill:", error);
      toast.error("Failed to delete skill");
    }
  };

  const addXpToSkill = async (skillId: string, xp: number) => {
    try {
      // First update in Supabase
      const success = await addXPToSkill(skillId, xp);
      
      if (!success) {
        throw new Error("Failed to add XP to skill in database");
      }

      // Then update local state
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
    } catch (error) {
      console.error("Error in addXpToSkill:", error);
      toast.error("Failed to add XP to skill");
    }
  };

  return {
    addSkill,
    updateSkill,
    deleteSkill,
    addXpToSkill
  };
}; 