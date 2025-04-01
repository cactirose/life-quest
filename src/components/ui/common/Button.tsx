import { cn } from "@/lib/utils";

export const Button = ({ variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-parchment border-2 border-secondary rounded-md font-pixel',
    secondary: 'bg-[var(--rpg-brown)] text-[var(--rpg-tan)]',
    outline: 'border-2 border-[var(--rpg-brown)] text-[var(--rpg-brown)]',
  };

  return (
    <button 
      className={cn(
        variants[variant],
        'transition-colors px-6 py-2',
        props.className
      )}
      {...props}
    />
  );
}; 
