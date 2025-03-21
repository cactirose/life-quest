
interface IconSelectorProps {
  icon: string;
  setIcon: (value: string) => void;
}

const IconSelector = ({ icon, setIcon }: IconSelectorProps) => {
  const emojiOptions = ["🏆", "🏅", "🎖️", "⭐", "🌟", "✨", "🎯", "🚀", "🎮", "🔮", "💎", "🌈", "🔥", "👑", "⚔️", "🛡️", "📚", "🧠", "💪", "🎓"];
  
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Icon
      </label>
      <div className="grid grid-cols-10 gap-2">
        {emojiOptions.map(emoji => (
          <button
            key={emoji}
            type="button"
            onClick={() => setIcon(emoji)}
            className={`h-8 w-8 flex items-center justify-center rounded-md border ${
              icon === emoji 
                ? "border-2 border-rpg-brown bg-rpg-tan" 
                : "border-border hover:bg-accent"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
