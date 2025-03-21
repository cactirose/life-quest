
import { Button } from "@/components/ui/button";
import { CalendarPlus, PlusCircle } from "lucide-react";

type EmptyHabitStateProps = {
  onCreateHabit: () => void;
};

export const EmptyHabitState = ({ onCreateHabit }: EmptyHabitStateProps) => {
  return (
    <div className="text-center py-12 parchment">
      <CalendarPlus size={48} className="mx-auto mb-4 text-rpg-brown" />
      <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Habits Created Yet</h3>
      <p className="text-rpg-brown mb-4">Start tracking your daily habits to build consistency!</p>
      <Button 
        onClick={onCreateHabit}
        className="pixel-button"
      >
        <PlusCircle size={16} className="mr-2" />
        Create Your First Habit
      </Button>
    </div>
  );
};
