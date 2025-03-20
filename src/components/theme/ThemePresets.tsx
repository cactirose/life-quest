
import { ThemeName, ThemeColors, THEME_PRESETS } from '@/utils/theme';

interface ThemePresetsProps {
  activeTheme: ThemeName;
  onSelectTheme: (themeName: ThemeName) => void;
}

export function ThemePresets({ activeTheme, onSelectTheme }: ThemePresetsProps) {
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
        onClick={() => onSelectTheme(name as ThemeName)}
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

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-3 gap-4">
        {presetButtons}
      </div>
      <p className="text-sm text-rpg-brown mt-4">
        Select a preset theme to instantly change the appearance of the entire application.
      </p>
    </div>
  );
}
