
import { useState } from "react";
import { useGameData, Achievement } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Import our new components
import AchievementForm from "@/components/achievements/AchievementForm";
import AchievementStatsCard from "@/components/achievements/AchievementStatsCard";
import AchievementTabs from "@/components/achievements/AchievementTabs";

const Achievements = () => {
  const { 
    achievements, 
    addAchievement, 
    updateAchievement, 
    deleteAchievement, 
    checkAndUnlockAchievement 
  } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
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
  
  const handleAddAchievement = (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => {
    addAchievement(achievement);
    setShowAddDialog(false);
    toast.success("Achievement added successfully!");
  };
  
  const handleUpdateAchievement = (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => {
    if (editingAchievement) {
      updateAchievement({
        ...editingAchievement,
        ...achievement,
      });
      setEditingAchievement(null);
      toast.success("Achievement updated successfully!");
    }
  };
  
  const handleDeleteAchievement = (achievementId: string) => {
    deleteAchievement(achievementId);
    toast.success("Achievement deleted successfully!");
  };
  
  const handleUnlockAchievement = (achievementId: string) => {
    const unlocked = checkAndUnlockAchievement(achievementId);
    if (unlocked) {
      toast.success("Achievement unlocked! Rewards added to your character.");
    } else {
      toast.error("Failed to unlock achievement.");
    }
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
              onSubmit={handleAddAchievement} 
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
                onSubmit={handleUpdateAchievement} 
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
        onDelete={handleDeleteAchievement}
        onUnlock={handleUnlockAchievement}
        onAddNew={() => setShowAddDialog(true)}
      />
    </div>
  );
};

export default Achievements;
