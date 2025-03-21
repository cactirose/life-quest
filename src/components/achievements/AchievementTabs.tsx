
import { Achievement } from "@/types/achievements";
import { BadgePercent, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementCard from "./AchievementCard";

interface AchievementTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: Record<string, number>;
  achievements: Achievement[];
  lockedAchievements: Achievement[];
  unlockedAchievements: Achievement[];
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onUnlock: (id: string) => void;
  onAddNew: () => void;
}

const AchievementTabs = ({
  activeTab,
  setActiveTab,
  categories,
  achievements,
  lockedAchievements,
  unlockedAchievements,
  onEdit,
  onDelete,
  onUnlock,
  onAddNew
}: AchievementTabsProps) => {
  const filterAchievementsByCategory = (category: string) => {
    if (category === "all") return achievements;
    return achievements.filter(a => a.category === category);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
      <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown h-auto">
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          All ({categories.all})
        </TabsTrigger>
        <TabsTrigger 
          value="quests" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Quests ({categories.quests})
        </TabsTrigger>
        <TabsTrigger 
          value="habits" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Habits ({categories.habits})
        </TabsTrigger>
        <TabsTrigger 
          value="skills" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Skills ({categories.skills})
        </TabsTrigger>
        <TabsTrigger 
          value="character" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Character ({categories.character})
        </TabsTrigger>
        <TabsTrigger 
          value="general" 
          className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
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
                onClick={onAddNew}
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
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onUnlock={onUnlock}
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
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onUnlock={onUnlock}
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
  );
};

export default AchievementTabs;
