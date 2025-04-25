
import { useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Achievement } from "@/types/achievements";

// Import our new components
import AchievementForm from "@/components/achievements/AchievementForm";
import AchievementStatsCard from "@/components/achievements/AchievementStatsCard";
import AchievementTabs from "@/components/achievements/AchievementTabs";

const Achievements = () => {
  const { gameData, setGameData } = useGameData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const achievements = gameData.achievements || [];
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  
  const categories = {
    all: achievements.length,
    quests: achievements.filter(a => a.category === "quests").length,
    habits: achievements.filter(a => a.category === "habits").length,
    skills: achievements.filter(a => a.category === "skills").length,
    character: achievements.filter(a => a.category === "character").length,
    general: achievements.filter(a => a.category === "general").length
  };
  
  const completionPercentage = achievements.length > 0
    ? Math.round((unlockedAchievements.length / achievements.length) * 100)
    : 0;
  
  const addAchievement = (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => {
    const newAchievement = {
      ...achievement,
      id: crypto.randomUUID(),
      unlocked: false,
      dateUnlocked: null
    };
    
    setGameData({ 
      achievements: [...achievements, newAchievement] 
    }, new Set(['achievements']));
    
    setShowAddDialog(false);
    toast.success("Achievement added successfully!");
  };
  
  const updateAchievement = (achievement: Achievement) => {
    if (editingAchievement) {
      const updatedAchievements = achievements.map(a => 
        a.id === achievement.id ? achievement : a
      );
      
      setGameData({ 
        achievements: updatedAchievements 
      }, new Set(['achievements']));
      
      setEditingAchievement(null);
      toast.success("Achievement updated successfully!");
    }
  };
  
  const deleteAchievement = (achievementId: string) => {
    const updatedAchievements = achievements.filter(a => a.id !== achievementId);
    
    setGameData({ 
      achievements: updatedAchievements 
    }, new Set(['achievements']));
    
    toast.success("Achievement deleted successfully!");
  };
  
  const checkAndUnlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return false;
    
    const updatedAchievements = achievements.map(a => 
      a.id === achievementId 
        ? { ...a, unlocked: true, dateUnlocked: new Date().toISOString() } 
        : a
    );
    
    // Apply rewards to character
    if (achievement.xpReward || achievement.coinReward) {
      const character = gameData.character;
      if (character) {
        setGameData({
          character: {
            ...character,
            xp: character.xp + (achievement.xpReward || 0),
            coins: character.coins + (achievement.coinReward || 0)
          },
          achievements: updatedAchievements
        }, new Set(['character', 'achievements']));
      } else {
        setGameData({ 
          achievements: updatedAchievements 
        }, new Set(['achievements']));
      }
    } else {
      setGameData({ 
        achievements: updatedAchievements 
      }, new Set(['achievements']));
    }
    
    toast.success("Achievement unlocked! Rewards added to your character.");
    return true;
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Achievements</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              New Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Achievement</DialogTitle>
            </DialogHeader>
            <AchievementForm 
              onSubmit={addAchievement} 
              onCancel={() => setShowAddDialog(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingAchievement} 
          onOpenChange={(open) => !open && setEditingAchievement(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Achievement</DialogTitle>
            </DialogHeader>
            {editingAchievement && (
              <AchievementForm 
                initialData={editingAchievement}
                onSubmit={updateAchievement} 
                onCancel={() => setEditingAchievement(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <AchievementStatsCard 
        totalAchievements={achievements.length}
        unlockedAchievements={unlockedAchievements.length}
        completionPercentage={completionPercentage}
      />
      
      <AchievementTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categories={categories}
        achievements={achievements}
        lockedAchievements={lockedAchievements}
        unlockedAchievements={unlockedAchievements}
        onEdit={setEditingAchievement}
        onDelete={deleteAchievement}
        onUnlock={checkAndUnlockAchievement}
        onAddNew={() => setShowAddDialog(true)}
      />
    </div>
  );
};

export default Achievements;
