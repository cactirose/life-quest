
import { useState, useEffect } from "react";
import { Quest } from "@/types/quests";

export const useQuestFiltering = (quests: Quest[], searchQuery: string) => {
  const [filteredActiveQuests, setFilteredActiveQuests] = useState<Quest[]>([]);
  const [filteredCompletedQuests, setFilteredCompletedQuests] = useState<Quest[]>([]);
  
  useEffect(() => {
    const activeQuests = quests.filter(quest => quest.status === "active");
    const completedQuests = quests.filter(quest => quest.status === "completed");
    
    if (!searchQuery.trim()) {
      setFilteredActiveQuests(activeQuests);
      setFilteredCompletedQuests(completedQuests);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const isTagSearch = query.startsWith("#");
    
    const filterByQuery = (questList: Quest[]) => {
      return questList.filter(quest => {
        // Tag search
        if (isTagSearch) {
          const tagQuery = query.slice(1); // Remove the # prefix
          return quest.tags?.some(tag => 
            tag.toLowerCase().includes(tagQuery)
          );
        }
        
        // Regular text search
        return (
          quest.title.toLowerCase().includes(query) ||
          (quest.description && quest.description.toLowerCase().includes(query)) ||
          quest.steps.some(step => 
            step.description.toLowerCase().includes(query)
          ) ||
          quest.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      });
    };
    
    setFilteredActiveQuests(filterByQuery(activeQuests));
    setFilteredCompletedQuests(filterByQuery(completedQuests));
  }, [quests, searchQuery]);
  
  return { filteredActiveQuests, filteredCompletedQuests };
};
