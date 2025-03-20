
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Palette } from 'lucide-react';
import { toast } from 'sonner';
import {
  ThemeName,
  ThemeColors,
  THEME_PRESETS,
  applyTheme,
  saveTheme,
  getCurrentTheme
} from '@/utils/themeCustomization';

export function ThemeSettings() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [activeTheme, setActiveTheme] = useState<ThemeName>("default");
  const [customTheme, setCustomTheme] = useState<ThemeColors>(THEME_PRESETS.default);

  // Load saved theme when component mounts
  useEffect(() => {
    const savedThemeName = localStorage.getItem('rpgProductivityThemeName') as ThemeName || 'default';
    setActiveTheme(savedThemeName);
    setCustomTheme(getCurrentTheme());
  }, []);

  const handleThemeSelect = (themeName: ThemeName) => {
    setActiveTheme(themeName);
    if (themeName !== 'custom') {
      saveTheme(THEME_PRESETS[themeName], themeName);
      toast.success(`${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme applied!`);
    } else {
      saveTheme(customTheme, 'custom');
      toast.success('Custom theme applied!');
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setCustomTheme((prev) => {
      const updatedTheme = { ...prev, [key]: value };
      
      // Auto-update hover/active text color for better contrast when changing bg colors
      if (key === "nav-hover") {
        updatedTheme["nav-hover-text"] = getContrastColor(value);
      }
      if (key === "nav-active") {
        updatedTheme["nav-active-text"] = getContrastColor(value);
      }
      if (key === "navbar") {
        // Update nav-hover and nav-active if navbar changes
        if (!updatedTheme["nav-hover"] || updatedTheme["nav-hover"] === prev.navbar) {
          updatedTheme["nav-hover"] = getDarkerShade(value, 20);
          updatedTheme["nav-hover-text"] = getContrastColor(updatedTheme["nav-hover"]);
        }
        if (!updatedTheme["nav-active"] || updatedTheme["nav-active"] === prev.navbar) {
          updatedTheme["nav-active"] = getDarkerShade(value, 30);
          updatedTheme["nav-active-text"] = getContrastColor(updatedTheme["nav-active"]);
        }
      }
      if (key === "accent") {
        // Update accent-text for better contrast
        updatedTheme["accent-text"] = getContrastColor(value);
        
        // Update hover colors based on accent
        updatedTheme["hover"] = getDarkerShade(value, 20);
        updatedTheme["hover-text"] = getContrastColor(updatedTheme["hover"]);
      }
      if (key === "secondary") {
        // Update positive color to match the theme if it's the default brown
        if (prev.positive === THEME_PRESETS.default.positive) {
          updatedTheme.positive = value;
        }
      }
      
      saveTheme(updatedTheme, 'custom');
      return updatedTheme;
    });
    setActiveTheme('custom');
  };
  
  // Helper function to determine contrasting text color
  const getContrastColor = (hex: string): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#3A1F0E' : '#FFF8DC';
  };
  
  // Helper function to get a darker shade
  const getDarkerShade = (hex: string, percent: number): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const factor = 1 - percent / 100;
    
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const presetButtons = Object.entries(THEME_PRESETS).map(([name, colors]) => {
    if (name === 'custom') return null;
    return (
      <button
        key={name}
        className={`p-4 rounded-md shadow-sm border-2 transition-all ${
          activeTheme === name ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-80'
        }`}
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.accent,
        }}
        onClick={() => handleThemeSelect(name as ThemeName)}
        aria-label={`Select ${name} theme`}
      >
        <div className="flex flex-col items-center">
          <div 
            className="w-full h-4 rounded-sm mb-2" 
            style={{ backgroundColor: colors.accent }}
          ></div>
          <span
            className="text-xs font-bold capitalize"
            style={{ 
              color: colors.text,
              textShadow: '0px 0px 1px rgba(255, 255, 255, 0.5)'  
            }}
          >
            {name}
          </span>
        </div>
      </button>
    );
  });

  // Group color settings for better organization
  const colorGroups = {
    "Main Colors": ["primary", "secondary", "background", "accent", "text"],
    "Navigation": ["navbar", "nav-hover", "nav-hover-text", "nav-active", "nav-active-text"],
    "Content": ["parchment", "positive", "negative", "purple"]
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative text-[var(--nav-text)] hover:bg-[var(--nav-hover)] hover:text-[var(--nav-hover-text)]">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] parchment border-[var(--rpg-accent)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-[var(--rpg-text)]">Appearance</DialogTitle>
          <DialogDescription className="text-[var(--rpg-text)]">
            Customize the visual theme of your adventure
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets" className="themed-tab-trigger">Theme Presets</TabsTrigger>
            <TabsTrigger value="custom" className="themed-tab-trigger">Custom Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              {presetButtons}
            </div>
            <p className="text-sm text-[var(--rpg-text)] mt-4">
              Select a preset theme to instantly change the appearance of the entire application.
            </p>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 py-4">
            {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
              <div key={groupName}>
                <h3 className="font-bold mb-2 text-[var(--rpg-text)]">{groupName}</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {colorKeys.map(key => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-sm capitalize text-[var(--rpg-text)]">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/-/g, ' ')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id={key}
                          value={customTheme[key as keyof ThemeColors] || '#000000'}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                          className="w-8 h-8 p-0 border cursor-pointer"
                          aria-label={`Change ${key} color`}
                        />
                        <input
                          type="text"
                          value={customTheme[key as keyof ThemeColors] || '#000000'}
                          onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          aria-label={`${key} color hex value`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-sm text-[var(--rpg-text)] mt-2">
              Your custom theme will be applied to all elements of the application including the navigation bar, buttons, and content areas.
            </p>
            <Button 
              onClick={() => {
                setCustomTheme(THEME_PRESETS.default);
                saveTheme(THEME_PRESETS.default, 'default');
                setActiveTheme('default');
                toast.success('Reset to default theme');
              }}
              variant="outline"
              className="mt-4 hover:bg-[var(--rpg-hover)] hover:text-[var(--rpg-hover-text)]"
            >
              Reset to Default
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
