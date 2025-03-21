
import { Label } from "@/components/ui/label";

interface IconSelectorProps {
  icon: string;
  setIcon: (icon: string) => void;
  icons: string[];
}

const IconSelector = ({ icon, setIcon, icons }: IconSelectorProps) => {
  return (
    <div>
      <Label>Icon</Label>
      <div className="grid grid-cols-5 gap-2 mt-1">
        {icons.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setIcon(emoji)}
            className={`h-10 w-10 flex items-center justify-center rounded-md border ${
              icon === emoji 
                ? "border-2 border-rpg-brown bg-rpg-tan" 
                : "border-border hover:bg-accent"
            }`}
          >
            <span className="text-lg">{emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
