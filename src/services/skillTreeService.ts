
import { supabase } from "@/integrations/supabase/client";
import { SkillNode } from "@/types/skills";
import { StatName } from "@/types/character";
import { Json } from "@/integrations/supabase/types";

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

    return data.map(node => {
      // Convert position from database to expected structure
      const nodePosition = node.position as Record<string, number> || { x: 0, y: 0 };
      const position = {
        x: nodePosition.x || 0,
        y: nodePosition.y || 0
      };
      
      // Convert connectedTo array from DB
      const connectedTo = Array.isArray(node.connected_to) ? node.connected_to as string[] : [];
      
      // Convert statBonuses from database
      const statBonuses = typeof node.stat_bonuses === 'object' && node.stat_bonuses !== null
        ? node.stat_bonuses as Partial<Record<StatName, number>>
        : {};
      
      return {
        id: node.id,
        name: node.name,
        description: node.description || "",
        unlocked: node.unlocked || false,
        icon: node.icon || "",
        statBonuses,
        position,
        connectedTo
      };
    });
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
      unlocked: node.unlocked,
      icon: node.icon,
      connected_to: node.connectedTo,
      position: node.position,
      stat_bonuses: node.statBonuses
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
