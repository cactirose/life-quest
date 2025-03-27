
import { cn } from "@/lib/utils";

export const Button = ({ variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-[var(--rpg-tan)] text-[var(--rpg-brown)]',
    secondary: 'bg-[var(--rpg-brown)] text-[var(--rpg-tan)]',
    outline: 'border-2 border-[var(--rpg-brown)] text-[var(--rpg-brown)]',
  };

  return (
    <button 
      className={cn(
        variants[variant],
        'hover:opacity-90 transition-opacity',
        props.className
      )}
      {...props}
    />
  );
}; 
