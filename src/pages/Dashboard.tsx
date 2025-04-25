import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/contexts/DataContext";
import { Award, BadgeCheck, CircleCheck, Clock, Plus, Sparkle, Target, BookOpen, ListChecks, UserCircle, LayoutGrid, Sword, Info, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { DailyLoginCard } from "@/components/dashboard/DailyLoginCard";
import { DEFAULT_CHARACTER } from "@/types/character";

// Category icon mapping
const categoryIcons: Record<string, JSX.Element> = {
  quests: <Sword size={14} />,
  habits: <ListChecks size={14} />,
  skills: <BookOpen size={14} />,
  character: <UserCircle size={14} />,
  general: <LayoutGrid size={14} />
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { gameData } = useGameData();
  
  // Extract data safely with defaults
  const { character: rawCharacter, quests, inventory, skillTree, achievements } = gameData;
  
  // Make sure we always have a valid character object with all required fields
  const character = { ...DEFAULT_CHARACTER, ...rawCharacter };
  
  // Make sure we have valid data or use defaults
  const safeQuests = Array.isArray(quests) ? quests : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeSkillTree = Array.isArray(skillTree) ? skillTree : [];
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  
  // Filter active quests and completed achievements
  const activeQuests = safeQuests.filter(quest => quest.status === "active");
  const completedQuests = safeQuests.filter(quest => quest.status === "completed");
  const unlockedAchievements = safeAchievements.filter(achievement => achievement.unlocked)
    .sort((a, b) => {
      // Sort by dateUnlocked if available, newest first
      if (a.dateUnlocked && b.dateUnlocked) {
        return new Date(b.dateUnlocked).getTime() - new Date(a.dateUnlocked).getTime();
      }
      return 0;
    });
  const lockedAchievements = safeAchievements.filter(achievement => !achievement.unlocked);
  
  // Get equipped items
  const equippedItems = safeInventory.filter(item => item.equipped);
  
  // Count unlocked skills
  const unlockedSkills = safeSkillTree.filter(node => node.unlocked).length;
  const totalSkills = safeSkillTree.length;

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="parchment">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pixel text-rpg-brown">Active Quests</h2>
              <Button 
                onClick={() => navigate("/quests")} 
                className="pixel-button flex items-center gap-1"
              >
                <Plus size={16} />
                <span>New Quest</span>
              </Button>
            </div>
            
            {activeQuests.length === 0 ? (
              <div className="text-center py-8 text-rpg-brown">
                <Clock size={32} className="mx-auto mb-2" />
                <p>No active quests. Start a new adventure!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeQuests.slice(0, 3).map(quest => {
                  // Calculate progress
                  const totalSteps = quest.steps ? quest.steps.length : 0;
                  const completedSteps = quest.steps ? quest.steps.filter(step => step.completed).length : 0;
                  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                  
                  return (
                    <div key={quest.id} className="quest-card" onClick={() => navigate("/quests")}>
                      <div className="flex justify-between mb-2">
                        <h3 className="font-pixel text-lg text-rpg-brown">{quest.title}</h3>
                        <span className="text-xs px-2 py-1 bg-rpg-brown text-rpg-tan rounded-full">
                          {typeof quest.type === 'string' ? (quest.type === "main" ? "Main" : "Side") : "Side"}
                        </span>
                      </div>
                      
                      <div className="mb-2 text-sm text-rpg-brown line-clamp-2">
                        {quest.description}
                      </div>
                      
                      <div className="pixel-progress-bar">
                        <div 
                          className="pixel-progress-bar-fill"
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm mt-2 text-rpg-brown">
                        <span>{completedSteps}/{totalSteps} steps</span>
                        <div className="flex items-center gap-2">
                          <span>+{quest.xpReward || 0} XP</span>
                          <span>+{quest.coinReward || 0} 🪙</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {activeQuests.length > 3 && (
                  <Button 
                    onClick={() => navigate("/quests")} 
                    className="w-full pixel-button"
                  >
                    View All Quests
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="parchment">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pixel text-rpg-brown">Recent Achievements</h2>
              <Button 
                onClick={() => navigate("/achievements")} 
                className="pixel-button flex items-center gap-1"
              >
                <Award size={16} />
                <span>View All</span>
              </Button>
            </div>
            
            {unlockedAchievements.length === 0 ? (
              <div className="text-center py-8 text-rpg-brown">
                <Award size={32} className="mx-auto mb-2" />
                {lockedAchievements.length > 0 ? (
                  <>
                    <p className="mb-4">You have {lockedAchievements.length} achievements to unlock!</p>
                    <Button 
                      onClick={() => navigate("/achievements")} 
                      className="pixel-button"
                    >
                      <Award size={16} className="mr-2" />
                      View Achievements
                    </Button>
                  </>
                ) : (
                  <p>No achievements unlocked yet. Complete quests, habits, and other tasks to earn achievements!</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 wood-texture">
                    <BadgeCheck className="text-rpg-green flex-shrink-0" size={24} />
                    <div className="flex-grow">
                      <h4 className="font-pixel text-rpg-brown">{achievement.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-rpg-brown mb-1">
                        {categoryIcons[achievement.category] || <LayoutGrid size={14} />}
                        <span className="capitalize">{achievement.category || 'general'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          {(achievement.xpReward && achievement.xpReward > 0) && <span>+{achievement.xpReward} XP</span>}
                          {(achievement.coinReward && achievement.coinReward > 0) && <span>+{achievement.coinReward} 🪙</span>}
                        </div>
                        {achievement.dateUnlocked && (
                          <span className="text-xs text-rpg-brown/70">
                            {(() => {
                              try {
                                return format(new Date(achievement.dateUnlocked), 'MMM d, yyyy');
                              } catch (e) {
                                return 'Recently';
                              }
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {unlockedAchievements.length > 3 && (
                  <Button 
                    onClick={() => navigate("/achievements")} 
                    className="w-full pixel-button"
                  >
                    View All Achievements
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Character Card */}
          <div className="parchment">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-rpg-brown" />
                <h2 className="text-xl font-pixel text-rpg-brown">Character</h2>
              </div>
              <Button 
                onClick={() => navigate("/character")} 
                variant="ghost"
                className="text-rpg-brown hover:text-rpg-green hover:bg-transparent"
              >
                View
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Character Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rpg-tan border-2 border-rpg-brown overflow-hidden">
                  {character.portrait ? (
                    <img 
                      src={character.portrait} 
                      alt={character.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-full h-full text-rpg-brown" />
                  )}
                </div>
                <div>
                  <h3 className="font-pixel text-lg text-rpg-brown">{character.name}</h3>
                  <div className="flex items-center gap-1">
                    <Sparkle size={16} className="text-rpg-green" />
                    <span className="text-sm text-rpg-brown">Level {character.level}</span>
                  </div>
                </div>
              </div>
              
              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-sm text-rpg-brown mb-1">
                  <span>XP: {character.xp}</span>
                  <span>{character.nextLevelXp}</span>
                </div>
                <div className="w-full h-2 bg-rpg-brown/30 rounded overflow-hidden">
                  <div 
                    className="h-full bg-rpg-green" 
                    style={{ width: `${(character.xp / character.nextLevelXp) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Coins */}
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="12" r="7" fill="yellow" stroke="currentColor" strokeWidth="1" />
                  <text x="12" y="14" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">$</text>
                </svg>
                <span className="font-pixel text-rpg-brown">{character.coins} coins</span>
              </div>
            </div>
          </div>
          
          {/* Daily Login Card */}
          <DailyLoginCard />
          
          {/* Achievements Card */}
          <div className="parchment">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-rpg-brown" />
                <h2 className="text-xl font-pixel text-rpg-brown">Achievements</h2>
              </div>
              <Button 
                onClick={() => navigate("/achievements")} 
                variant="ghost"
                className="text-rpg-brown hover:text-rpg-green hover:bg-transparent"
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-rpg-brown">Completed</p>
                  <p className="font-pixel text-rpg-brown">{unlockedAchievements.length} / {safeAchievements.length}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-rpg-tan border-2 border-rpg-brown flex items-center justify-center">
                  <span className="font-pixel text-xl text-rpg-brown">
                    {Math.round((unlockedAchievements.length / Math.max(1, safeAchievements.length)) * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Recent Achievements */}
              {unlockedAchievements.length > 0 ? (
                <div>
                  <h3 className="font-pixel text-sm text-rpg-brown mb-2">Recently Unlocked</h3>
                  <div className="space-y-2">
                    {unlockedAchievements.slice(0, 2).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-rpg-green" />
                        <div>
                          <p className="text-sm font-medium text-rpg-brown">{achievement.title}</p>
                          <div className="flex items-center gap-1 text-xs text-rpg-brown/70">
                            {achievement.category && categoryIcons[achievement.category]}
                            <span>{achievement.category}</span>
                            {achievement.dateUnlocked && (
                              <span>• {format(new Date(achievement.dateUnlocked), 'MMM d')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-rpg-brown">
                  <Info size={24} className="mx-auto mb-1" />
                  <p className="text-sm">No achievements unlocked yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
