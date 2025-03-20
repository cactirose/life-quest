
import { Label } from "@/components/ui/label";
import { ThemeColors } from "@/utils/theme";

interface ColorInputProps {
  colorKey: keyof ThemeColors;
  value: string;
  onChange: (key: keyof ThemeColors, value: string) => void;
}

export function ColorInput({ colorKey, value, onChange }: ColorInputProps) {
  // Format the colorKey from camelCase to a readable display name
  const displayName = colorKey
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/-/g, ' ');
  
  // Ensure the value is a valid hex color
  const safeValue = value && /^#[0-9A-F]{6}$/i.test(value) ? value : '#000000';
  
  // Handle input validation for hex code input
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // If user entered a color without #, add it
    if (newValue.length > 0 && !newValue.startsWith('#')) {
      newValue = '#' + newValue;
    }
    
    // Only update if it's a valid hex color or empty (which will be converted to #000000)
    if (newValue === '' || /^#[0-9A-F]{0,6}$/i.test(newValue)) {
      onChange(colorKey, newValue || '#000000');
    }
  };
  
  return (
    <div className="space-y-1 sm:space-y-2">
      <Label htmlFor={colorKey} className="text-xs sm:text-sm capitalize">
        {displayName}
      </Label>
      <div className="flex items-center gap-1 sm:gap-2">
        <input
          type="color"
          id={colorKey}
          value={safeValue}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="w-6 h-6 sm:w-8 sm:h-8 p-0 border cursor-pointer"
          aria-label={`Change ${displayName} color`}
        />
        <input
          type="text"
          value={safeValue}
          onChange={handleTextChange}
          className="flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded"
          aria-label={`${displayName} color hex value`}
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
