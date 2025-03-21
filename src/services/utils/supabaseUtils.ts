
import { Json } from "@/integrations/supabase/types";
import { QuestStep } from "@/types/quests";
import { HabitCompletion as HabitCompletionType } from "@/types/habits";

// Helper functions to convert between Supabase and app types
export const jsonToString = (value: any): string => {
  return typeof value === 'string' ? value : JSON.stringify(value);
};

// Type conversion helpers
export const toQuestSteps = (steps: Json | null): QuestStep[] => {
  if (!steps) return [];
  
  const stepsArray = Array.isArray(steps) ? steps : [];
  return stepsArray.map(step => {
    if (typeof step !== 'object' || step === null) {
      return { id: '', description: '', completed: false };
    }
    
    // Safe access with type checking
    const stepObj = step as Record<string, any>;
    return {
      id: typeof stepObj.id === 'string' ? stepObj.id : '',
      description: typeof stepObj.description === 'string' ? stepObj.description : '',
      completed: typeof stepObj.completed === 'boolean' ? stepObj.completed : false
    };
  });
};

export const toHabitCompletions = (completions: Json | null): HabitCompletionType[] => {
  if (!completions) return [];
  
  const completionsArray = Array.isArray(completions) ? completions : [];
  return completionsArray.map(completion => {
    if (typeof completion !== 'object' || completion === null) {
      return { date: '', completed: false };
    }
    
    // Safe access with type checking
    const completionObj = completion as Record<string, any>;
    return {
      date: typeof completionObj.date === 'string' ? completionObj.date : '',
      completed: typeof completionObj.completed === 'boolean' ? completionObj.completed : false
    };
  });
};
