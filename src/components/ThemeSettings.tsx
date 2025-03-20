
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
    } else {
      saveTheme(customTheme, 'custom');
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setCustomTheme((prev) => {
      const updatedTheme = { ...prev, [key]: value };
      saveTheme(updatedTheme, 'custom');
      return updatedTheme;
    });
    setActiveTheme('custom');
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
          borderColor: colors.secondary,
        }}
        onClick={() => handleThemeSelect(name as ThemeName)}
      >
        <div className="flex flex-col items-center">
          <div 
            className="w-full h-4 rounded-sm mb-2" 
            style={{ backgroundColor: colors.accent }}
          ></div>
          <span
            className="text-xs font-bold capitalize"
            style={{ color: colors.text }}
          >
            {name}
          </span>
        </div>
      </button>
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
          <DialogDescription>
            Customize the visual theme of your adventure
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Theme Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              {presetButtons}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customTheme).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id={key}
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="w-8 h-8 p-0 border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => {
                setCustomTheme(THEME_PRESETS.default);
                saveTheme(THEME_PRESETS.default, 'default');
                setActiveTheme('default');
              }}
              variant="outline"
              className="mt-4"
            >
              Reset to Default
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
