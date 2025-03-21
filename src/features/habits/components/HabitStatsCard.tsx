
import { Habit } from "@/types/habits";
import { BarChart } from "lucide-react";

type HabitStatsCardProps = {
  habits: Habit[];
};

export const HabitStatsCard = ({ habits }: HabitStatsCardProps) => {
  const todayCompletedCount = habits.filter(habit => 
    habit.completionHistory.some(comp => 
      comp.date.startsWith(new Date().toISOString().split('T')[0]) && comp.completed
    )
  ).length;
  
  const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  
  return (
    <div className="parchment p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <BarChart size={20} className="text-rpg-brown" />
        <h2 className="text-lg font-pixel text-rpg-brown">Your Habit Stats</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Total Habits</div>
          <div className="text-2xl font-pixel text-rpg-brown">{habits.length}</div>
        </div>
        
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Completed Today</div>
          <div className="text-2xl font-pixel text-rpg-brown">
            {todayCompletedCount} / {habits.length}
          </div>
        </div>
        
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Best Streak</div>
          <div className="text-2xl font-pixel text-rpg-brown">
            {bestStreak}
          </div>
        </div>
      </div>
    </div>
  );
};
