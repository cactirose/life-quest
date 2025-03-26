
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { GearItem } from "@/contexts/DataContext";
import { Sword, Shield, Gem, X, Gift } from "lucide-react";

interface InventoryItemCardProps {
  item: GearItem;
  onEquip: () => void;
  onUnequip: () => void;
}

const InventoryItemCard = ({ 
  item, 
  onEquip, 
  onUnequip 
}: InventoryItemCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const rarityBorderClass = 
    item.rarity === "common" ? "rarity-common" :
    item.rarity === "rare" ? "rarity-rare" :
    item.rarity === "epic" ? "rarity-epic" :
    "rarity-legendary";
    
  const itemIcon = 
    item.type === "weapon" ? <Sword className="text-rpg-brown" size={16} /> :
    item.type === "armor" ? <Shield className="text-rpg-brown" size={16} /> :
    item.type === "real-life" ? <Gift className="text-rpg-brown" size={16} /> :
    <Gem className="text-rpg-brown" size={16} />;

  const handleEquipAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    item.equipped ? onUnequip() : onEquip();
  };

  return (
    <>
      <div 
        className={`item-card ${rarityBorderClass} ${item.equipped ? 'ring-2 ring-rpg-green' : ''}`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {itemIcon}
            <h3 className="font-pixel text-rpg-brown">{item.name}</h3>
          </div>
          <span className="text-2xl">{item.icon}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full
            ${item.rarity === 'common' ? 'bg-gray-500 text-white' : 
              item.rarity === 'rare' ? 'bg-blue-500 text-white' : 
              item.rarity === 'epic' ? 'bg-purple-500 text-white' : 
              'bg-yellow-500 text-white'
            }`}
          >
            {item.rarity}
          </span>
          
          {item.equipped && (
            <span className="text-xs px-2 py-0.5 bg-rpg-green text-white rounded-full">
              Equipped
            </span>
          )}
        </div>
        
        <div className="text-xs text-rpg-brown mb-2 line-clamp-2">
          {item.description}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-auto mb-2">
          {Object.entries(item.statBonuses).map(([stat, value]) => (
            value > 0 && (
              <span key={stat} className="text-xs px-1.5 py-0.5 bg-rpg-brown text-white rounded">
                +{value} {stat}
              </span>
            )
          ))}
        </div>
        
        <Button 
          onClick={handleEquipAction}
          className={`w-full ${item.equipped ? 'bg-rpg-tan text-rpg-brown hover:bg-rpg-tan/80' : 'pixel-button'}`}
        >
          {item.equipped ? 'Unequip' : 'Equip'}
        </Button>
      </div>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="parchment border-none">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center bg-rpg-tan border-2 border-rpg-brown rounded-md">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-pixel text-rpg-brown">{item.name}</DialogTitle>
                <DialogDescription className="text-rpg-brown">
                  {item.type} • {item.rarity}
                  {item.equipped && ' • Equipped'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-rpg-brown">{item.description}</p>
            
            <div>
              <h4 className="font-pixel text-rpg-brown mb-2">Stat Bonuses</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.statBonuses).map(([stat, value]) => (
                  value > 0 && (
                    <div key={stat} className="flex justify-between items-center px-3 py-1.5 bg-rpg-tan/50 rounded">
                      <span className="text-sm capitalize text-rpg-brown">{stat}</span>
                      <span className="font-pixel text-rpg-green">+{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              onClick={() => {
                item.equipped ? onUnequip() : onEquip();
                setShowDetails(false);
              }}
              className={`w-full ${item.equipped ? 'bg-rpg-tan text-rpg-brown hover:bg-rpg-tan/80' : 'pixel-button'}`}
            >
              {item.equipped ? 'Unequip' : 'Equip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryItemCard;
