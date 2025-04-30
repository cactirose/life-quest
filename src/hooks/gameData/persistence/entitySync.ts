// Re-export all sync functions from their respective modules
export { syncCharacterData } from './syncCharacter';
export { syncQuestsData } from './syncQuests';
export { syncInventoryData } from './syncInventory';
export { syncHabitsData } from './syncHabits';
export { syncMoodsData } from './syncMoods';
export { syncAchievementsData } from './syncAchievements';
export { syncJournalEntriesData } from './syncJournalEntries';
export { syncShoppingListsData } from './syncShoppingLists';
export { validateEntity } from './syncUtils';
export { retrySyncOperation } from './syncUtils';

import { supabase } from "@/integrations/supabase/client";

export const loadCharacterData = async () => {
  const { data, error } = await supabase
    .from('characters')
    .select('id, username, level, experience, stats, login_streak')  // Only select needed fields
    .single();
    
  if (error) throw error;
  return data;
};

export const loadQuestsData = async () => {
  const { data, error } = await supabase
    .from('quests')
    .select('id, title, description, status, due_date, rewards')  // Only select needed fields
    .order('due_date', { ascending: true })
    .limit(10);  // Limit initial load to recent quests
    
  if (error) throw error;
  return data;
};

export const syncSkillsData = async (gameData: GameData, changedFields: Set<string>) => {
  if (!changedFields.has('skills')) return;
  
  try {
    const { data: existingSkills, error: fetchError } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', gameData.userId);

    if (fetchError) throw fetchError;

    // Get skills that need to be updated or inserted
    const skillsToSync = gameData.skills
      .filter(skill => {
        const valid = skill.id && typeof skill.id === 'string' && skill.userId && typeof gameData.userId === 'string';
        if (!valid) {
          console.warn('Skipping skill with invalid id or user_id:', skill);
        }
        return valid;
      })
      .map(skill => ({
        id: skill.id,
        user_id: gameData.userId,
        name: skill.name,
        icon: skill.icon,
        color: skill.color,
        description: skill.description,
        xp: skill.xp,
        created_at: skill.createdAt.toISOString()
      }));

    // Delete skills that no longer exist
    const existingSkillIds = new Set(existingSkills?.map(s => s.id) || []);
    const currentSkillIds = new Set(skillsToSync.map(s => s.id));
    const skillsToDelete = Array.from(existingSkillIds).filter(id => !currentSkillIds.has(id));

    if (skillsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .in('id', skillsToDelete);

      if (deleteError) throw deleteError;
    }

    // Upsert all current skills
    const { error: upsertError } = await supabase
      .from('skills')
      .upsert(skillsToSync, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (upsertError) throw upsertError;

    return true;
  } catch (error) {
    console.error('Error syncing skills:', error);
    throw error;
  }
};
