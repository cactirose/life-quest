
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Book, Search, Calendar, Filter } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadEntries = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/login');
        return;
      }
      
      fetchJournalEntries();
    };
    
    checkAuthAndLoadEntries();
  }, []);

  const fetchJournalEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database fields to our JournalEntry type
      const mappedEntries: JournalEntry[] = (data || []).map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        date: entry.created_at,
        mood: entry.mood || undefined,
        isPrivate: entry.is_private || false,
        isFavorite: entry.is_favorite || false,
        userId: entry.user_id,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }));

      setEntries(mappedEntries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 animate-fade-in">
        <div className="text-center">
          <Book className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold">Loading Journal Entries...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">Record your thoughts and experiences</p>
        </div>
        <Button onClick={() => navigate("/journal/new")} className="pixel-button">
          <Plus size={16} className="mr-2" />
          New Entry
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search journal entries..."
            className="pl-9 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button variant="outline" className="flex gap-2">
          <Calendar size={16} />
          <span>Date</span>
        </Button>
        <Button variant="outline" className="flex gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Book className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Journal Entries Yet</h3>
          <p className="text-muted-foreground mb-6">Write your first journal entry to get started</p>
          <Button onClick={() => navigate("/journal/new")} className="pixel-button">
            <Plus size={16} className="mr-2" />
            Write First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="parchment cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/journal/${entry.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-pixel text-rpg-brown">{entry.title}</h3>
                <div className="text-sm text-rpg-brown">
                  {new Date(entry.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="text-sm text-rpg-brown line-clamp-2">
                {entry.content.replace(/<[^>]*>/g, '')}
              </div>
              
              {entry.mood && (
                <div className="mt-2 text-right">
                  <span className="text-lg">{entry.mood}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
