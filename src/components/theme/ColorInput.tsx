
import { Label } from "@/components/ui/label";
import { ThemeColors } from "@/utils/theme";

interface ColorInputProps {
  colorKey: keyof ThemeColors;
  value: string;
  onChange: (key: keyof ThemeColors, value: string) => void;
}

export function ColorInput({ colorKey, value, onChange }: ColorInputProps) {
  const displayName = colorKey.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/-/g, ' ');
  
  return (
    <div className="space-y-2">
      <Label htmlFor={colorKey} className="text-sm capitalize">
        {displayName}
      </Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={colorKey}
          value={value || '#000000'}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="w-8 h-8 p-0 border cursor-pointer"
          aria-label={`Change ${colorKey} color`}
        />
        <input
          type="text"
          value={value || '#000000'}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded"
          aria-label={`${colorKey} color hex value`}
        />
      </div>
    </div>
  );
}
