import { useMemo } from "react";
import { Quest } from "@/types/quests";

export const useQuestFiltering = (
  quests: Quest[], 
  searchQuery: string
) => {
  const baseActiveQuests = quests.filter(quest => quest.status === "active");
  const baseCompletedQuests = quests.filter(quest => quest.status === "completed");
  
  const filteredActiveQuests = useMemo(() => {
    if (!searchQuery.trim()) return baseActiveQuests;
    
    const query = searchQuery.toLowerCase();
    return baseActiveQuests.filter(quest => {
      // Search in title
      if (quest.title.toLowerCase().includes(query)) return true;
      
      // Search in description
      if (quest.description.toLowerCase().includes(query)) return true;
      
      // Search in tags
      if (quest.tags?.some(tag => {
        // If query is a tag (starts with #), match exactly
        if (query.startsWith('#')) {
          return tag.toLowerCase() === query.substring(1);
        }
        // Otherwise search within tag
        return tag.toLowerCase().includes(query);
      })) return true;
      
      return false;
    });
  }, [baseActiveQuests, searchQuery]);
  
  const filteredCompletedQuests = useMemo(() => {
    if (!searchQuery.trim()) return baseCompletedQuests;
    
    const query = searchQuery.toLowerCase();
    return baseCompletedQuests.filter(quest => {
      // Search in title
      if (quest.title.toLowerCase().includes(query)) return true;
      
      // Search in description
      if (quest.description.toLowerCase().includes(query)) return true;
      
      // Search in tags
      if (quest.tags?.some(tag => {
        // If query is a tag (starts with #), match exactly
        if (query.startsWith('#')) {
          return tag.toLowerCase() === query.substring(1);
        }
        // Otherwise search within tag
        return tag.toLowerCase().includes(query);
      })) return true;
      
      return false;
    });
  }, [baseCompletedQuests, searchQuery]);

  return {
    filteredActiveQuests,
    filteredCompletedQuests
  };
};
