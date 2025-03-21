
import { useState } from 'react';
import { GearItem } from "@/contexts/DataContext";
import { generateId } from "@/utils/idGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit } from "lucide-react";
import ShopItemForm from "./shop/ShopItemForm";

interface ShopItemEditorProps {
  item?: GearItem;
  onSave: (item: GearItem) => void;
  onDelete?: (itemId: string) => void;
  trigger?: React.ReactNode;
}

export function ShopItemEditor({ item, onSave, onDelete, trigger }: ShopItemEditorProps) {
  const [open, setOpen] = useState(false);

  const handleSave = (updatedItem: GearItem) => {
    // Generate ID if it's a new item
    if (!updatedItem.id) {
      updatedItem.id = generateId();
    }
    
    onSave(updatedItem);
    setOpen(false);
  };

  const handleDelete = (itemId: string) => {
    if (onDelete) {
      onDelete(itemId);
      setOpen(false);
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

        <ShopItemForm
          initialData={item}
          onSave={handleSave}
          onDelete={onDelete ? handleDelete : undefined}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
