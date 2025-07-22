
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
import { GameData } from "@/types/gameData";

export const loadCharacterData = async () => {
  const { data, error } = await supabase
    .from('characters')
    .select('id, name, level, xp, stats, login_streak')  // Only select needed fields
    .single();
    
  if (error) throw error;
  return data;
};

export const loadQuestsData = async () => {
  const { data, error } = await supabase
    .from('quests')
    .select('id, title, description, status, due_date, xp_reward, coin_reward')  // Only select needed fields
    .order('due_date', { ascending: true })
    .limit(10);  // Limit initial load to recent quests
    
  if (error) throw error;
  return data;
};

// Skills sync is removed since the table doesn't exist in Supabase
// Skills are now managed through user_skills table or locally
