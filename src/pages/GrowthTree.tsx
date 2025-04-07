
import { useState } from "react";
import { useGrowthSystem, SkillProgress } from "@/hooks/useGrowthSystem";
import { SkillName, SKILL_DEFINITIONS } from "@/types/skills";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { GitBranch, TrendingUp } from "lucide-react";
import { Icon } from "@mui/material";

const SkillCard = ({ skillName }: { skillName: SkillName }) => {
  const { getSkillProgress } = useGrowthSystem();
  const skillInfo = getSkillProgress(skillName);
  const definition = SKILL_DEFINITIONS[skillName];

  if (!skillInfo || !definition) return null;

  return (
    <Card className="p-4 bg-rpg-tan hover:bg-rpg-tan/90 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-rpg-brown flex items-center justify-center">
            <Icon>{definition.icon}</Icon>
          </div>
          <div>
            <h3 className="font-pixel text-lg capitalize">{definition.name}</h3>
            <p className="text-xs text-rpg-brown">Level {skillInfo.level}</p>
          </div>
        </div>
        <div className="px-2 py-1 bg-rpg-brown text-white text-xs rounded">
          +{Math.floor(skillInfo.level / 2)} {definition.primaryStat.toUpperCase()}
        </div>
      </div>

      <p className="text-sm text-rpg-brown mb-2">{definition.description}</p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>XP: {skillInfo.xp}</span>
          <span>{skillInfo.nextLevelXP}</span>
        </div>
        <Progress value={skillInfo.progress * 100} className="h-2" />
      </div>
    </Card>
  );
};

const GrowthTree = () => {
  const { isLoading, error } = useGrowthSystem();
  const [filter, setFilter] = useState<'all' | 'attributes' | 'skills'>('all');

  const skillGroups = {
    attributes: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
    skills: ['crafting', 'cooking', 'gardening', 'fitness', 'meditation', 'learning']
  };

  const filteredSkills = filter === 'all' 
    ? [...skillGroups.attributes, ...skillGroups.skills]
    : skillGroups[filter === 'attributes' ? 'attributes' : 'skills'];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="h-96 flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="parchment text-center py-8">
          <h2 className="text-xl font-pixel text-rpg-brown mb-2">Error Loading Skills</h2>
          <p className="text-rpg-brown">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={24} className="text-rpg-brown" />
          <h1 className="text-3xl font-pixel text-rpg-brown">Growth Tree</h1>
        </div>
        
        <div className="parchment p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-rpg-green" />
            <h2 className="font-pixel text-rpg-brown">The Skill Tree has evolved!</h2>
          </div>
          <p className="text-sm text-rpg-brown">
            Track your growth through skills and stats below. Each skill level contributes to your character's attributes,
            making you stronger as you progress.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('attributes')}
            className={`px-4 py-2 rounded ${
              filter === 'attributes' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            Attributes
          </button>
          <button
            onClick={() => setFilter('skills')}
            className={`px-4 py-2 rounded ${
              filter === 'skills' ? 'bg-rpg-brown text-white' : 'bg-rpg-tan'
            }`}
          >
            Skills
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skillName) => (
          <SkillCard key={skillName} skillName={skillName as SkillName} />
        ))}
      </div>
    </div>
  );
};

export default GrowthTree;
