
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { JournalEntry } from "@/types/journal";
import { toast } from "sonner";
import { isAuthenticated } from "@/utils/auth";
import { ArrowLeft, Edit, Trash, BookOpen } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const JournalEntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadEntry = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/login');
        return;
      }
      
      if (id) {
        fetchJournalEntry(id);
      }
    };
    
    checkAuthAndLoadEntry();
  }, [id, navigate]);

  const fetchJournalEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setEntry(data);
      } else {
        toast.error("Journal entry not found");
        navigate('/journal');
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      toast.error("Failed to load journal entry");
      navigate('/journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Journal entry deleted successfully");
      navigate('/journal');
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast.error("Failed to delete journal entry");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin text-3xl mb-4">⌛</div>
          <p className="text-lg font-medium">Loading journal entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Journal Entry Not Found</h2>
          <Button onClick={() => navigate("/journal")} className="pixel-button">
            <ArrowLeft size={16} className="mr-2" />
            Back to Journal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/journal")}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold flex-grow">{entry.title}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/journal/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <Trash size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="parchment p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-rpg-brown">
            {format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </div>
          {entry.mood && (
            <div className="text-2xl">{entry.mood}</div>
          )}
        </div>

        <div className="my-6 text-rpg-brown whitespace-pre-wrap">
          {entry.content}
        </div>

        <div className="flex justify-between items-center mt-6 text-sm text-rpg-brown/70">
          <div>
            {entry.is_private && (
              <span className="mr-3">🔒 Private</span>
            )}
            {entry.is_favorite && (
              <span>⭐ Favorite</span>
            )}
          </div>
          <div>
            {entry.updated_at !== entry.created_at && 
              `Last edited: ${format(new Date(entry.updated_at), "MMM d, yyyy")}`
            }
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-red-500 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JournalEntryDetail;
