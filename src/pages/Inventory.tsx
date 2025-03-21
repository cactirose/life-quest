
import { useState } from "react";
import { useGameData, GearItem, GearType } from "@/contexts/DataContext";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryItemCard from "@/components/inventory/InventoryItemCard";
import EquipmentSlots from "@/components/inventory/EquipmentSlots";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import EmptyInventory from "@/components/inventory/EmptyInventory";

const Inventory = () => {
  const { inventory, equipItem, unequipItem } = useGameData();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<GearType | "all">("all");
  const [currentTab, setCurrentTab] = useState<string>("all");
  
  const equippedItemsByType = inventory
    .filter(item => item.equipped)
    .reduce((acc, item) => {
      acc[item.type] = item;
      return acc;
    }, {} as Partial<Record<GearType, GearItem | null>>);
    
  const equipmentSlots: Partial<Record<GearType, GearItem | null>> = {
    weapon: equippedItemsByType.weapon || null,
    armor: equippedItemsByType.armor || null,
    accessory: equippedItemsByType.accessory || null,
  };
  
  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    
    const matchesTab = 
      (currentTab === "all") || 
      (currentTab === "equipped" && item.equipped) ||
      (currentTab === "weapons" && item.type === "weapon") ||
      (currentTab === "armor" && item.type === "armor") ||
      (currentTab === "accessories" && item.type === "accessory") ||
      (currentTab === "real-life" && item.type === "real-life");
    
    return matchesSearch && matchesType && matchesTab;
  });
  
  const handleEquip = (itemId: string) => {
    equipItem(itemId);
    toast.success("Item equipped!");
  };
  
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
      
      <InventoryFilters 
        searchText={searchText}
        setSearchText={setSearchText}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="tabs-container">
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown h-auto">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            All Items
          </TabsTrigger>
          <TabsTrigger 
            value="equipped" 
            className="data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Equipped
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
            <EmptyInventory 
              isFiltered={searchText !== "" || filterType !== "all" || currentTab !== "all"} 
              inventoryCount={inventory.length} 
            />
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
