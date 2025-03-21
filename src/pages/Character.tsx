import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGameData, StatName, GearItem } from "@/contexts/DataContext";
import { toast } from "sonner";
import { 
  ArrowUp, 
  Clock, 
  Dumbbell, 
  Brain, 
  Heart, 
  Zap, 
  BookOpen, 
  Smile, 
  Camera, 
  User,
  BarChart,
  Shield,
  Sword,
  Sparkles,
  ScrollText
} from "lucide-react";
import { CharacterResetDialog } from "@/components/CharacterResetDialog";

const StatDisplay = ({ 
  name, 
  base, 
  bonus = 0, 
  icon 
}: { 
  name: StatName; 
  base: number; 
  bonus?: number; 
  icon: React.ReactNode; 
}) => {
  const total = base + bonus;
  
  return (
    <div className="wood-texture p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="capitalize font-pixel text-rpg-brown">{name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-pixel text-lg text-rpg-brown">{total}</span>
          {bonus > 0 && (
            <span className="text-rpg-green text-xs ml-1">+{bonus}</span>
          )}
        </div>
      </div>
      
      <div className="h-2 bg-rpg-tan border border-rpg-brown rounded-full overflow-hidden">
        <div 
          className="h-full bg-rpg-brown"
          style={{ width: `${Math.min(100, total * 3)}%` }}
        />
      </div>
    </div>
  );
};

const EquippedGear = ({ 
  equippedItems 
}: { 
  equippedItems: GearItem[] 
}) => {
  const getItemByType = (type: GearItem["type"]) => {
    return equippedItems.find(item => item.type === type);
  };
  
  const weapon = getItemByType("weapon");
  const armor = getItemByType("armor");
  const accessory = getItemByType("accessory");
  
  const renderItem = (item: GearItem | undefined, icon: React.ReactNode, slot: string) => (
    <div className={`wood-texture p-3 flex items-start gap-3 animate-fade-in ${item ? 'border-rpg-brown' : 'border-dashed'}`}>
      <div className="w-10 h-10 flex items-center justify-center bg-rpg-tan border border-rpg-brown rounded-md flex-shrink-0">
        {item ? (
          <span className="text-xl">{item.icon}</span>
        ) : (
          icon
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <h4 className="font-pixel text-rpg-brown">
            {item ? item.name : `${slot} Slot`}
          </h4>
          {item && (
            <span className={`text-xs px-2 py-0.5 rounded-full
              ${item.rarity === 'common' ? 'bg-gray-500 text-white' : 
                item.rarity === 'rare' ? 'bg-blue-500 text-white' : 
                item.rarity === 'epic' ? 'bg-purple-500 text-white' : 
                'bg-yellow-500 text-white'
              }`}
            >
              {item.rarity}
            </span>
          )}
        </div>
        
        {item ? (
          <>
            <p className="text-xs text-rpg-brown mt-1 line-clamp-2">{item.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(item.statBonuses).map(([stat, value]) => (
                value > 0 && (
                  <span key={stat} className="text-xs px-1.5 py-0.5 bg-rpg-green text-white rounded">
                    +{value} {stat}
                  </span>
                )
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-rpg-brown mt-1">No item equipped</p>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-3">
      {renderItem(weapon, <Sword size={20} className="text-rpg-brown" />, "Weapon")}
      {renderItem(armor, <Shield size={20} className="text-rpg-brown" />, "Armor")}
      {renderItem(accessory, <Sparkles size={20} className="text-rpg-brown" />, "Accessory")}
    </div>
  );
};

const Character = () => {
  const { character, inventory, setCharacter } = useGameData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(character.name);
  const [editedBio, setEditedBio] = useState(character.bio);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const equippedItems = inventory.filter(item => item.equipped);
  
  const calculateStatBonuses = () => {
    const bonuses: Record<StatName, number> = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    };
    
    equippedItems.forEach(item => {
      Object.entries(item.statBonuses).forEach(([stat, value]) => {
        bonuses[stat as StatName] += value || 0;
      });
    });
    
    return bonuses;
  };
  
  const statBonuses = calculateStatBonuses();
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setCharacter({
        ...character,
        portrait: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveChanges = () => {
    if (!editedName.trim()) {
      toast.error("Character name cannot be empty");
      return;
    }
    
    setCharacter({
      ...character,
      name: editedName,
      bio: editedBio
    });
    
    setIsEditing(false);
    toast.success("Character updated successfully!");
  };
  
  const handleStatUpgrade = (stat: StatName) => {
    if (character.coins < 25) {
      toast.error("Not enough coins!");
      return;
    }
    
    setCharacter({
      ...character,
      coins: character.coins - 25,
      stats: {
        ...character.stats,
        [stat]: (character.stats[stat] || 0) + 1
      }
    });
    
    toast.success(`${stat} increased by 1!`);
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="parchment">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-pixel text-rpg-brown">Character Profile</h2>
              
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="pixel-button"
                >
                  Edit
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveChanges}
                  className="pixel-button"
                >
                  Save
                </Button>
              )}
            </div>
            
            <div 
              className="w-40 h-40 mx-auto mb-4 bg-rpg-tan border-4 border-rpg-brown rounded-md overflow-hidden cursor-pointer relative"
              onClick={handleAvatarClick}
            >
              {character.portrait ? (
                <img 
                  src={character.portrait} 
                  alt={character.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-rpg-tan">
                  <User size={48} className="text-rpg-brown" />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white" />
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Character Name
                  </label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">
                    Biography
                  </label>
                  <Textarea
                    id="bio"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-pixel text-rpg-brown mb-2">{character.name}</h1>
                <p className="text-rpg-brown mb-4">{character.bio}</p>
                
                <div className="flex flex-col items-center space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="text-rpg-brown" size={16} />
                    <span className="font-pixel text-rpg-brown">Level {character.level}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="text-rpg-brown" size={16} />
                    <span className="font-pixel text-rpg-brown">
                      {character.xp} / {character.nextLevelXp} XP
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <span className="font-pixel text-rpg-brown">{character.coins} Coins</span>
                  </div>
                </div>
                
                <div className="pixel-progress-bar">
                  <div 
                    className="pixel-progress-bar-fill"
                    style={{ width: `${(character.xp / character.nextLevelXp) * 100}%` }} 
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="parchment">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="text-rpg-brown" size={20} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Character Stats</h2>
            </div>
            
            <div className="space-y-3">
              <StatDisplay 
                name="strength" 
                base={character.stats.strength} 
                bonus={statBonuses.strength}
                icon={<Dumbbell className="text-rpg-brown" size={16} />} 
              />
              <StatDisplay 
                name="dexterity" 
                base={character.stats.dexterity} 
                bonus={statBonuses.dexterity}
                icon={<Zap className="text-rpg-brown" size={16} />} 
              />
              <StatDisplay 
                name="constitution" 
                base={character.stats.constitution} 
                bonus={statBonuses.constitution}
                icon={<Heart className="text-rpg-brown" size={16} />} 
              />
              <StatDisplay 
                name="intelligence" 
                base={character.stats.intelligence} 
                bonus={statBonuses.intelligence}
                icon={<Brain className="text-rpg-brown" size={16} />} 
              />
              <StatDisplay 
                name="wisdom" 
                base={character.stats.wisdom} 
                bonus={statBonuses.wisdom}
                icon={<BookOpen className="text-rpg-brown" size={16} />} 
              />
              <StatDisplay 
                name="charisma" 
                base={character.stats.charisma} 
                bonus={statBonuses.charisma}
                icon={<Smile className="text-rpg-brown" size={16} />} 
              />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="parchment">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-rpg-brown" size={20} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Equipped Gear</h2>
            </div>
            
            <EquippedGear equippedItems={equippedItems} />
          </div>
          
          <div className="parchment">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText className="text-rpg-brown" size={20} />
              <h2 className="text-2xl font-pixel text-rpg-brown">Character Sheet</h2>
            </div>
            
            <div className="space-y-4">
              <div className="wood-texture p-4">
                <h3 className="font-pixel text-lg text-rpg-brown mb-2">Abilities</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Strength</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.strength + statBonuses.strength}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Dexterity</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.dexterity + statBonuses.dexterity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Constitution</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.constitution + statBonuses.constitution}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Intelligence</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.intelligence + statBonuses.intelligence}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Wisdom</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.wisdom + statBonuses.wisdom}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-rpg-brown">Charisma</span>
                      <span className="font-pixel text-rpg-brown">
                        {character.stats.charisma + statBonuses.charisma}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="wood-texture p-4">
                <h3 className="font-pixel text-lg text-rpg-brown mb-2">Gear Bonuses</h3>
                {Object.entries(statBonuses).some(([_, value]) => value > 0) ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(statBonuses).map(([stat, bonus]) => (
                      bonus > 0 && (
                        <div key={stat} className="flex justify-between">
                          <span className="text-sm capitalize text-rpg-brown">{stat}</span>
                          <span className="font-pixel text-rpg-green">+{bonus}</span>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-rpg-brown">No gear bonuses active</p>
                )}
              </div>
              
              <div className="wood-texture p-4">
                <h3 className="font-pixel text-lg text-rpg-brown mb-2">Character Summary</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-rpg-brown">Level</span>
                    <span className="font-pixel text-rpg-brown">{character.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-rpg-brown">XP</span>
                    <span className="font-pixel text-rpg-brown">{character.xp} / {character.nextLevelXp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-rpg-brown">Coins</span>
                    <span className="font-pixel text-rpg-brown">{character.coins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-rpg-brown">Equipped Items</span>
                    <span className="font-pixel text-rpg-brown">{equippedItems.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <CharacterResetDialog />
      </div>
    </div>
  );
};

export default Character;
