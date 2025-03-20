
import { ThemeName, ThemeColors, THEME_PRESETS } from '@/utils/theme';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemePresetsProps {
  activeTheme: ThemeName;
  onSelectTheme: (themeName: ThemeName) => void;
}

export function ThemePresets({ activeTheme, onSelectTheme }: ThemePresetsProps) {
  const isMobile = useIsMobile();
  
  const presetButtons = Object.entries(THEME_PRESETS).map(([name, colors]) => {
    if (name === 'custom') return null;
    
    const isActive = activeTheme === name;
    const themeName = name as ThemeName;
    
    return (
      <Button
        key={name}
        variant="ghost"
        className={`p-3 sm:p-4 rounded-md shadow-sm border-2 transition-all h-auto ${
          isActive ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : 'opacity-80 hover:opacity-100 hover:scale-102'
        }`}
        style={{
          backgroundColor: colors.primary,
          borderColor: colors.secondary,
        }}
        onClick={() => onSelectTheme(themeName)}
        aria-label={`Select ${name} theme`}
        aria-pressed={isActive}
      >
        <div className="flex flex-col items-center">
          <div 
            className="w-full h-3 sm:h-4 rounded-sm mb-1 sm:mb-2" 
            style={{ backgroundColor: colors.accent }}
          ></div>
          <span
            className="text-[10px] sm:text-xs font-bold capitalize"
            style={{ 
              color: colors.text,
              textShadow: '0px 0px 1px rgba(255, 255, 255, 0.5)'  
            }}
          >
            {name}
          </span>
        </div>
      </Button>
    );
  });

  return (
    <div className="space-y-4 py-4">
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2 sm:gap-4`}>
        {presetButtons}
      </div>
      <p className="text-xs sm:text-sm text-rpg-brown mt-4">
        Select a preset theme to instantly change the appearance of the entire application.
      </p>
    </div>
  );
}
