
import { useState } from 'react';
import { GearItem, GearType, GearRarity } from "@/contexts/DataContext";
import { StatName } from "@/types/character";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import IconSelector from "./IconSelector";
import StatBonusesEditor from "./StatBonusesEditor";
import { DEFAULT_STATS, ITEM_ICONS, ShopItemFormData } from "./shopItemConstants";

interface ShopItemFormProps {
  initialData?: GearItem;
  onSave: (item: GearItem) => void;
  onDelete?: (itemId: string) => void;
  onCancel: () => void;
}

const ShopItemForm = ({ initialData, onSave, onDelete, onCancel }: ShopItemFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState<GearType>(initialData?.type || "weapon");
  const [rarity, setRarity] = useState<GearRarity>(initialData?.rarity || "common");
  const [icon, setIcon] = useState(initialData?.icon || "🗡️");
  const [cost, setCost] = useState(initialData?.cost || 50);
  const [levelRequired, setLevelRequired] = useState(initialData?.levelRequired || 1);
  const [statBonuses, setStatBonuses] = useState<Record<StatName, number>>(
    initialData?.statBonuses ? { ...DEFAULT_STATS, ...initialData.statBonuses } : { ...DEFAULT_STATS }
  );

  const handleStatChange = (stat: StatName, value: number) => {
    setStatBonuses(prev => ({
      ...prev,
      [stat]: value
    }));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Item name is required");
      return;
    }

    const newItem: GearItem = {
      id: initialData?.id || "",
      name,
      description,
      type,
      rarity,
      icon,
      cost,
      statBonuses,
      equipped: initialData?.equipped || false,
      levelRequired
    };

    onSave(newItem);
    toast.success(initialData ? "Item updated successfully" : "Item created successfully");
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      onDelete(initialData.id);
      toast.success("Item deleted successfully");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Mighty Sword"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="A powerful weapon forged in ancient times"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as GearType)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weapon">Weapon</SelectItem>
              <SelectItem value="armor">Armor</SelectItem>
              <SelectItem value="accessory">Accessory</SelectItem>
              <SelectItem value="real-life">Real Life Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rarity">Rarity</Label>
          <Select value={rarity} onValueChange={(value) => setRarity(value as GearRarity)}>
            <SelectTrigger id="rarity">
              <SelectValue placeholder="Select rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <IconSelector 
        icon={icon} 
        setIcon={setIcon} 
        icons={ITEM_ICONS} 
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input 
            id="cost" 
            type="number" 
            value={cost} 
            onChange={(e) => setCost(parseInt(e.target.value) || 0)} 
            min={0}
          />
        </div>

        <div>
          <Label htmlFor="levelRequired">Required Level</Label>
          <Input 
            id="levelRequired" 
            type="number" 
            value={levelRequired} 
            onChange={(e) => setLevelRequired(parseInt(e.target.value) || 1)}
            min={1}
          />
        </div>
      </div>

      <StatBonusesEditor 
        statBonuses={statBonuses}
        onStatChange={handleStatChange}
      />

      <div className="flex justify-between pt-4">
        {initialData && onDelete ? (
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="bg-rpg-red hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Item
          </Button>
        ) : (
          <div></div>
        )}
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="pixel-button">
            {initialData ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopItemForm;
