
import { useState } from 'react';
import { GearItem, GearType, GearRarity } from "@/contexts/DataContext";
import { StatName } from "@/types/character";
import { toast } from "sonner";

// Import our new components
import NameField from "./form-fields/NameField";
import DescriptionField from "./form-fields/DescriptionField";
import ItemTypeRarityField from "./form-fields/ItemTypeRarityField";
import IconSelector from "./IconSelector";
import CostLevelField from "./form-fields/CostLevelField";
import StatBonusesEditor from "./StatBonusesEditor";
import FormActions from "./form-fields/FormActions";
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
      <NameField name={name} setName={setName} />
      
      <DescriptionField description={description} setDescription={setDescription} />
      
      <ItemTypeRarityField 
        type={type} 
        setType={setType} 
        rarity={rarity} 
        setRarity={setRarity} 
      />

      <IconSelector 
        icon={icon} 
        setIcon={setIcon} 
        icons={ITEM_ICONS} 
      />

      <CostLevelField 
        cost={cost} 
        setCost={setCost} 
        levelRequired={levelRequired} 
        setLevelRequired={setLevelRequired} 
      />

      <StatBonusesEditor 
        statBonuses={statBonuses}
        onStatChange={handleStatChange}
      />

      <FormActions 
        isEditing={!!initialData}
        onSave={handleSave}
        onDelete={initialData && onDelete ? () => handleDelete() : undefined}
        onCancel={onCancel}
      />
    </div>
  );
};

export default ShopItemForm;
