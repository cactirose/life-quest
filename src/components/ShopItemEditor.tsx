
import { useState } from 'react';
import { useGameData, GearItem, GearType, GearRarity } from "@/contexts/DataContext";
import { generateId } from "@/utils/idGenerator";
import { StatName } from "@/types/character";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ShopItemEditorProps {
  item?: GearItem;
  onSave: (item: GearItem) => void;
  onDelete?: (itemId: string) => void;
  trigger?: React.ReactNode;
}

const DEFAULT_STATS: Record<StatName, number> = {
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0
};

const ITEM_ICONS = ["🗡️", "🛡️", "🧙", "🏹", "🪄", "💍", "👑", "🧪", "📚", "🔮", "🧠", "💪", "🎭", "⚔️", "🍕", "🍦", "🎮", "📱", "🎵", "🎬", "💤", "🌴", "🏖️", "🎁", "🎨"];

export function ShopItemEditor({ item, onSave, onDelete, trigger }: ShopItemEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [type, setType] = useState<GearType>(item?.type || "weapon");
  const [rarity, setRarity] = useState<GearRarity>(item?.rarity || "common");
  const [icon, setIcon] = useState(item?.icon || "🗡️");
  const [cost, setCost] = useState(item?.cost || 50);
  const [levelRequired, setLevelRequired] = useState(item?.levelRequired || 1);
  const [statBonuses, setStatBonuses] = useState<Record<StatName, number>>(
    item?.statBonuses || { ...DEFAULT_STATS }
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
      id: item?.id || generateId(),
      name,
      description,
      type,
      rarity,
      icon,
      cost,
      statBonuses,
      equipped: item?.equipped || false,
      levelRequired
    };

    onSave(newItem);
    setOpen(false);
    toast.success(item ? "Item updated successfully" : "Item created successfully");
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
      setOpen(false);
      toast.success("Item deleted successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="pixel-button">
            <PlusCircle size={16} className="mr-2" />
            {item ? "Edit Item" : "New Item"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md parchment border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">
            {item ? "Edit Shop Item" : "Create New Shop Item"}
          </DialogTitle>
        </DialogHeader>

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

          <div>
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2 mt-1">
              {ITEM_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-10 w-10 flex items-center justify-center rounded-md border ${
                    icon === emoji 
                      ? "border-2 border-rpg-brown bg-rpg-tan" 
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </div>

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

          <div>
            <Label className="block mb-2">Stat Bonuses</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(statBonuses).map(([stat, value]) => (
                <div key={stat} className="space-y-1">
                  <Label htmlFor={`stat-${stat}`} className="text-xs capitalize">
                    {stat}
                  </Label>
                  <Input 
                    id={`stat-${stat}`} 
                    type="number" 
                    value={value} 
                    onChange={(e) => handleStatChange(stat as StatName, parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            {item && onDelete ? (
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
            <Button onClick={handleSave} className="pixel-button">
              {item ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
