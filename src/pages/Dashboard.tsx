
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/contexts/DataContext";
import { CircleCheck, Clock, Plus, Sparkle, Target } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { character, quests, inventory, skillTree } = useGameData();
  
  // Make sure we have valid data or use defaults
  const safeCharacter = character || { stats: {}, level: 1, xp: 0, nextLevelXp: 100, coins: 0 };
  const safeQuests = Array.isArray(quests) ? quests : [];
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeSkillTree = Array.isArray(skillTree) ? skillTree : [];
  
  // Filter active quests
  const activeQuests = safeQuests.filter(quest => quest.status === "active");
  const completedQuests = safeQuests.filter(quest => quest.status === "completed");
  
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
            <h2 className="text-2xl font-pixel text-rpg-brown mb-4">Recent Achievements</h2>
            
            {completedQuests.length === 0 ? (
              <div className="text-center py-8 text-rpg-brown">
                <Target size={32} className="mx-auto mb-2" />
                <p>Complete quests to earn achievements!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedQuests.slice(-3).reverse().map(quest => (
                  <div key={quest.id} className="flex items-center gap-3 p-3 wood-texture">
                    <CircleCheck className="text-rpg-green flex-shrink-0" size={24} />
                    <div className="flex-grow">
                      <h4 className="font-pixel text-rpg-brown">{quest.title}</h4>
                      <div className="flex gap-2 text-sm">
                        <span>+{quest.xpReward || 0} XP</span>
                        <span>+{quest.coinReward || 0} 🪙</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
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
