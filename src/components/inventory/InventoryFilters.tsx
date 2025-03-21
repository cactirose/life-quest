
import { GearType } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface InventoryFiltersProps {
  searchText: string;
  setSearchText: (value: string) => void;
  filterType: GearType | "all";
  setFilterType: (value: GearType | "all") => void;
}

const InventoryFilters = ({
  searchText,
  setSearchText,
  filterType,
  setFilterType
}: InventoryFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="md:col-span-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rpg-brown" size={16} />
          <Input
            placeholder="Search inventory..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 wood-texture"
          />
        </div>
      </div>
      
      <div>
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
    </div>
  );
};

export default InventoryFilters;
