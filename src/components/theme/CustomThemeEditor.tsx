
import { Button } from "@/components/ui/button";
import { ThemeColors, THEME_PRESETS } from '@/utils/theme';
import { ColorInput } from "./ColorInput";

interface CustomThemeEditorProps {
  customTheme: ThemeColors;
  onColorChange: (key: keyof ThemeColors, value: string) => void;
  onReset: () => void;
}

export function CustomThemeEditor({ 
  customTheme, 
  onColorChange, 
  onReset 
}: CustomThemeEditorProps) {
  const colorGroups = {
    "Main Colors": ["primary", "secondary", "background", "accent", "text"],
    "Navigation": ["navbar", "nav-hover", "nav-hover-text", "nav-active", "nav-active-text"],
    "Content": ["parchment", "positive", "negative", "purple"]
  };

  return (
    <div className="space-y-4 py-4">
      {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
        <div key={groupName}>
          <h3 className="font-bold mb-2">{groupName}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {colorKeys.map(key => (
              <ColorInput
                key={key}
                colorKey={key as keyof ThemeColors}
                value={customTheme[key as keyof ThemeColors] || '#000000'}
                onChange={onColorChange}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="text-sm text-rpg-brown mt-2">
        Your custom theme will be applied to all elements of the application including the navigation bar, buttons, and content areas.
      </p>
      <Button 
        onClick={onReset}
        variant="outline"
        className="mt-4 hover:bg-rpg-brown hover:text-rpg-tan"
      >
        Reset to Default
      </Button>
    </div>
  );
}
