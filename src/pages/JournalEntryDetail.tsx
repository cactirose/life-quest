
import { useParams, useNavigate } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Edit, ArrowLeft, Star, Lock, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { JournalEntry } from "@/types/journal";
import { MoodType } from "@/types/mood";

const MOOD_COLORS: Record<MoodType | string, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  anxious: "bg-yellow-500",
  calm: "bg-teal-500",
  excited: "bg-purple-500",
  bored: "bg-gray-500",
  proud: "bg-amber-500",
  stressed: "bg-orange-500",
  neutral: "bg-slate-500",
  default: "bg-slate-500",
};

const MOOD_EMOJIS: Record<MoodType | string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  calm: "😌",
  excited: "🤩",
  bored: "😒",
  proud: "😎",
  stressed: "😩",
  neutral: "😐",
  default: "😐",
};

export default function JournalEntryDetail() {
  const { id } = useParams<{ id: string }>();
  const { gameData, setGameData } = useGameData();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const journalEntries = gameData.journalEntries || [];
  const entry = journalEntries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-semibold mb-2">Entry Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The journal entry you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/journal")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    const updatedEntries = journalEntries.filter((e) => e.id !== id);
    setGameData({ journalEntries: updatedEntries }, new Set(["journalEntries"]));
    toast.success("Journal entry deleted");
    navigate("/journal");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "PPpp");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/journal")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journal
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(`/journal/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your
                  journal entry.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-8 border-t-4 border-t-primary">
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex-grow">
              <h1 className="text-3xl font-bold">{entry.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {entry.isPrivate && (
                <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500">
                  <Lock className="h-3 w-3" />
                  Private
                </Badge>
              )}
              {entry.isFavorite && (
                <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-500">
                  <Star className="h-3 w-3" />
                  Favorite
                </Badge>
              )}
              {entry.mood && (
                <Badge
                  className={`${
                    MOOD_COLORS[entry.mood] || MOOD_COLORS.default
                  } text-white`}
                >
                  {MOOD_EMOJIS[entry.mood] || MOOD_EMOJIS.default} {entry.mood}
                </Badge>
              )}
            </div>
          </div>

          <div className="mb-6 text-sm text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {entry.updatedAt !== entry.createdAt
              ? `Updated ${formatDate(entry.updatedAt)}`
              : `Created ${formatDate(entry.createdAt)}`}
          </div>

          <Separator className="mb-4" />

          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {entry.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
