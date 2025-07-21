
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  position: { x: number; y: number };
  connectedTo: string[];
  statBonuses: Record<string, number>;
}

// Fetch skill tree nodes for the current user
export const fetchSkillTree = async (): Promise<SkillNode[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("skill_nodes")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching skill tree:", error);
      return [];
    }

    return data.map(node => ({
      id: node.id,
      name: node.name,
      description: node.description || "",
      icon: node.icon || "🌟",
      unlocked: node.unlocked,
      position: node.position as { x: number; y: number },
      connectedTo: (node.connected_to as string[]) || [],
      statBonuses: (node.stat_bonuses as Record<string, number>) || {}
    }));
  } catch (error) {
    console.error("Error in fetchSkillTree:", error);
    return [];
  }
};

// Add a new skill node
export const addSkillNode = async (node: Omit<SkillNode, "id">): Promise<string | null> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return null;
    
    const { data, error } = await supabase
      .from("skill_nodes")
      .insert({
        user_id: user.data.user.id,
        name: node.name,
        description: node.description,
        icon: node.icon,
        unlocked: node.unlocked,
        position: node.position,
        connected_to: node.connectedTo,
        stat_bonuses: node.statBonuses
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding skill node:", error);
      toast.error("Failed to add skill node");
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error in addSkillNode:", error);
    toast.error("Failed to add skill node");
    return null;
  }
};

// Update a skill node
export const updateSkillNode = async (node: SkillNode): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    const { error } = await supabase
      .from("skill_nodes")
      .update({
        name: node.name,
        description: node.description,
        icon: node.icon,
        unlocked: node.unlocked,
        position: node.position,
        connected_to: node.connectedTo,
        stat_bonuses: node.statBonuses
      })
      .eq("id", node.id)
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error updating skill node:", error);
      toast.error("Failed to update skill node");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateSkillNode:", error);
    toast.error("Failed to update skill node");
    return false;
  }
};
