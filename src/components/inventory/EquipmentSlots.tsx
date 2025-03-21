
import { GearItem, GearType } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Gem, X } from "lucide-react";

interface EquipmentSlotsProps {
  equippedItems: Partial<Record<GearType, GearItem | null>>;
  onUnequip: (itemId: string) => void;
}

const EquipmentSlots = ({ 
  equippedItems, 
  onUnequip 
}: EquipmentSlotsProps) => {
  const slots = [
    { type: "weapon" as GearType, icon: <Sword size={24} />, label: "Weapon" },
    { type: "armor" as GearType, icon: <Shield size={24} />, label: "Armor" },
    { type: "accessory" as GearType, icon: <Gem size={24} />, label: "Accessory" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {slots.map(slot => {
        const item = equippedItems[slot.type];
        
        return (
          <div 
            key={slot.type} 
            className={`wood-texture p-4 flex flex-col items-center ${
              item ? 'border-rpg-brown' : 'border-dashed'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-rpg-brown">{slot.icon}</span>
              <h3 className="font-pixel text-rpg-brown">{slot.label}</h3>
            </div>
            
            {item ? (
              <div className="w-full text-center">
                <div className="flex justify-center mb-2">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h4 className="font-pixel text-rpg-brown mb-1">{item.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2
                  ${item.rarity === 'common' ? 'bg-gray-500 text-white' : 
                    item.rarity === 'rare' ? 'bg-blue-500 text-white' : 
                    item.rarity === 'epic' ? 'bg-purple-500 text-white' : 
                    'bg-yellow-500 text-white'
                  }`}
                >
                  {item.rarity}
                </span>
                
                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {Object.entries(item.statBonuses).map(([stat, value]) => (
                    value > 0 && (
                      <span key={stat} className="text-xs px-1.5 py-0.5 bg-rpg-brown text-white rounded">
                        +{value} {stat}
                      </span>
                    )
                  ))}
                </div>
                
                <Button 
                  onClick={() => onUnequip(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-rpg-brown text-rpg-brown hover:bg-rpg-brown hover:text-white"
                >
                  <X size={14} className="mr-1" /> Unequip
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-rpg-brown/60">
                <div className="w-12 h-12 border-2 border-dashed border-rpg-brown/40 rounded-md flex items-center justify-center mb-2">
                  {slot.icon}
                </div>
                <p className="text-sm">No item equipped</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentSlots;
