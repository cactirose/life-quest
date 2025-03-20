import { useState } from "react";
import { 
  useGameData, 
  Challenge, 
  ChallengeFrequency, 
  StatName,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Trophy, 
  CalendarDays, 
  Calendar, 
  CalendarClock,
  Sparkle, 
  Coins, 
  PlusCircle, 
  CheckCircle2,
  Trash2, 
  Edit, 
  Award,
  Info
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from "@/components/ui/tooltip";

const ChallengeCard = ({ 
  challenge, 
  onComplete, 
  onEdit, 
  onDelete 
}: { 
  challenge: Challenge; 
  onComplete: (id: string) => void;
  onEdit: (challenge: Challenge) => void;
  onDelete: (id: string) => void;
}) => {
  const progress = challenge.requiredCount > 0 
    ? Math.min(100, (challenge.currentCount / challenge.requiredCount) * 100) 
    : 0;
  
  const getFrequencyIcon = (frequency: ChallengeFrequency) => {
    switch (frequency) {
      case "daily":
        return <CalendarDays size={16} className="text-rpg-blue" />;
      case "weekly":
        return <Calendar size={16} className="text-rpg-purple" />;
      case "monthly":
        return <CalendarClock size={16} className="text-rpg-red" />;
      default:
        return <CalendarDays size={16} />;
    }
  };
  
  const formatResetDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit' 
    });
  };

  return (
    <div className={`quest-card ${challenge.status === "completed" ? "opacity-75" : ""}`}>
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="text-rpg-brown" size={20} />
          <h3 className="font-pixel text-lg text-rpg-brown">{challenge.title}</h3>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1
            ${challenge.frequency === "daily" ? "bg-rpg-blue text-white" : 
              challenge.frequency === "weekly" ? "bg-rpg-purple text-white" : 
              "bg-rpg-red text-white"}`}
          >
            {getFrequencyIcon(challenge.frequency)}
            <span className="capitalize">{challenge.frequency}</span>
          </span>
        </div>
      </div>
      
      <p className="text-sm text-rpg-brown mb-3">{challenge.description}</p>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-rpg-brown mb-1">
          <span>Progress: {challenge.currentCount}/{challenge.requiredCount}</span>
          <span>Resets: {formatResetDate(challenge.resetDate)}</span>
        </div>
        <div className="pixel-progress-bar">
          <div 
            className="pixel-progress-bar-fill"
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-rpg-brown">
          <div className="flex items-center">
            <Sparkle size={14} className="mr-1" />
            <span>+{challenge.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="mr-1" />
            <span>+{challenge.coinReward}</span>
          </div>
          {challenge.specialReward && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <Award size={14} className="mr-1 text-rpg-purple" />
                    <span className="text-rpg-purple">Special</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <p className="font-semibold text-sm">{challenge.specialReward.name}</p>
                    <p className="text-xs">{challenge.specialReward.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {challenge.status === "active" && challenge.currentCount >= challenge.requiredCount && (
            <Button 
              onClick={() => onComplete(challenge.id)}
              variant="outline"
              size="sm"
              className="bg-rpg-green text-white border-none hover:bg-rpg-light-green"
            >
              <CheckCircle2 size={14} className="mr-1" /> Claim
            </Button>
          )}
          
          {challenge.status === "active" && (
            <>
              <Button 
                onClick={() => onEdit(challenge)}
                variant="outline"
                size="sm"
                className="p-1 h-8 w-8"
              >
                <Edit size={14} />
              </Button>
              
              <Button 
                onClick={() => onDelete(challenge.id)}
                variant="outline"
                size="sm"
                className="p-1 h-8 w-8 text-rpg-red hover:text-white hover:bg-rpg-red"
              >
                <Trash2 size={14} />
              </Button>
            </>
          )}
          
          {challenge.status === "completed" && (
            <span className="text-xs px-2 py-1 bg-rpg-green text-white rounded-full">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ChallengeForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel 
}: { 
  onSubmit: (challenge: Omit<Challenge, "id">) => void; 
  initialData?: Challenge | null; 
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [frequency, setFrequency] = useState<ChallengeFrequency>(initialData?.frequency || "daily");
  const [requiredCount, setRequiredCount] = useState(initialData?.requiredCount || 3);
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 25);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 15);
  
  const initialStatRewards = {
    strength: initialData?.statRewards?.strength || 0,
    dexterity: initialData?.statRewards?.dexterity || 0,
    constitution: initialData?.statRewards?.constitution || 0,
    intelligence: initialData?.statRewards?.intelligence || 0,
    wisdom: initialData?.statRewards?.wisdom || 0,
    charisma: initialData?.statRewards?.charisma || 0
  };
  
  const [statRewards, setStatRewards] = useState(initialStatRewards);
  
  const calculateResetDate = (freq: ChallengeFrequency): string => {
    const now = new Date();
    let resetDate: Date;
    
    switch (freq) {
      case "daily":
        resetDate = new Date(now);
        resetDate.setDate(now.getDate() + 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        resetDate = new Date(now);
        resetDate.setDate(now.getDate() + (7 - now.getDay()));
        resetDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      default:
        resetDate = new Date(now);
        resetDate.setDate(now.getDate() + 1);
    }
    
    return resetDate.toISOString();
  };
  
  const handleStatChange = (stat: StatName, value: number) => {
    setStatRewards(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a challenge title");
      return;
    }
    
    if (requiredCount <= 0) {
      toast.error("Required count must be greater than 0");
      return;
    }
    
    const challenge: Omit<Challenge, "id"> = {
      title,
      description,
      frequency,
      xpReward,
      coinReward,
      specialReward: initialData?.specialReward,
      status: initialData?.status || "active",
      requiredCount,
      currentCount: initialData?.currentCount || 0,
      resetDate: initialData?.resetDate || calculateResetDate(frequency),
      statRewards: Object.fromEntries(
        Object.entries(statRewards).filter(([_, value]) => value > 0)
      )
    };
    
    onSubmit(challenge);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Challenge Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter challenge title"
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
          placeholder="Enter challenge description"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency
        </label>
        <Select
          value={frequency}
          onValueChange={(value: ChallengeFrequency) => setFrequency(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
          {frequency === "daily" 
            ? "How many tasks/quests/habits to complete each day" 
            : frequency === "weekly"
              ? "How many tasks/quests/habits to complete each week"
              : "How many tasks/quests/habits to complete each month"}
        </p>
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
      
      <div>
        <label className="block text-sm font-medium mb-2">Stat Rewards</label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(statRewards) as StatName[]).map(stat => (
            <div key={stat} className="flex items-center gap-2">
              <span className="text-sm capitalize w-20">{stat}</span>
              <Input
                type="number"
                min="0"
                max="5"
                value={statRewards[stat]}
                onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                className="w-16"
              />
            </div>
          ))}
        </div>
      </div>
      
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
          {initialData ? 'Update Challenge' : 'Create Challenge'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const Challenges = () => {
  const { 
    challenges, 
    addChallenge, 
    updateChallenge, 
    deleteChallenge, 
    completeChallenge,
    character,
    claimDailyBonus
  } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  
  const activeChallenges = challenges.filter(c => c.status === "active");
  const completedChallenges = challenges.filter(c => c.status === "completed");
  
  const dailyChallenges = activeChallenges.filter(c => c.frequency === "daily");
  const weeklyChallenges = activeChallenges.filter(c => c.frequency === "weekly");
  const monthlyChallenges = activeChallenges.filter(c => c.frequency === "monthly");
  
  const completedDailyChallenges = completedChallenges.filter(c => c.frequency === "daily");
  const completedWeeklyChallenges = completedChallenges.filter(c => c.frequency === "weekly");
  const completedMonthlyChallenges = completedChallenges.filter(c => c.frequency === "monthly");
  
  const handleAddChallenge = (challenge: Omit<Challenge, "id">) => {
    addChallenge(challenge);
    setShowAddDialog(false);
    toast.success("Challenge added successfully!");
  };
  
  const handleUpdateChallenge = (challenge: Omit<Challenge, "id">) => {
    if (editingChallenge) {
      updateChallenge({
        ...challenge,
        id: editingChallenge.id
      });
      setEditingChallenge(null);
      toast.success("Challenge updated successfully!");
    }
  };
  
  const handleDeleteChallenge = (challengeId: string) => {
    deleteChallenge(challengeId);
    toast.success("Challenge deleted successfully!");
  };
  
  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
    toast.success("Challenge completed! Rewards added to your character.");
  };
  
  const handleClaimDailyBonus = () => {
    if (claimDailyBonus) {
      claimDailyBonus();
      toast.success("Daily bonus claimed!");
    }
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Challenges</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              New Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Challenge</DialogTitle>
            </DialogHeader>
            <ChallengeForm 
              onSubmit={handleAddChallenge} 
              onCancel={() => setShowAddDialog(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingChallenge} 
          onOpenChange={(open) => !open && setEditingChallenge(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Challenge</DialogTitle>
            </DialogHeader>
            {editingChallenge && (
              <ChallengeForm 
                initialData={editingChallenge}
                onSubmit={handleUpdateChallenge} 
                onCancel={() => setEditingChallenge(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="parchment p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Info size={20} className="text-rpg-brown" />
          <h2 className="text-lg font-pixel text-rpg-brown">Daily Login Streak</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock className="text-rpg-brown" size={18} />
              <span className="font-pixel text-rpg-brown">Day {character.loginStreak}</span>
            </div>
            <p className="text-sm text-rpg-brown">Keep logging in daily to earn increasing rewards!</p>
          </div>
          
          <Button
            disabled={character.dailyBonusClaimed}
            className={`pixel-button ${character.dailyBonusClaimed ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleClaimDailyBonus}
          >
            {character.dailyBonusClaimed ? "Already Claimed" : "Claim Daily Bonus"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
          <TabsTrigger 
            value="active" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Active Challenges
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="animate-fade-in">
          {activeChallenges.length === 0 ? (
            <div className="text-center py-12 parchment">
              <Trophy size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Active Challenges</h3>
              <p className="text-rpg-brown mb-4">Start a new challenge to track your progress!</p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="pixel-button"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Your First Challenge
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {dailyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="text-rpg-blue" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Daily Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dailyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {weeklyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-rpg-purple" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Weekly Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeklyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {monthlyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarClock className="text-rpg-red" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Monthly Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthlyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="animate-fade-in">
          {completedChallenges.length === 0 ? (
            <div className="text-center py-12 parchment">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Completed Challenges</h3>
              <p className="text-rpg-brown">Complete challenges to see them here!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {completedDailyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="text-rpg-blue" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Daily Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedDailyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {completedWeeklyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="text-rpg-purple" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Weekly Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedWeeklyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {completedMonthlyChallenges.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarClock className="text-rpg-red" size={20} />
                    <h2 className="text-xl font-pixel text-rpg-brown">Monthly Challenges</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedMonthlyChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onComplete={handleCompleteChallenge}
                        onEdit={setEditingChallenge}
                        onDelete={handleDeleteChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
