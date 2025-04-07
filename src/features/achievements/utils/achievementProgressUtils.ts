import { Achievement } from "@/types/achievements";
import { toast } from "sonner";

export const updateAchievementProgress = (
  achievements: Achievement[],
  achievementIds: string[],
  increment: number = 1
): Achievement[] => {
  return achievements.map(achievement => {
    if (!achievementIds.includes(achievement.id)) return achievement;
    
    // Don't increment if already completed
    if (achievement.unlocked) return achievement;
    
    const newProgress = Math.min(achievement.progress + increment, achievement.goal);
    const wasCompleted = achievement.progress < achievement.goal && newProgress >= achievement.goal;
    
    if (wasCompleted) {
      toast.success(`Achievement Unlocked: ${achievement.title}!`);
    }
    
    return {
      ...achievement,
      progress: newProgress,
      unlocked: newProgress >= achievement.goal,
      dateUnlocked: wasCompleted ? new Date().toISOString() : achievement.dateUnlocked
    };
  });
}; 