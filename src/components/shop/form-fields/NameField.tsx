
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NameFieldProps {
  name: string;
  setName: (name: string) => void;
}

const NameField = ({ name, setName }: NameFieldProps) => {
  return (
    <div>
      <Label htmlFor="name">Item Name</Label>
      <Input 
        id="name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Mighty Sword"
      />
    </div>
  );
};

export default NameField;
