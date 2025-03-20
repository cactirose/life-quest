
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scroll, ShieldCheck, Target, Sparkle, ShoppingBag, ListChecks, Award, Smile, Flag, Backpack } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameData } from "@/contexts/DataContext";

export function TutorialSection() {
  const [showTutorial, setShowTutorial] = useState(true);
  const {
    character
  } = useGameData();

  // If the character is above level 3, don't show the tutorial by default
  const isNewUser = character.level <= 3;

  // Control visibility with local state
  const [isVisible, setIsVisible] = useState(isNewUser);
  if (!isVisible) return null;
  return <div className="mb-12 animate-fade-in">
      <Card className="parchment border-2 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-pixel flex items-center gap-2 text-[var(--rpg-text)]">
            <Sparkle className="text-[var(--rpg-accent)]" size={24} />
            Welcome to Your Quest Journal
          </CardTitle>
          <CardDescription className="text-[var(--rpg-text)]">
            Here's a quick guide to help you get started on your productivity adventure!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Scroll className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Quests</h3>
              <p className="text-xs text-[var(--rpg-text)]">Track daily tasks as epic quests with rewards</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ShieldCheck className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Character</h3>
              <p className="text-xs text-[var(--rpg-text)]">Level up and improve your character's stats</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Target className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Skills</h3>
              <p className="text-xs text-[var(--rpg-text)]">Unlock new abilities in your skill tree</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ShoppingBag className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Shop</h3>
              <p className="text-xs text-[var(--rpg-text)]">Spend coins on gear and real-life rewards</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ListChecks className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Habits</h3>
              <p className="text-xs text-[var(--rpg-text)]">Build consistent habits with streak bonuses</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Award className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Achievements</h3>
              <p className="text-xs text-[var(--rpg-text)]">Complete special challenges to earn rewards</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Smile className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Mood</h3>
              <p className="text-xs text-[var(--rpg-text)]">Track your daily mood and energy levels</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Flag className="text-[var(--rpg-text)] mb-2" size={24} />
              <h3 className="font-pixel text-[var(--rpg-text)] text-lg mb-1">Challenges</h3>
              <p className="text-xs text-[var(--rpg-text)]">Complete special tasks for bonus rewards</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-0">
          <Button 
            variant="outline" 
            className="hover:bg-[var(--rpg-accent)] hover:text-[var(--rpg-accent-text)]" 
            onClick={() => setIsVisible(false)}>
            Got it!
          </Button>
        </CardFooter>
      </Card>
    </div>;
}
