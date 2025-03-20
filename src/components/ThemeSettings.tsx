
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
import { Palette } from 'lucide-react';
import { toast } from 'sonner';
import {
  ThemeName,
  ThemeColors,
  THEME_PRESETS,
  saveTheme,
  getCurrentTheme,
  contrastColor,
} from '@/utils/theme';

import { ThemePresets } from './theme/ThemePresets';
import { CustomThemeEditor } from './theme/CustomThemeEditor';

export function ThemeSettings() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [activeTheme, setActiveTheme] = useState<ThemeName>("default");
  const [customTheme, setCustomTheme] = useState<ThemeColors>(THEME_PRESETS.default);

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
      
      if (key === "nav-hover") {
        updatedTheme["nav-hover-text"] = contrastColor(value);
      }
      if (key === "nav-active") {
        updatedTheme["nav-active-text"] = contrastColor(value);
      }
      
      saveTheme(updatedTheme, 'custom');
      return updatedTheme;
    });
    setActiveTheme('custom');
  };

  const handleResetToDefault = () => {
    setCustomTheme(THEME_PRESETS.default);
    saveTheme(THEME_PRESETS.default, 'default');
    setActiveTheme('default');
    toast.success('Reset to default theme');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] hover:text-[hsl(var(--nav-hover-text))]">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] parchment border-rpg-brown">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">Appearance</DialogTitle>
          <DialogDescription className="text-rpg-brown">
            Customize the visual theme of your adventure
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Theme Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets">
            <ThemePresets 
              activeTheme={activeTheme} 
              onSelectTheme={handleThemeSelect} 
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomThemeEditor 
              customTheme={customTheme}
              onColorChange={handleColorChange}
              onReset={handleResetToDefault}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
