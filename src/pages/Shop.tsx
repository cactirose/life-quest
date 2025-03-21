
import { useState } from "react";
import { useGameData, GearItem, GearRarity, GearType } from "@/contexts/DataContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopItemEditor } from "@/components/ShopItemEditor";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopFilters from "@/components/shop/ShopFilters";
import AdminPanel from "@/components/shop/AdminPanel";
import EmptyShop from "@/components/shop/EmptyShop";
import ShopItemCard from "@/components/shop/ShopItemCard";

const Shop = () => {
  const gameData = useGameData();
  const { shopItems, character, purchaseItem } = gameData;
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<GearType | "all">("all");
  const [filterRarity, setFilterRarity] = useState<GearRarity | "all">("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | undefined>(undefined);
  
  const filteredItems = shopItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    
    const matchesRarity = filterRarity === "all" || item.rarity === filterRarity;
    
    const matchesTab = 
      currentTab === "all" || 
      (currentTab === "available" && character.level >= item.levelRequired) ||
      (currentTab === "weapons" && item.type === "weapon") ||
      (currentTab === "armor" && item.type === "armor") ||
      (currentTab === "accessories" && item.type === "accessory") ||
      (currentTab === "real-life" && item.type === "real-life");
    
    return matchesSearch && matchesType && matchesRarity && matchesTab;
  });
  
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
  
  const handleSaveItem = (item: GearItem) => {
    const existingItemIndex = shopItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      const { updateShopItem } = gameData;
      updateShopItem(item);
    } else {
      const { addShopItem } = gameData;
      addShopItem(item);
    }
    
    setEditingItem(undefined);
  };
  
  const handleDeleteItem = (itemId: string) => {
    const { deleteShopItem } = gameData;
    deleteShopItem(itemId);
    
    setEditingItem(undefined);
  };
  
  const canAfford = (item: GearItem) => character.coins >= item.cost;
  
  const meetsLevelRequirement = (item: GearItem) => character.level >= item.levelRequired;
  
  return (
    <div className="container mx-auto animate-fade-in">
      <ShopHeader 
        coins={character.coins}
        level={character.level}
        isAdmin={isAdmin}
        toggleAdmin={() => setIsAdmin(!isAdmin)}
      />
      
      <ShopFilters
        searchText={searchText}
        setSearchText={setSearchText}
        filterType={filterType}
        setFilterType={setFilterType}
        filterRarity={filterRarity}
        setFilterRarity={setFilterRarity}
      />
      
      <AdminPanel 
        isAdmin={isAdmin}
        onSaveItem={handleSaveItem}
      />
      
      {editingItem && (
        <ShopItemEditor
          item={editingItem}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          trigger={<div style={{ display: 'none' }}></div>}
        />
      )}
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="tabs-container">
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown h-auto">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            All Items
          </TabsTrigger>
          <TabsTrigger 
            value="available" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Available Now
          </TabsTrigger>
          <TabsTrigger 
            value="weapons" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Weapons
          </TabsTrigger>
          <TabsTrigger 
            value="armor" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Armor
          </TabsTrigger>
          <TabsTrigger 
            value="accessories" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Accessories
          </TabsTrigger>
          <TabsTrigger 
            value="real-life" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Real Life
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab} className="animate-fade-in">
          {filteredItems.length === 0 ? (
            <EmptyShop 
              isAdmin={isAdmin}
              onAddNewItem={() => setEditingItem(undefined)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <ShopItemCard
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
