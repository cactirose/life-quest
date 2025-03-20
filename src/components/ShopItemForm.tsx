
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GearItem, GearType, GearRarity } from "@/types/inventory";
import { StatName } from "@/types/character";

interface ShopItemFormProps {
  item?: GearItem;
  onSubmit: (item: Omit<GearItem, "id">) => void;
  onCancel: () => void;
}

export function ShopItemForm({ item, onSubmit, onCancel }: ShopItemFormProps) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [type, setType] = useState<GearType>(item?.type || "accessory");
  const [rarity, setRarity] = useState<GearRarity>(item?.rarity || "common");
  const [icon, setIcon] = useState(item?.icon || "🔮");
  const [cost, setCost] = useState(item?.cost || 25);
  const [levelRequired, setLevelRequired] = useState(item?.levelRequired || 1);
  const [statBonuses, setStatBonuses] = useState<Partial<Record<StatName, number>>>(
    item?.statBonuses || {}
  );
  const [realLifeReward, setRealLifeReward] = useState(item?.realLifeReward || false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter an item name");
      return;
    }

    const newItem: Omit<GearItem, "id"> = {
      name,
      description,
      type,
      rarity,
      icon,
      cost: Math.max(1, cost),
      levelRequired: Math.max(1, levelRequired),
      statBonuses: type === "real-life" ? {} : statBonuses,
      equipped: false,
      realLifeReward: type === "real-life" ? true : realLifeReward
    };

    onSubmit(newItem);
  };

  const handleStatChange = (stat: StatName, value: number) => {
    setStatBonuses(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
  };

  // Common icon options
  const iconOptions = {
    weapon: ["🗡️", "⚔️", "🏹", "🪓", "🔨", "🗡️", "🔪"],
    armor: ["🛡️", "👕", "👖", "👢", "🧥", "🧣", "🧤", "👑"],
    accessory: ["💍", "📿", "🧿", "🔮", "📖", "🧩", "🎭", "🎨"],
    "real-life": ["☕", "🎬", "🍕", "🎮", "📱", "💆", "🚶", "🏊", "🧘", "🎵"]
  };

  // Update icon options when type changes
  useEffect(() => {
    if (type && !item) {
      setIcon(iconOptions[type][0]);
    }
  }, [type]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Item Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter item description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Item Type
          </label>
          <Select value={type} onValueChange={(value: GearType) => setType(value)}>
            <SelectTrigger>
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
          <label htmlFor="rarity" className="block text-sm font-medium mb-1">
            Rarity
          </label>
          <Select value={rarity} onValueChange={(value: GearRarity) => setRarity(value)}>
            <SelectTrigger>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="icon" className="block text-sm font-medium mb-1">
            Icon
          </label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger>
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {type && iconOptions[type].map((emoji) => (
                <SelectItem key={emoji} value={emoji}>
                  <span className="text-xl">{emoji}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium mb-1">
            Cost (Coins)
          </label>
          <Input
            id="cost"
            type="number"
            min="1"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label htmlFor="levelRequired" className="block text-sm font-medium mb-1">
          Level Required
        </label>
        <Input
          id="levelRequired"
          type="number"
          min="1"
          value={levelRequired}
          onChange={(e) => setLevelRequired(Number(e.target.value))}
        />
      </div>

      {type !== "real-life" && (
        <div>
          <label className="block text-sm font-medium mb-2">Stat Bonuses</label>
          <div className="grid grid-cols-2 gap-3">
            {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as StatName[]).map(
              (stat) => (
                <div key={stat} className="flex items-center gap-2">
                  <span className="text-sm capitalize w-24">{stat}</span>
                  <Input
                    type="number"
                    min="0"
                    value={statBonuses[stat] || 0}
                    onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                    className="w-16"
                  />
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </div>
  );
}
