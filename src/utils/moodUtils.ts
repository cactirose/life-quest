
import { MoodEntry, MoodType } from "../types/mood";
import { format, parseISO } from "date-fns";

// Get color for mood type
export const getMoodColor = (mood: MoodType): string => {
  switch (mood) {
    case 'excellent':
      return '#4ade80'; // green-400
    case 'good':
      return '#a3e635'; // lime-400
    case 'neutral':
      return '#facc15'; // yellow-400
    case 'bad':
      return '#fb923c'; // orange-400
    case 'terrible':
      return '#f87171'; // red-400
    default:
      return '#94a3b8'; // gray-400
  }
};

// Format date for display
export const formatMoodDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

// Get emojis for mood types
export const getMoodEmoji = (mood: MoodType): string => {
  switch (mood) {
    case 'excellent':
      return '😁';
    case 'good':
      return '🙂';
    case 'neutral':
      return '😐';
    case 'bad':
      return '🙁';
    case 'terrible':
      return '😢';
    default:
      return '❓';
  }
};

// Group entries by date for calendar view
export const groupMoodEntriesByDate = (entries: MoodEntry[]): Record<string, MoodEntry> => {
  const grouped: Record<string, MoodEntry> = {};
  
  entries.forEach(entry => {
    // Use only the date part as the key
    const dateKey = entry.date.split('T')[0];
    grouped[dateKey] = entry;
  });
  
  return grouped;
};
