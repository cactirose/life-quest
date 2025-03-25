
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Scroll, 
  ShieldCheck, 
  Target, 
  Sparkle, 
  ShoppingBag, 
  ListChecks, 
  Award, 
  Smile, 
  Flag, 
  Backpack 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameData } from "@/contexts/DataContext";

export function TutorialSection() {
  // Always initialize state regardless of visibility conditions
  const [isVisible, setIsVisible] = useState(true);
  const { character } = useGameData();
  
  // If game data is not loaded yet or character is undefined, show the tutorial by default
  if (!character || typeof character !== 'object') {
    return renderTutorialContent(true);
  }
  
  // If the character is above level 3, don't show the tutorial by default
  // Default to true if level is undefined to ensure the tutorial shows
  const characterLevel = typeof character.level === 'number' ? character.level : 0;
  const isNewUser = characterLevel <= 3;
  
  // Update visibility state based on user level
  // Use a useEffect instead of directly setting state to avoid render issues
  useEffect(() => {
    setIsVisible(isNewUser);
  }, [isNewUser]);
  
  if (!isVisible) return null;
  
  return renderTutorialContent(isVisible, () => setIsVisible(false));
}

// Extracted the tutorial content to a separate function to avoid duplication
function renderTutorialContent(isVisible: boolean, onClose?: () => void) {
  if (!isVisible) return null;
  
  return (
    <div className="mb-12 animate-fade-in">
      <Card className="parchment border-2 border-rpg-brown shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-pixel text-rpg-brown flex items-center gap-2">
            <Sparkle className="text-rpg-brown" size={24} />
            Welcome to Your Quest Journal
          </CardTitle>
          <CardDescription className="text-rpg-brown">
            Here's a quick guide to help you get started on your productivity adventure!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Scroll className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Quests</h3>
              <p className="text-xs text-rpg-brown">Track daily tasks as epic quests with rewards</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ShieldCheck className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Character</h3>
              <p className="text-xs text-rpg-brown">Level up and improve your character's stats</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Target className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Skills</h3>
              <p className="text-xs text-rpg-brown">Unlock new abilities in your skill tree</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ShoppingBag className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Shop</h3>
              <p className="text-xs text-rpg-brown">Spend coins on gear and real-life rewards</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <ListChecks className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Habits</h3>
              <p className="text-xs text-rpg-brown">Build consistent habits with streak bonuses</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Award className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Achievements</h3>
              <p className="text-xs text-rpg-brown">Complete special challenges to earn rewards</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Smile className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Mood</h3>
              <p className="text-xs text-rpg-brown">Track your daily mood and energy levels</p>
            </div>
            
            <div className="wood-texture p-4 rounded-lg flex flex-col items-center text-center">
              <Flag className="text-rpg-brown mb-2" size={24} />
              <h3 className="font-pixel text-rpg-brown text-lg mb-1">Challenges</h3>
              <p className="text-xs text-rpg-brown">Complete special tasks for bonus rewards</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-0">
          {onClose && (
            <Button 
              variant="outline" 
              className="text-rpg-brown border-rpg-brown hover:bg-rpg-brown hover:text-rpg-tan"
              onClick={onClose}
            >
              Got it!
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
