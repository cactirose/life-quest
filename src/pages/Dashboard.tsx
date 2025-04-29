import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/contexts/DataContext";
import { Award, BadgeCheck, Clock, Plus, Sparkle, Info, CalendarClock } from "lucide-react";
import { format } from "date-fns";

// Category icon mapping
const categoryIcons: Record<string, JSX.Element> = {
  quests: <Clock size={14} />,
  habits: <Clock size={14} />,
  skills: <Clock size={14} />,
  character: <Clock size={14} />,
  general: <Clock size={14} />
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { character, quests, inventory, skills, achievements, claimDailyBonus } = useGameData();
  
  // Make sure we have valid data or use defaults
  const safeCharacter = character || { stats: {}, level: 1, xp: 0, nextLevelXp: 100, coins: 0, loginStreak: 0, dailyBonusClaimed: false };
  const safeQuests = Array.isArray(quests) ? quests : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
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
  const unlockedSkills = Array.isArray(skills) ? skills.filter(skill => (skill.xp ?? 0) > 0).length : 0;
  const totalSkills = Array.isArray(skills) ? skills.length : 0;

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
                        {categoryIcons[achievement.category] || <Clock size={14} />}
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
          <div className="parchment p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={20} className="text-rpg-brown" />
              <h2 className="text-lg font-pixel text-rpg-brown">Daily Login Streak</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="text-rpg-brown" size={18} />
                  <span className="font-pixel text-rpg-brown">Day {safeCharacter.loginStreak || 0}</span>
                </div>
                <p className="text-sm text-rpg-brown">Keep logging in daily to earn increasing rewards!</p>
              </div>
              
              <Button
                disabled={safeCharacter.dailyBonusClaimed}
                className={`pixel-button ${safeCharacter.dailyBonusClaimed ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (claimDailyBonus) {
                    claimDailyBonus();
                  }
                }}
              >
                {safeCharacter.dailyBonusClaimed ? "Already Claimed" : "Claim Daily Bonus"}
              </Button>
            </div>
          </div>

          <div className="parchment">
            <h2 className="text-2xl font-pixel text-rpg-brown mb-4">Character Stats</h2>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Sparkle className="text-rpg-brown" size={20} />
                <span className="font-pixel text-rpg-brown">Level {safeCharacter.level}</span>
              </div>
              
              <div>
                <span className="text-sm text-rpg-brown">XP Progress</span>
                <div className="pixel-progress-bar mt-1">
                  <div 
                    className="pixel-progress-bar-fill"
                    style={{ width: `${(safeCharacter.xp / safeCharacter.nextLevelXp) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{safeCharacter.xp} XP</span>
                  <span>{safeCharacter.nextLevelXp} XP</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="font-pixel text-rpg-brown">{safeCharacter.coins} Coins</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {safeCharacter.stats && Object.entries(safeCharacter.stats).map(([stat, value]) => (
                <div key={stat} className="wood-texture p-2">
                  <div className="text-sm capitalize text-rpg-brown">{stat}</div>
                  <div className="font-pixel text-lg text-rpg-brown">{value}</div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => navigate("/character")} 
              className="w-full mt-4 pixel-button"
            >
              View Character
            </Button>
          </div>
          
          <div className="parchment">
            <h2 className="text-2xl font-pixel text-rpg-brown mb-4">Progress Summary</h2>
            
            <div className="space-y-4">
              <div className="wood-texture p-3">
                <div className="text-sm text-rpg-brown mb-1">Quests</div>
                <div className="flex justify-between">
                  <span className="font-pixel text-rpg-brown">{completedQuests.length} Completed</span>
                  <span className="font-pixel text-rpg-brown">{activeQuests.length} Active</span>
                </div>
              </div>
              
              <div className="wood-texture p-3">
                <div className="text-sm text-rpg-brown mb-1">Equipment</div>
                <div className="flex justify-between">
                  <span className="font-pixel text-rpg-brown">{equippedItems.length} Equipped</span>
                  <span className="font-pixel text-rpg-brown">{safeInventory.length} Total</span>
                </div>
              </div>
              
              <div className="wood-texture p-3">
                <div className="text-sm text-rpg-brown mb-1">Skills</div>
                <div className="flex justify-between">
                  <span className="font-pixel text-rpg-brown">{unlockedSkills} Unlocked</span>
                  <span className="font-pixel text-rpg-brown">{totalSkills} Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
