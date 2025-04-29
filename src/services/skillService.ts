import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skill } from "@/types/skills";

// Fetch all skills for the current user
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }

    return data.map(skill => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      color: skill.color,
      description: skill.description || "",
      xp: skill.xp,
      createdAt: new Date(skill.created_at)
    }));
  } catch (error) {
    console.error("Error in fetchSkills:", error);
    return [];
  }
};

// Add a new skill
export const addSkill = async (skill: Omit<Skill, "id" | "createdAt">): Promise<string | null> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null;
    
    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: user.data.user.id,
        name: skill.name,
        icon: skill.icon,
        color: skill.color,
        description: skill.description,
        xp: skill.xp
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error in addSkill:", error);
    toast.error("Failed to add skill");
    return null;
  }
};

// Update an existing skill
export const updateSkill = async (skill: Skill): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    const { error } = await supabase
      .from("skills")
      .update({
        name: skill.name,
        icon: skill.icon,
        color: skill.color,
        description: skill.description,
        xp: skill.xp
      })
      .eq("id", skill.id)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateSkill:", error);
    toast.error("Failed to update skill");
    return false;
  }
};

// Delete a skill
export const deleteSkill = async (skillId: string): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", skillId)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteSkill:", error);
    toast.error("Failed to delete skill");
    return false;
  }
};

// Add XP to a skill
export const addXPToSkill = async (skillId: string, xp: number): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    // First get the current skill
    const { data: skill, error: fetchError } = await supabase
      .from("skills")
      .select("xp")
      .eq("id", skillId)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError || !skill) {
      console.error("Error fetching skill:", fetchError);
      return false;
    }

    // Then update with new XP
    const { error: updateError } = await supabase
      .from("skills")
      .update({ xp: skill.xp + xp })
      .eq("id", skillId)
      .eq("user_id", user.data.user.id);

    if (updateError) {
      console.error("Error updating skill XP:", updateError);
      toast.error("Failed to add XP");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addXPToSkill:", error);
    toast.error("Failed to add XP");
    return false;
  }
}; 