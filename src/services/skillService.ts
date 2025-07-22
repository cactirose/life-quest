
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skill } from "@/types/skills";

// Skills methods using the correct "skills" table
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    console.log('Starting to fetch skills');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user, returning empty skills array');
      return [];
    }
    
    console.log('Fetching skills for user:', user.id);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }

    console.log('Raw skills data from Supabase:', data);

    // Map database fields to Skill type
    const mappedSkills = data.map(skill => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon || "🌟",
      color: "#4CAF50", // Default color since it's not in DB
      description: skill.description || "",
      xp: skill.xp || 0,
      createdAt: new Date(skill.created_at || Date.now())
    })) as Skill[];

    console.log('Mapped skills data:', mappedSkills);
    return mappedSkills;
  } catch (error) {
    console.error("Error in fetchSkills:", error);
    return [];
  }
};

export const addSkill = async (skillData: Omit<Skill, "id" | "createdAt">): Promise<string | null> => {
  try {
    console.log('Starting skill add for skill:', skillData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found during skill add, skipping operation');
      return null;
    }
    console.log('User authenticated, proceeding with skill add');

    const newSkillData = {
      user_id: user.id,
      name: skillData.name,
      icon: skillData.icon,
      description: skillData.description,
      xp: skillData.xp || 0,
    };
    console.log('Prepared skill data for insert:', newSkillData);

    const { data, error } = await supabase
      .from("skills")
      .insert(newSkillData)
      .select()
      .single();

    if (error) {
      console.error("Error adding skill:", error);
      throw error;
    }

    console.log('Skill added successfully:', data);
    return data.id;
  } catch (error) {
    console.error("Error in addSkill:", error);
    throw error;
  }
};

export const updateSkill = async (skill: Skill): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("skills")
      .update({
        name: skill.name,
        icon: skill.icon,
        description: skill.description,
        xp: skill.xp,
      })
      .eq("id", skill.id);

    if (error) {
      console.error("Error updating skill:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateSkill:", error);
    return false;
  }
};

export const deleteSkill = async (skillId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", skillId);

    if (error) {
      console.error("Error deleting skill:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteSkill:", error);
    return false;
  }
};

export const addXPToSkill = async (skillId: string, xp: number): Promise<boolean> => {
  try {
    // First get the current skill data
    const { data: currentSkill, error: fetchError } = await supabase
      .from("skills")
      .select("xp")
      .eq("id", skillId)
      .single();

    if (fetchError) {
      console.error("Error fetching current skill:", fetchError);
      return false;
    }

    // Update the skill with new XP
    const { error } = await supabase
      .from("skills")
      .update({
        xp: (currentSkill.xp || 0) + xp,
      })
      .eq("id", skillId);

    if (error) {
      console.error("Error adding XP to skill:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addXPToSkill:", error);
    return false;
  }
};
