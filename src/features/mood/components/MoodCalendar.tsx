
import React from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay 
} from "date-fns";
import { MoodEntry, MoodType } from "@/types/mood";
import { getMoodColor } from "@/utils/moodUtils";

interface MoodCalendarProps {
  month: Date;
  moods: MoodEntry[];
  onDateClick?: (date: Date) => void;
}

export const MoodCalendar = ({ month, moods, onDateClick }: MoodCalendarProps) => {
  // Get all days in the month
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Function to get mood for a specific date
  const getMoodForDay = (date: Date): MoodType | null => {
    const moodEntry = moods.find(mood => 
      isSameDay(new Date(mood.date), date)
    );
    
    return moodEntry ? moodEntry.mood : null;
  };
  
  // Get the weekday names
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="parchment p-4 rounded-lg shadow-md">
      <h3 className="font-pixel text-xl text-rpg-brown mb-3">
        {format(month, "MMMM yyyy")}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 w-full" style={{ width: "100%" }}>
        {/* Weekday headers */}
        {weekdays.map(day => (
          <div 
            key={day} 
            className="text-center font-bold text-rpg-brown py-1"
          >
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the start of month */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div 
            key={`empty-start-${index}`} 
            className="p-1 border-none"
          />
        ))}
        
        {/* Days of the month */}
        {days.map(day => {
          const mood = getMoodForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toISOString()} 
              className={`aspect-square p-1 border rounded cursor-pointer transition-transform hover:scale-105 ${
                isToday ? "border-rpg-green border-2" : "border-rpg-tan"
              }`}
              style={{
                backgroundColor: mood ? getMoodColor(mood) : 'transparent'
              }}
              onClick={() => onDateClick && onDateClick(day)}
              title={mood ? `${format(day, "MMM d")}: ${mood}` : format(day, "MMM d")}
            >
              <div className={`text-center font-medium ${mood ? "text-white" : "text-rpg-brown"}`}>
                {format(day, "d")}
              </div>
            </div>
          );
        })}
        
        {/* Empty cells for days after the end of month */}
        {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
          <div 
            key={`empty-end-${index}`} 
            className="p-1 border-none"
          />
        ))}
      </div>
    </div>
  );
};
