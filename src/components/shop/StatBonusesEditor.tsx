
import { StatName } from "@/types/character";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StatBonusesEditorProps {
  statBonuses: Record<StatName, number>;
  onStatChange: (stat: StatName, value: number) => void;
}

const StatBonusesEditor = ({ statBonuses, onStatChange }: StatBonusesEditorProps) => {
  return (
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
              onChange={(e) => onStatChange(stat as StatName, parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatBonusesEditor;
