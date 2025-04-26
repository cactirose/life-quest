
import { MoodEntry, MoodType } from "../types/mood";
import { format, parseISO } from "date-fns";

// Define mood colors for different mood types
export const moodColors: Record<MoodType, string> = {
  great: '#4ade80', // green-400 (previously excellent)
  good: '#a3e635', // lime-400
  okay: '#facc15', // yellow-400 (previously neutral)
  bad: '#fb923c', // orange-400
  terrible: '#f87171', // red-400
};

// Get color for mood type
export const getMoodColor = (mood: MoodType): string => {
  return moodColors[mood] || '#94a3b8'; // gray-400 as fallback
};

// Format date for display
export const formatMoodDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

// Get emojis for mood types
export const getMoodEmoji = (mood: MoodType): string => {
  const emojiMap: Record<MoodType, string> = {
    great: '😁', // previously excellent
    good: '🙂',
    okay: '😐', // previously neutral
    bad: '🙁',
    terrible: '😢'
  };
  
  return emojiMap[mood] || '❓';
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
