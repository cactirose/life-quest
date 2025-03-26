
import React from 'react';
import { Habit } from '@/types/habits';
import { Flame, TrendingUp, CheckCircle } from 'lucide-react';

type HabitStatsCardProps = {
  habits: Habit[];
};

export const HabitStatsCard = ({ habits = [] }: HabitStatsCardProps) => {
  // Ensure habits is always an array
  const safeHabits = Array.isArray(habits) ? habits : [];
  
  // Calculate stats
  const totalHabits = safeHabits.length;
  const completedToday = safeHabits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completionHistory?.some(c => c.date === today && c.completed);
  }).length;
  
  const longestStreak = safeHabits.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="parchment p-4 flex items-center">
        <div className="mr-4 bg-rpg-tan rounded-full p-3">
          <CheckCircle className="h-6 w-6 text-rpg-green" />
        </div>
        <div>
          <p className="text-sm text-rpg-brown">Completed Today</p>
          <p className="text-2xl font-pixel text-rpg-brown">{completedToday} / {totalHabits}</p>
        </div>
      </div>
      
      <div className="parchment p-4 flex items-center">
        <div className="mr-4 bg-rpg-tan rounded-full p-3">
          <Flame className="h-6 w-6 text-rpg-red" />
        </div>
        <div>
          <p className="text-sm text-rpg-brown">Longest Streak</p>
          <p className="text-2xl font-pixel text-rpg-brown">{longestStreak} days</p>
        </div>
      </div>
      
      <div className="parchment p-4 flex items-center">
        <div className="mr-4 bg-rpg-tan rounded-full p-3">
          <TrendingUp className="h-6 w-6 text-rpg-blue" />
        </div>
        <div>
          <p className="text-sm text-rpg-brown">Total Habits</p>
          <p className="text-2xl font-pixel text-rpg-brown">{totalHabits}</p>
        </div>
      </div>
    </div>
  );
};
