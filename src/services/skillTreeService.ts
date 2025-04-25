
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SkillNode } from "@/types/skills";

// Skill Tree methods
export const fetchSkillTree = async (): Promise<SkillNode[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("skill_nodes")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching skill tree:", error);
      return [];
    }

    return data.map(node => ({
      id: node.id,
      name: node.name,
      description: node.description || "",
      icon: node.icon || "",
      unlocked: node.unlocked,
      statBonuses: node.stat_bonuses as any,
      position: node.position as unknown as { x: number, y: number },
      connectedTo: Array.isArray(node.connected_to) ? node.connected_to as string[] : []
    }) as SkillNode);
  } catch (error) {
    console.error("Error in fetchSkillTree:", error);
    return [];
  }
};

export const upsertSkillNode = async (node: SkillNode): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("skill_nodes")
      .upsert({
        id: node.id,
        user_id: user.data.user.id,
        name: node.name,
        description: node.description,
        icon: node.icon,
        unlocked: node.unlocked,
        stat_bonuses: node.statBonuses as any,
        position: node.position as any,
        connected_to: node.connectedTo as any
      });

    if (error) {
      console.error("Error upserting skill node:", error);
      toast.error("Failed to save skill node");
    }
  } catch (error) {
    console.error("Error in upsertSkillNode:", error);
    toast.error("Failed to save skill node");
  }
};

export const deleteSkillNode = async (nodeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("skill_nodes")
      .delete()
      .eq("id", nodeId);

    if (error) {
      console.error("Error deleting skill node:", error);
      toast.error("Failed to delete skill node");
    }
  } catch (error) {
    console.error("Error in deleteSkillNode:", error);
    toast.error("Failed to delete skill node");
  }
};
