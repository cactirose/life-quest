import React from 'react';
import { Habit } from '@/types/habits';
import { EmptyHabitState } from './EmptyHabitState';
import { HabitCard } from './HabitCard';

type HabitListProps = {
  habits: Habit[];
  onAddHabit: () => void;
  onCompleteHabit: (habitId: string, date: string) => void;
  onUncompleteHabit: (habitId: string, date: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
};

export const HabitList = ({
  habits = [], // Provide default value
  onAddHabit,
  onCompleteHabit,
  onUncompleteHabit,
  onEditHabit,
  onDeleteHabit
}: HabitListProps) => {
  // Ensure habits is always an array
  const safeHabits = Array.isArray(habits) ? habits : [];
  
  if (safeHabits.length === 0) {
    return <EmptyHabitState onCreateHabit={onAddHabit} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in mt-6">
      {safeHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={onCompleteHabit}
          onUncomplete={onUncompleteHabit}
          onEdit={onEditHabit}
          onDelete={onDeleteHabit}
        />
      ))}
    </div>
  );
};
