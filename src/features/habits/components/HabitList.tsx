
import { Button } from "@/components/ui/button";
import { Habit } from "@/types/habits";
import { PlusCircle } from "lucide-react";
import { HabitCard } from "./HabitCard";
import { EmptyHabitState } from "./EmptyHabitState";

type HabitListProps = {
  habits: Habit[];
  onAddHabit: () => void;
  onCompleteHabit: (habitId: string, date: string) => void;
  onUncompleteHabit: (habitId: string, date: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
};

export const HabitList = ({
  habits,
  onAddHabit,
  onCompleteHabit,
  onUncompleteHabit,
  onEditHabit,
  onDeleteHabit
}: HabitListProps) => {
  if (habits.length === 0) {
    return <EmptyHabitState onCreateHabit={onAddHabit} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={onCompleteHabit}
          onUncomplete={onUncompleteHabit}
          onEdit={onEditHabit}
          onDelete={onDeleteHabit}
        />
      ))}
      
      <Button
        onClick={onAddHabit}
        variant="outline"
        className="h-full min-h-40 border-2 border-dashed border-rpg-brown/50 bg-rpg-tan/10 flex flex-col items-center justify-center"
      >
        <PlusCircle size={24} className="mb-2 text-rpg-brown" />
        <span className="font-pixel text-rpg-brown">Add New Habit</span>
      </Button>
    </div>
  );
};
