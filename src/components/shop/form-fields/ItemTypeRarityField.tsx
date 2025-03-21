
import { GearType, GearRarity } from "@/contexts/DataContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ItemTypeRarityFieldProps {
  type: GearType;
  setType: (type: GearType) => void;
  rarity: GearRarity;
  setRarity: (rarity: GearRarity) => void;
}

const ItemTypeRarityField = ({ 
  type, 
  setType, 
  rarity, 
  setRarity 
}: ItemTypeRarityFieldProps) => {
  return (
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
  );
};

export default ItemTypeRarityField;
