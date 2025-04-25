
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Heart, Calendar, Clock, ArrowLeft, Lock, Star } from 'lucide-react';
import { JournalEntry } from '@/types/journal';
import { useGameData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MOOD_OPTIONS } from '@/components/journal/JournalFormSchema';

export default function JournalEntryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gameData, setGameData } = useGameData();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id && gameData.journalEntries) {
      const foundEntry = gameData.journalEntries.find(e => e.id === id);
      setEntry(foundEntry || null);
    }
    setLoading(false);
  }, [id, gameData.journalEntries]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded-md w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-8"></div>
            <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Entry Not Found</h1>
          <p className="mb-6">The journal entry you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/journal')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Journal
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    const updatedEntries = gameData.journalEntries?.filter(e => e.id !== id) || [];
    setGameData({ journalEntries: updatedEntries }, new Set(['journalEntries']));
    toast.success("Journal entry deleted");
    navigate('/journal');
  };
  
  const toggleFavorite = () => {
    const updatedEntries = gameData.journalEntries?.map(e => 
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    ) || [];
    
    setGameData({ journalEntries: updatedEntries }, new Set(['journalEntries']));
    toast.success(entry.isFavorite ? "Removed from favorites" : "Added to favorites");
    setEntry(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
  };

  const moodLabel = entry.mood ? 
    MOOD_OPTIONS.find(m => m.value === entry.mood)?.label || entry.mood 
    : 'No mood recorded';
  
  const formattedCreatedDate = entry.created_at ? 
    format(new Date(entry.created_at), 'PPP') : 'Unknown date';
  
  const formattedUpdatedDate = entry.updated_at ? 
    format(new Date(entry.updated_at), 'PPP') : 'Unknown date';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/journal')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Journal
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{entry.title}</CardTitle>
                <div className="text-lg text-muted-foreground">{moodLabel}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={toggleFavorite} title={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}>
                  <Star className={entry.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/journal/edit/${id}`}>
                    <Pencil size={18} />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 size={18} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this journal entry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none">
              {entry.content.split('\n').map((paragraph, i) => (
                paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              {entry.isPrivate && (
                <div className="flex items-center">
                  <Lock size={14} className="mr-1" />
                  <span>Private</span>
                </div>
              )}
              {entry.isFavorite && (
                <div className="flex items-center text-yellow-600">
                  <Star size={14} className="mr-1 fill-yellow-600" />
                  <span>Favorite</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>Created: {formattedCreatedDate}</span>
              </div>
              {entry.updated_at !== entry.created_at && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>Updated: {formattedUpdatedDate}</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
