// Re-export all sync functions from their respective modules
export { syncCharacterData } from './syncCharacter';
export { syncQuestsData } from './syncQuests';
export { syncInventoryData } from './syncInventory';
export { syncSkillTreeData } from './syncSkillTree';
export { syncHabitsData } from './syncHabits';
export { syncMoodsData } from './syncMoods';
export { syncAchievementsData } from './syncAchievements';
export { syncJournalEntriesData } from './syncJournalEntries';
export { syncShoppingListsData } from './syncShoppingLists';

export { retrySyncOperation } from './syncUtils';

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
