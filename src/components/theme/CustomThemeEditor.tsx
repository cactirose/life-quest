
import { Button } from "@/components/ui/button";
import { ThemeColors } from '@/utils/theme';
import { ColorInput } from "./ColorInput";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
          <AccordionItem key={groupName} value={groupName}>
            <AccordionTrigger className="font-bold">
              {groupName}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 mb-2">
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
      
      <div className="border rounded-md p-4 bg-white/10 mt-6">
        <h3 className="text-sm font-semibold mb-2">Preview</h3>
        <div 
          className="flex flex-col space-y-2 p-3 rounded-md border"
          style={{ backgroundColor: customTheme.background }}
        >
          <div 
            className="w-full h-6 rounded" 
            style={{ backgroundColor: customTheme.primary }}
          ></div>
          <div 
            className="w-3/4 h-6 rounded" 
            style={{ backgroundColor: customTheme.secondary }}
          ></div>
          <div 
            className="w-1/2 h-6 rounded" 
            style={{ backgroundColor: customTheme.accent }}
          ></div>
          <div 
            className="px-2 py-1 rounded text-center text-sm"
            style={{ 
              backgroundColor: customTheme.parchment, 
              color: customTheme.text 
            }}
          >
            Sample Text
          </div>
        </div>
      </div>
      
      <p className="text-sm text-rpg-brown mt-4">
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
