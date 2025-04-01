import { cn } from "@/lib/utils";

export const Button = ({ variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-secondary border-2 border-secondary rounded-md font-pixel',
    secondary: 'bg-secondary hover:bg-secondary/90 text-primary-foreground border-2 border-primary rounded-md font-pixel',
    outline: 'border-2 border-secondary text-secondary hover:bg-secondary/10 rounded-md font-pixel',
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
