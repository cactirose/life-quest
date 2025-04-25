
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  isPrivate?: boolean;
  isFavorite?: boolean;
  tags?: string[];
  userId?: string;
}
