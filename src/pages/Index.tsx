
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGameData } from "@/contexts/DataContext";
import { ScrollText, Sparkle, Target, Flag } from "lucide-react";
import { TutorialSection } from "@/components/TutorialSection";

const Index = () => {
  const navigate = useNavigate();
  const { character } = useGameData();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="parchment mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-rpg mb-6 text-rpg-brown">Welcome to Your Quest Journal</h1>
          <p className="text-xl mb-6 text-rpg-brown">
            Transform your daily tasks into epic adventures!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="pixel-button text-lg"
            >
              Begin Your Journey
            </Button>
          </div>
        </div>

        <TutorialSection />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="wood-texture p-6 animate-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="flex items-center mb-4">
              <ScrollText className="text-rpg-brown mr-2" size={24} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Your Quests</h2>
            </div>
            <p className="mb-4">Track daily tasks, habits, and goals through engaging quests that reward you with XP, coins, and stat improvements.</p>
            <Button 
              onClick={() => navigate("/quests")} 
              className="pixel-button"
            >
              View Quests
            </Button>
          </div>

          <div className="wood-texture p-6 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="flex items-center mb-4">
              <Sparkle className="text-rpg-brown mr-2" size={24} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Character Profile</h2>
            </div>
            <p className="mb-4">Customize your character and watch your stats grow as you complete quests and equip new gear.</p>
            <Button 
              onClick={() => navigate("/character")} 
              className="pixel-button"
            >
              View Profile
            </Button>
          </div>

          <div className="wood-texture p-6 animate-fade-in" style={{animationDelay: "0.4s"}}>
            <div className="flex items-center mb-4">
              <Target className="text-rpg-brown mr-2" size={24} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Skill Tree</h2>
            </div>
            <p className="mb-4">Develop new skills and abilities through an interactive skill tree that visualizes your growth journey.</p>
            <Button 
              onClick={() => navigate("/skills")} 
              className="pixel-button"
            >
              Explore Skills
            </Button>
          </div>

          <div className="wood-texture p-6 animate-fade-in" style={{animationDelay: "0.5s"}}>
            <div className="flex items-center mb-4">
              <Flag className="text-rpg-brown mr-2" size={24} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Shop & Inventory</h2>
            </div>
            <p className="mb-4">Purchase new equipment with coins earned from quests, and manage your inventory to boost your character stats.</p>
            <Button 
              onClick={() => navigate("/shop")} 
              className="pixel-button"
            >
              Visit Shop
            </Button>
          </div>
        </div>

        <div className="wood-texture p-6 text-center">
          <h2 className="text-2xl font-pixel text-rpg-brown mb-4">
            {character.name}'s Journey
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-rpg-brown font-pixel">
            <div className="flex flex-col items-center">
              <span className="text-3xl">📊</span>
              <span>Level {character.level}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">✨</span>
              <span>{character.xp} XP</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl">🪙</span>
              <span>{character.coins} Coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
