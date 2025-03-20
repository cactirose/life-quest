
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameData, GearItem, GearRarity, GearType } from "@/contexts/DataContext";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Coins, 
  Sparkle, 
  Shield, 
  Sword, 
  Gem,
  Filter,
  Search,
  ShoppingCart,
  PlusCircle,
  Gift,
  Settings
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShopItemEditor } from "@/components/ShopItemEditor";

// Item card component
const ItemCard = ({
  item,
  onPurchase,
  canAfford,
  meetsLevelRequirement,
  onEdit
}: {
  item: GearItem;
  onPurchase: () => void;
  canAfford: boolean;
  meetsLevelRequirement: boolean;
  onEdit?: () => void;
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
        className={`item-card ${rarityBorderClass}`}
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
          
          <div className="flex items-center gap-1">
            <Coins size={14} className="text-rpg-brown" />
            <span className="font-pixel text-rpg-brown">{item.cost}</span>
          </div>
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
        
        {onEdit && (
          <div className="mb-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full"
              variant="outline"
            >
              Edit Item
            </Button>
          </div>
        )}
        
        {!meetsLevelRequirement ? (
          <div className="text-xs text-center text-red-500 font-pixel">
            Requires Level {item.levelRequired}
          </div>
        ) : (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onPurchase();
            }}
            className={`w-full pixel-button ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!canAfford}
          >
            {canAfford ? 'Purchase' : 'Not Enough Coins'}
          </Button>
        )}
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
            
            <div className="flex justify-between items-center px-3 py-2 bg-rpg-tan/50 rounded">
              <span className="text-sm text-rpg-brown">Price</span>
              <div className="flex items-center gap-1">
                <Coins size={16} className="text-rpg-brown" />
                <span className="font-pixel text-rpg-brown">{item.cost}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-3 py-2 bg-rpg-tan/50 rounded">
              <span className="text-sm text-rpg-brown">Required Level</span>
              <span className="font-pixel text-rpg-brown">{item.levelRequired}</span>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            {onEdit && (
              <Button onClick={(e) => {
                e.stopPropagation();
                setShowDetails(false);
                onEdit();
              }} variant="outline" className="mr-auto">
                Edit Item
              </Button>
            )}
          
            {!meetsLevelRequirement ? (
              <div className="w-full text-center text-red-500 font-pixel">
                Requires Level {item.levelRequired}
              </div>
            ) : (
              <Button 
                onClick={onPurchase}
                className={`w-full pixel-button ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canAfford}
              >
                {canAfford ? 'Purchase' : 'Not Enough Coins'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Shop = () => {
  const { shopItems, character, purchaseItem, setGameData } = useGameData();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<GearType | "all">("all");
  const [filterRarity, setFilterRarity] = useState<GearRarity | "all">("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | undefined>(undefined);
  
  // Filter items based on search and filters
  const filteredItems = shopItems.filter(item => {
    // First, check against search text
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    
    // Then, check against type filter
    const matchesType = filterType === "all" || item.type === filterType;
    
    // Then, check against rarity filter
    const matchesRarity = filterRarity === "all" || item.rarity === filterRarity;
    
    // Finally, check against tab filter
    const matchesTab = 
      currentTab === "all" || 
      (currentTab === "available" && character.level >= item.levelRequired) ||
      (currentTab === "weapons" && item.type === "weapon") ||
      (currentTab === "armor" && item.type === "armor") ||
      (currentTab === "accessories" && item.type === "accessory") ||
      (currentTab === "real-life" && item.type === "real-life");
    
    return matchesSearch && matchesType && matchesRarity && matchesTab;
  });
  
  // Handle purchase
  const handlePurchase = (itemId: string) => {
    const success = purchaseItem(itemId);
    
    if (success) {
      toast.success("Item purchased successfully!");
    } else {
      const item = shopItems.find(i => i.id === itemId);
      
      if (!item) {
        toast.error("Item not found");
      } else if (character.coins < item.cost) {
        toast.error("Not enough coins to purchase this item");
      } else if (character.level < item.levelRequired) {
        toast.error(`You need to be level ${item.levelRequired} to purchase this item`);
      } else {
        toast.error("Failed to purchase item");
      }
    }
  };
  
  // Save a new or edited item
  const handleSaveItem = (item: GearItem) => {
    setGameData(prevData => {
      // Check if it's an edit (item already exists)
      const existingItemIndex = prevData.shopItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevData.shopItems];
        updatedItems[existingItemIndex] = item;
        return { ...prevData, shopItems: updatedItems };
      } else {
        // Add new item
        return { ...prevData, shopItems: [...prevData.shopItems, item] };
      }
    });
    
    setEditingItem(undefined);
  };
  
  // Delete an item
  const handleDeleteItem = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      shopItems: prevData.shopItems.filter(item => item.id !== itemId)
    }));
    
    setEditingItem(undefined);
  };
  
  // Check if player can afford an item
  const canAfford = (item: GearItem) => character.coins >= item.cost;
  
  // Check if player meets level requirement
  const meetsLevelRequirement = (item: GearItem) => character.level >= item.levelRequired;
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag size={24} className="text-rpg-brown" />
          <h1 className="text-3xl font-pixel text-rpg-brown">Shop</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAdmin(!isAdmin)}
            className={isAdmin ? "bg-rpg-brown text-rpg-tan" : ""}
            title={isAdmin ? "Exit Admin Mode" : "Admin Mode"}
          >
            <Settings size={20} />
          </Button>
          
          <div className="parchment flex items-center px-4 py-2">
            <Coins size={20} className="text-rpg-brown mr-2" />
            <span className="font-pixel text-lg text-rpg-brown">{character.coins}</span>
          </div>
          <div className="parchment flex items-center px-4 py-2">
            <Sparkle size={20} className="text-rpg-brown mr-2" />
            <span className="font-pixel text-lg text-rpg-brown">Level {character.level}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rpg-brown" size={16} />
            <Input
              placeholder="Search for items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 wood-texture"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1">
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
          
          <div className="flex-1">
            <Select value={filterRarity} onValueChange={(value) => setFilterRarity(value as GearRarity | "all")}>
              <SelectTrigger className="wood-texture">
                <div className="flex items-center">
                  <Gem size={16} className="mr-2" />
                  <SelectValue placeholder="Rarity" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isAdmin && (
        <div className="mb-6 parchment">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pixel text-rpg-brown">Shop Administration</h2>
            <ShopItemEditor 
              onSave={handleSaveItem}
              trigger={
                <Button className="pixel-button">
                  <PlusCircle size={16} className="mr-2" />
                  Add New Item
                </Button>
              }
            />
          </div>
          <p className="text-sm text-rpg-brown mb-2">You can add, edit, or remove shop items in admin mode.</p>
        </div>
      )}
      
      {/* Shop Item Editor Dialog for editing */}
      {editingItem && (
        <ShopItemEditor
          item={editingItem}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          trigger={<div style={{ display: 'none' }}></div>}
        />
      )}
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
          <TabsTrigger 
            value="all" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            All Items
          </TabsTrigger>
          <TabsTrigger 
            value="available" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Available Now
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
              <ShoppingCart size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Items Found</h3>
              <p className="text-rpg-brown">Try adjusting your filters or search terms.</p>
              {isAdmin && (
                <Button 
                  onClick={() => setEditingItem(undefined)}
                  className="pixel-button mt-4"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onPurchase={() => handlePurchase(item.id)}
                  canAfford={canAfford(item)}
                  meetsLevelRequirement={meetsLevelRequirement(item)}
                  onEdit={isAdmin ? () => setEditingItem(item) : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Shop;
