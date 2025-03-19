
import { useState } from "react";
import { 
  useGameData, 
  Achievement, 
  AchievementCategory, 
  GearItem 
} from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Badge,
  BadgeCheck,
  BadgePercent,
  Award,
  PlusCircle,
  Trash2,
  Edit,
  Sparkle,
  Coins,
  Swords,
  Medal,
  BookOpen,
  UserCircle,
  BarChart
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

const categoryIcons: Record<AchievementCategory, JSX.Element> = {
  quests: <Swords size={18} />,
  habits: <Medal size={18} />,
  skills: <BookOpen size={18} />,
  character: <UserCircle size={18} />,
  general: <BarChart size={18} />
};

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete, 
  onUnlock 
}: { 
  achievement: Achievement; 
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onUnlock: (id: string) => void;
}) => {
  const progress = achievement.requiredCount && achievement.currentCount !== undefined
    ? Math.min(100, (achievement.currentCount / achievement.requiredCount) * 100)
    : 0;
  
  const isTrackable = achievement.requiredCount !== undefined && achievement.currentCount !== undefined;
  
  return (
    <div 
      className={`wood-texture p-4 relative overflow-hidden border-2 ${
        achievement.unlocked 
          ? "border-rpg-green" 
          : "border-rpg-brown"
      }`}
    >
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 bg-rpg-green text-white px-2 py-1 text-xs transform translate-x-2 -translate-y-2 rotate-45">
          Unlocked
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-rpg-tan flex items-center justify-center">
            {achievement.unlocked ? <BadgeCheck size={16} /> : <Badge size={16} />}
          </div>
          <div>
            <h3 className="font-pixel text-rpg-brown">{achievement.title}</h3>
            <div className="flex items-center gap-1 text-xs text-rpg-brown">
              {categoryIcons[achievement.category]}
              <span className="capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>
        
        {!achievement.unlocked && (
          <div className="flex items-center gap-1">
            <Button 
              onClick={() => onEdit(achievement)}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8"
            >
              <Edit size={14} />
            </Button>
            
            <Button 
              onClick={() => onDelete(achievement.id)}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8 text-rpg-red hover:text-white hover:bg-rpg-red"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-sm text-rpg-brown mb-3">{achievement.description}</p>
      
      {isTrackable && !achievement.unlocked && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-rpg-brown mb-1">
            <span>Progress: {achievement.currentCount}/{achievement.requiredCount}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-rpg-brown">
          <div className="flex items-center">
            <Sparkle size={14} className="mr-1" />
            <span>+{achievement.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="mr-1" />
            <span>+{achievement.coinReward}</span>
          </div>
          {achievement.specialReward && (
            <div className="flex items-center">
              <BadgePercent size={14} className="mr-1 text-rpg-purple" />
              <span className="text-rpg-purple">Special</span>
            </div>
          )}
        </div>
        
        {achievement.unlocked ? (
          <div className="text-xs text-rpg-brown">
            Unlocked: {achievement.dateUnlocked ? format(new Date(achievement.dateUnlocked), "MMM d, yyyy") : "Unknown"}
          </div>
        ) : (
          <Button
            onClick={() => onUnlock(achievement.id)}
            variant="outline"
            size="sm"
            className="bg-rpg-green text-white border-none hover:bg-rpg-light-green"
          >
            <BadgeCheck size={14} className="mr-1" /> Unlock
          </Button>
        )}
      </div>
    </div>
  );
};

const AchievementForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel 
}: { 
  onSubmit: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void; 
  initialData?: Achievement | null; 
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<AchievementCategory>(initialData?.category || "general");
  const [icon, setIcon] = useState(initialData?.icon || "🏆");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 50);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 25);
  const [isTrackable, setIsTrackable] = useState(!!initialData?.requiredCount);
  const [requiredCount, setRequiredCount] = useState(initialData?.requiredCount || 5);
  
  // List of emoji icons to choose from for achievements
  const emojiOptions = ["🏆", "🏅", "🎖️", "⭐", "🌟", "✨", "🎯", "🚀", "🎮", "🔮", "💎", "🌈", "🔥", "👑", "⚔️", "🛡️", "📚", "🧠", "💪", "🎓"];
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter an achievement title");
      return;
    }
    
    const achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked"> = {
      title,
      description,
      category,
      icon,
      xpReward,
      coinReward,
      specialReward: initialData?.specialReward,
      ...(isTrackable ? { 
        requiredCount, 
        currentCount: initialData?.currentCount || 0 
      } : {})
    };
    
    onSubmit(achievement);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Achievement Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter achievement title"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter achievement description"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={category}
          onValueChange={(value: AchievementCategory) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quests">Quests</SelectItem>
            <SelectItem value="habits">Habits</SelectItem>
            <SelectItem value="skills">Skills</SelectItem>
            <SelectItem value="character">Character</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Icon
        </label>
        <div className="grid grid-cols-10 gap-2">
          {emojiOptions.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`h-8 w-8 flex items-center justify-center rounded-md border ${
                icon === emoji 
                  ? "border-2 border-rpg-brown bg-rpg-tan" 
                  : "border-border hover:bg-accent"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="xpReward" className="block text-sm font-medium mb-1">
            XP Reward
          </label>
          <Input
            id="xpReward"
            type="number"
            min="0"
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="coinReward" className="block text-sm font-medium mb-1">
            Coin Reward
          </label>
          <Input
            id="coinReward"
            type="number"
            min="0"
            value={coinReward}
            onChange={(e) => setCoinReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTrackable"
          checked={isTrackable}
          onChange={(e) => setIsTrackable(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="isTrackable" className="text-sm font-medium">
          This achievement tracks counts (e.g., complete X quests)
        </label>
      </div>
      
      {isTrackable && (
        <div>
          <label htmlFor="requiredCount" className="block text-sm font-medium mb-1">
            Required Count
          </label>
          <Input
            id="requiredCount"
            type="number"
            min="1"
            value={requiredCount}
            onChange={(e) => setRequiredCount(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            How many items must be completed to unlock this achievement
          </p>
        </div>
      )}
      
      {initialData?.specialReward && (
        <div className="border p-3 rounded-md bg-rpg-parchment/50">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-rpg-purple" />
            <span className="font-medium">Special Reward</span>
          </div>
          <div className="text-sm">
            <p className="font-pixel">{initialData.specialReward.name}</p>
            <p className="text-xs text-rpg-brown">{initialData.specialReward.description}</p>
          </div>
        </div>
      )}
      
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Achievement' : 'Create Achievement'}
        </Button>
      </DialogFooter>
    </div>
  );
};

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
  
  // Compute category counts
  const categories = {
    all: achievements.length,
    quests: achievements.filter(a => a.category === "quests").length,
    habits: achievements.filter(a => a.category === "habits").length,
    skills: achievements.filter(a => a.category === "skills").length,
    character: achievements.filter(a => a.category === "character").length,
    general: achievements.filter(a => a.category === "general").length
  };
  
  // Get completion percentage
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
  
  const filterAchievementsByCategory = (category: string) => {
    if (category === "all") return achievements;
    return achievements.filter(a => a.category === category);
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
      
      <div className="parchment p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-rpg-brown" size={24} />
          <h2 className="text-2xl font-pixel text-rpg-brown">Trophy Room</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Total Achievements</div>
            <div className="text-2xl font-pixel text-rpg-brown">{achievements.length}</div>
          </div>
          
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Unlocked</div>
            <div className="text-2xl font-pixel text-rpg-brown">{unlockedAchievements.length}</div>
          </div>
          
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Completion</div>
            <div className="text-2xl font-pixel text-rpg-brown">{completionPercentage}%</div>
          </div>
        </div>
        
        <div className="w-full bg-rpg-tan/30 h-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rpg-green"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
          <TabsTrigger 
            value="all" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            All ({categories.all})
          </TabsTrigger>
          <TabsTrigger 
            value="quests" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Quests ({categories.quests})
          </TabsTrigger>
          <TabsTrigger 
            value="habits" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Habits ({categories.habits})
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Skills ({categories.skills})
          </TabsTrigger>
          <TabsTrigger 
            value="character" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Character ({categories.character})
          </TabsTrigger>
          <TabsTrigger 
            value="general" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            General ({categories.general})
          </TabsTrigger>
        </TabsList>
        
        {Object.keys(categories).map(category => (
          <TabsContent key={category} value={category} className="animate-fade-in">
            {filterAchievementsByCategory(category).length === 0 ? (
              <div className="text-center py-12 parchment">
                <BadgePercent size={48} className="mx-auto mb-4 text-rpg-brown" />
                <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Achievements</h3>
                <p className="text-rpg-brown mb-4">Create achievements to track your progress!</p>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="pixel-button"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Create Your First Achievement
                </Button>
              </div>
            ) : (
              <>
                {lockedAchievements.filter(a => category === "all" || a.category === category).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-pixel text-rpg-brown mb-4">Locked Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lockedAchievements
                        .filter(a => category === "all" || a.category === category)
                        .map(achievement => (
                          <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            onEdit={setEditingAchievement}
                            onDelete={handleDeleteAchievement}
                            onUnlock={handleUnlockAchievement}
                          />
                        ))}
                    </div>
                  </div>
                )}
                
                {unlockedAchievements.filter(a => category === "all" || a.category === category).length > 0 && (
                  <div>
                    <h3 className="text-xl font-pixel text-rpg-brown mb-4">Unlocked Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {unlockedAchievements
                        .filter(a => category === "all" || a.category === category)
                        .map(achievement => (
                          <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            onEdit={setEditingAchievement}
                            onDelete={handleDeleteAchievement}
                            onUnlock={handleUnlockAchievement}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Achievements;
