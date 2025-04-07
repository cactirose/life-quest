
import { supabase } from "@/integrations/supabase/client";
import { SkillNode } from "@/types/skills";

export const fetchSkillTree = async (): Promise<SkillNode[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("skill_nodes")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error fetching skill tree:", error);
      return [];
    }

    return data.map(node => ({
      id: node.id,
      name: node.name,
      description: node.description,
      level: node.level || 0,
      maxLevel: node.max_level || 5,
      unlocked: node.unlocked || false,
      icon: node.icon,
      parentIds: node.parent_ids || [],
      position: node.position || { x: 0, y: 0 },
      statBoosts: node.stat_boosts || {},
      category: node.category,
      cost: node.cost || 0,
    }));
  } catch (error) {
    console.error("Error in fetchSkillTree:", error);
    return [];
  }
};

export const upsertSkillNode = async (node: SkillNode): Promise<SkillNode | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    // Check if node exists
    const { data } = await supabase
      .from("skill_nodes")
      .select("id")
      .eq("id", node.id)
      .single();

    const nodeData = {
      name: node.name,
      description: node.description,
      level: node.level,
      max_level: node.maxLevel,
      unlocked: node.unlocked,
      icon: node.icon,
      parent_ids: node.parentIds,
      position: node.position,
      stat_boosts: node.statBoosts,
      category: node.category,
      cost: node.cost,
    };

    if (data) {
      // Update existing node
      const { error } = await supabase
        .from("skill_nodes")
        .update(nodeData)
        .eq("id", node.id);

      if (error) {
        console.error("Error updating skill node:", error);
        return null;
      }
    } else {
      // Insert new node
      const { error } = await supabase
        .from("skill_nodes")
        .insert([{
          id: node.id,
          user_id: user.user.id,
          ...nodeData
        }]);

      if (error) {
        console.error("Error creating skill node:", error);
        return null;
      }
    }

    return node;
  } catch (error) {
    console.error("Error in upsertSkillNode:", error);
    return null;
  }
};
