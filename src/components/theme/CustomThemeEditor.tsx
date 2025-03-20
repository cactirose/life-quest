
import { Button } from "@/components/ui/button";
import { ThemeColors } from '@/utils/theme';
import { ColorInput } from "./ColorInput";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const colorGroups = {
    "Main Colors": ["primary", "secondary", "background", "accent", "text"],
    "Navigation": ["navbar", "nav-hover", "nav-hover-text", "nav-active", "nav-active-text"],
    "Content": ["parchment", "positive", "negative", "purple"]
  };

  return (
    <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
          <AccordionItem key={groupName} value={groupName}>
            <AccordionTrigger className="text-sm sm:text-base font-bold py-2 sm:py-3">
              {groupName}
            </AccordionTrigger>
            <AccordionContent>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 sm:gap-4 mb-2`}>
                {colorKeys.map(key => (
                  <ColorInput
                    key={key}
                    colorKey={key as keyof ThemeColors}
                    value={customTheme[key as keyof ThemeColors] || '#000000'}
                    onChange={onColorChange}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="border rounded-md p-3 sm:p-4 bg-white/10 mt-4 sm:mt-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-2">Preview</h3>
        <div 
          className="flex flex-col space-y-2 p-2 sm:p-3 rounded-md border"
          style={{ backgroundColor: customTheme.background }}
        >
          <div 
            className="w-full h-4 sm:h-6 rounded" 
            style={{ backgroundColor: customTheme.primary }}
          ></div>
          <div 
            className="w-3/4 h-4 sm:h-6 rounded" 
            style={{ backgroundColor: customTheme.secondary }}
          ></div>
          <div 
            className="w-1/2 h-4 sm:h-6 rounded" 
            style={{ backgroundColor: customTheme.accent }}
          ></div>
          <div 
            className="px-2 py-1 rounded text-center text-xs sm:text-sm"
            style={{ 
              backgroundColor: customTheme.parchment, 
              color: customTheme.text 
            }}
          >
            Sample Text
          </div>
        </div>
      </div>
      
      <p className="text-xs sm:text-sm text-rpg-brown mt-3 sm:mt-4">
        Your custom theme will be applied to all elements of the application including the navigation bar, buttons, and content areas.
      </p>
      
      <Button 
        onClick={onReset}
        variant="outline"
        className="mt-3 sm:mt-4 text-xs sm:text-sm py-1 sm:py-2 hover:bg-rpg-brown hover:text-rpg-tan"
        size={isMobile ? "sm" : "default"}
      >
        Reset to Default
      </Button>
    </div>
  );
}
