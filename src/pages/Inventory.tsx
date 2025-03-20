
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
import { useGameData, GearItem, GearType } from "@/contexts/DataContext";
import { toast } from "sonner";
import { 
  Package, 
  Shield, 
  Sword, 
  Gem, 
  CheckCircle, 
  Filter, 
  Search, 
  ShoppingBag,
  X,
  Gift
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Item card component for inventory
const InventoryItemCard = ({ 
  item, 
  onEquip, 
  onUnequip 
}: { 
  item: GearItem; 
  onEquip: () => void; 
  onUnequip: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determine border class based on rarity
  const rarityBorderClass = 
    item.rarity === "common" ? "rarity-common" :
    item.rarity === "rare" ? "rarity-rare" :
    item.rarity === "epic" ? "rarity-epic" :
    "rarity-legendary";
    
  // Item icon based on type
  const itemIcon = 
    item.type === "weapon" ? <Sword className="text-rpg-brown" size={16} /> :
    item.type === "armor" ? <Shield className="text-rpg-brown" size={16} /> :
    item.type === "real-life" ? <Gift className="text-rpg-brown" size={16} /> :
    <Gem className="text-rpg-brown" size={16} />;

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
          onClick={(e) => {
            e.stopPropagation();
            item.equipped ? onUnequip() : onEquip();
          }}
          className="w-full pixel-button"
        >
          {item.equipped ? 'Unequip' : 'Equip'}
        </Button>
      </div>
      
      {/* Item Details Dialog */}
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
              className="w-full pixel-button"
            >
              {item.equipped ? 'Unequip' : 'Equip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Equipment slots component
const EquipmentSlots = ({ 
  equippedItems, 
  onUnequip 
}: { 
  equippedItems: Partial<Record<GearType, GearItem | null>>;
  onUnequip: (itemId: string) => void;
}) => {
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

const Inventory = () => {
  const { inventory, equipItem, unequipItem } = useGameData();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<GearType | "all">("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  
  // Group equipped items by type
  const equippedItemsByType = inventory
    .filter(item => item.equipped)
    .reduce((acc, item) => {
      acc[item.type] = item;
      return acc;
    }, {} as Partial<Record<GearType, GearItem | null>>);
    
  // Initialize empty slots
  const equipmentSlots: Partial<Record<GearType, GearItem | null>> = {
    weapon: equippedItemsByType.weapon || null,
    armor: equippedItemsByType.armor || null,
    accessory: equippedItemsByType.accessory || null,
    // "real-life" items aren't equippable, so we don't include them in slots
  };
  
  // Filter items based on search and filters
  const filteredItems = inventory.filter(item => {
    // First, check against search text
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    
    // Then, check against type filter
    const matchesType = filterType === "all" || item.type === filterType;
    
    // Finally, check against tab filter
    const matchesTab = 
      (currentTab === "all") || 
      (currentTab === "equipped" && item.equipped) ||
      (currentTab === "weapons" && item.type === "weapon") ||
      (currentTab === "armor" && item.type === "armor") ||
      (currentTab === "accessories" && item.type === "accessory") ||
      (currentTab === "real-life" && item.type === "real-life");
    
    return matchesSearch && matchesType && matchesTab;
  });
  
  // Handle equipping an item
  const handleEquip = (itemId: string) => {
    equipItem(itemId);
    toast.success("Item equipped!");
  };
  
  // Handle unequipping an item
  const handleUnequip = (itemId: string) => {
    unequipItem(itemId);
    toast.success("Item unequipped");
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package size={24} className="text-rpg-brown" />
          <h1 className="text-3xl font-pixel text-rpg-brown">Inventory</h1>
        </div>
        
        <div className="parchment px-4 py-2">
          <span className="font-pixel text-rpg-brown">{inventory.length} Items</span>
        </div>
      </div>
      
      <div className="parchment mb-8">
        <h2 className="text-2xl font-pixel text-rpg-brown mb-4">Equipment</h2>
        <EquipmentSlots 
          equippedItems={equipmentSlots} 
          onUnequip={handleUnequip} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rpg-brown" size={16} />
            <Input
              placeholder="Search inventory..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 wood-texture"
            />
          </div>
        </div>
        
        <div>
          <Select value={filterType} onValueChange={(value) => setFilterType(value as GearType | "all")}>
            <SelectTrigger className="wood-texture">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weapon">Weapons</SelectItem>
              <SelectItem value="armor">Armor</SelectItem>
              <SelectItem value="accessory">Accessories</SelectItem>
              <SelectItem value="real-life">Real Life Rewards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
          <TabsTrigger 
            value="all" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            All Items
          </TabsTrigger>
          <TabsTrigger 
            value="equipped" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Equipped
          </TabsTrigger>
          <TabsTrigger 
            value="weapons" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Weapons
          </TabsTrigger>
          <TabsTrigger 
            value="armor" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Armor
          </TabsTrigger>
          <TabsTrigger 
            value="accessories" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Accessories
          </TabsTrigger>
          <TabsTrigger 
            value="real-life" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Real Life
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="animate-fade-in">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 parchment">
              <ShoppingBag size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Items Found</h3>
              <p className="text-rpg-brown mb-4">
                {inventory.length === 0 
                  ? "Your inventory is empty. Visit the shop to purchase items!" 
                  : "Try adjusting your filters or search terms."}
              </p>
              
              {inventory.length === 0 && (
                <Button 
                  onClick={() => window.location.href = "/shop"}
                  className="pixel-button"
                >
                  Visit Shop
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onEquip={() => handleEquip(item.id)}
                  onUnequip={() => handleUnequip(item.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
