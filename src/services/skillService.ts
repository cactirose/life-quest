
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skill } from "@/types/skills";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(operation: () => Promise<T>, operationName: string): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed for ${operationName}:`, error);
      
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
        continue;
      }
    }
  }
  
  throw lastError;
};

// Fetch all skills for the current user
export const fetchSkills = async (): Promise<Skill[]> => {
  return withRetry(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }

    return data.map(skill => ({
      id: skill.id,
      name: skill.name,
      icon: skill.icon || "🌟",
      color: "#4CAF50", // Default color since it's not in the database
      description: skill.description || "",
      xp: skill.xp || 0,
      createdAt: new Date(skill.created_at)
    }));
  }, "fetchSkills");
};

// Add a new skill
export const addSkill = async (skill: Omit<Skill, "id" | "createdAt">): Promise<string | null> => {
  return withRetry(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null;
    
    const { data, error } = await supabase
      .from("skills")
      .insert({
        user_id: user.data.user.id,
        name: skill.name,
        icon: skill.icon,
        description: skill.description,
        xp: skill.xp
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding skill:", error);
      throw error;
    }

    return data.id;
  }, "addSkill");
};

// Update an existing skill
export const updateSkill = async (skill: Skill): Promise<boolean> => {
  return withRetry(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    const { error } = await supabase
      .from("skills")
      .update({
        name: skill.name,
        icon: skill.icon,
        description: skill.description,
        xp: skill.xp
      })
      .eq("id", skill.id)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error updating skill:", error);
      throw error;
    }

    return true;
  }, "updateSkill");
};

// Delete a skill
export const deleteSkill = async (skillId: string): Promise<boolean> => {
  return withRetry(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", skillId)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error deleting skill:", error);
      throw error;
    }

    return true;
  }, "deleteSkill");
};

// Add XP to a skill
export const addXPToSkill = async (skillId: string, xp: number): Promise<boolean> => {
  return withRetry(async () => {
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
      throw fetchError || new Error("Skill not found");
    }

    // Then update with new XP
    const { error: updateError } = await supabase
      .from("skills")
      .update({ xp: (skill.xp || 0) + xp })
      .eq("id", skillId)
      .eq("user_id", user.data.user.id);

    if (updateError) {
      console.error("Error updating skill XP:", updateError);
      throw updateError;
    }

    return true;
  }, "addXPToSkill");
}; 
