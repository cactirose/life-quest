
import { useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Habit } from "@/types/habits";

// Import the refactored components
import { HabitForm } from "@/features/habits/components/HabitForm";
import { HabitStatsCard } from "@/features/habits/components/HabitStatsCard";
import { HabitList } from "@/features/habits/components/HabitList";

const Habits = () => {
  const { habits, addHabit, updateHabit, deleteHabit, completeHabit, uncompleteHabit } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  
  const handleAddHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    addHabit(habit);
    setShowAddDialog(false);
    toast.success("Habit added successfully!");
  };
  
  const handleUpdateHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    if (editingHabit) {
      const updatedHabit = {
        ...editingHabit,
        ...habit,
      };
      updateHabit(updatedHabit);
      setEditingHabit(null);
      toast.success("Habit updated successfully!");
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    toast.success("Habit deleted successfully!");
  };
  
  const handleCompleteHabit = (habitId: string, date: string) => {
    completeHabit(habitId, date);
    toast.success("Habit marked as completed!");
  };
  
  const handleUncompleteHabit = (habitId: string, date: string) => {
    uncompleteHabit(habitId, date);
    toast.info("Habit marked as not completed.");
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Habit Tracker</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Habit</DialogTitle>
            </DialogHeader>
            <HabitForm 
              onSubmit={handleAddHabit} 
              onCancel={() => setShowAddDialog(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingHabit} 
          onOpenChange={(open) => !open && setEditingHabit(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Habit</DialogTitle>
            </DialogHeader>
            {editingHabit && (
              <HabitForm 
                initialData={editingHabit}
                onSubmit={handleUpdateHabit} 
                onCancel={() => setEditingHabit(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <HabitStatsCard habits={habits} />
      
      <HabitList 
        habits={habits}
        onAddHabit={() => setShowAddDialog(true)}
        onCompleteHabit={handleCompleteHabit}
        onUncompleteHabit={handleUncompleteHabit}
        onEditHabit={setEditingHabit}
        onDeleteHabit={handleDeleteHabit}
      />
    </div>
  );
};

export default Habits;
