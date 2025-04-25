
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLoginStreak } from "@/hooks/useLoginStreak";
import { Calendar, Gift } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function DailyLoginCard() {
  const { streak, claimDailyBonus, isClaimingBonus, canClaimBonus } = useLoginStreak();
  const [showReward, setShowReward] = useState(false);
  
  const handleClaimClick = async () => {
    if (!canClaimBonus) {
      toast.info("You've already claimed your daily bonus today");
      return;
    }
    
    await claimDailyBonus();
    setShowReward(true);
    
    // Hide reward animation after a delay
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };
  
  // Calculate progress to next streak milestone
  const nextMilestone = streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : streak + 7;
  const progress = ((streak % 7) / 7) * 100;

  return (
    <Card className="parchment relative overflow-hidden">
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 animate-fade-in">
          <div className="text-center p-8 bg-rpg-tan rounded-lg animate-bounce-once shadow-xl">
            <Gift className="w-16 h-16 mx-auto text-rpg-green mb-4" />
            <h3 className="text-2xl font-pixel text-rpg-brown mb-2">Daily Bonus Claimed!</h3>
            <p className="text-rpg-brown">Keep up your streak for greater rewards!</p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-rpg-brown" />
          <h2 className="text-xl font-pixel text-rpg-brown">Daily Login</h2>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-rpg-brown mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-rpg-brown">{streak} {streak === 1 ? 'day' : 'days'}</p>
          </div>
          
          <Button
            onClick={handleClaimClick}
            disabled={isClaimingBonus || !canClaimBonus}
            className={`pixel-button ${!canClaimBonus ? 'bg-gray-400' : ''}`}
          >
            {isClaimingBonus ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Gift className="h-4 w-4 mr-2" />
            )}
            {canClaimBonus ? 'Claim Bonus' : 'Claimed'}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-rpg-brown">
            <span>{streak} days</span>
            <span>Next: {nextMilestone} days</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mt-4 text-sm text-rpg-brown">
          <p>Login every day to increase your streak and earn greater rewards!</p>
        </div>
      </div>
    </Card>
  );
}
