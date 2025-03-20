
import { StatName } from "../types/character";

// Define available themes
export type ThemeName = "default" | "forest" | "ocean" | "sunset" | "royal" | "custom";

// Base colors that can be customized
export interface ThemeColors {
  primary: string;       // Main wood color
  secondary: string;     // Darker wood accents
  background: string;    // Background color
  accent: string;        // Highlights and buttons
  text: string;          // Main text color
  parchment: string;     // Parchment background
  positive: string;      // Success/positive actions
  negative: string;      // Error/warning
  purple: string;        // For boss quests
  navbar: string;        // Specific color for navbar
  "nav-hover"?: string;  // Navbar hover state
  "nav-active"?: string; // Navbar active state
  "nav-hover-text"?: string; // Text color for navbar hover state
  "nav-active-text"?: string; // Text color for navbar active state
}

// Preset themes
export const THEME_PRESETS: Record<ThemeName, ThemeColors> = {
  default: {
    primary: "#D2B48C",      // Tan
    secondary: "#8B4513",    // Brown
    background: "#F5F5DC",   // Beige
    accent: "#3A1F0E",       // Dark brown
    text: "#3A3124",         // Dark brown
    parchment: "#FFF8DC",    // Cornsilk
    positive: "#3A1F0E",     // Dark brown
    negative: "#B22222",     // Firebrick
    purple: "#8B5CF6",       // Purple for boss quests
    navbar: "#3f210e",       // Dark brown for navbar
    "nav-hover": "#3A1F0E",  // Hover color
    "nav-active": "#3A1F0E", // Active color
    "nav-hover-text": "#FFF8DC", // White text on dark hover
    "nav-active-text": "#FFF8DC"  // White text on dark active
  },
  forest: {
    primary: "#8FBC8F",      // Dark sea green
    secondary: "#2E8B57",    // Sea green
    background: "#F0FFF0",   // Honeydew
    accent: "#556B2F",       // Dark olive green
    text: "#2F4F4F",         // Dark slate gray
    parchment: "#F0FFF0",    // Honeydew
    positive: "#32CD32",     // Lime green
    negative: "#8B0000",     // Dark red
    purple: "#9C27B0",       // Purple for boss quests
    navbar: "#2E8B57",       // Navbar green
    "nav-hover": "#1A5D38",  // Darker green for hover
    "nav-active": "#1A5D38", // Active state
    "nav-hover-text": "#F0FFF0", // Light text on dark hover
    "nav-active-text": "#F0FFF0"  // Light text on dark active
  },
  ocean: {
    primary: "#87CEEB",      // Sky blue
    secondary: "#4682B4",    // Steel blue
    background: "#F0F8FF",   // Alice blue
    accent: "#1E90FF",       // Dodger blue
    text: "#191970",         // Midnight blue
    parchment: "#F0FFFF",    // Azure
    positive: "#40E0D0",     // Turquoise
    negative: "#FF4500",     // Orange red
    purple: "#673AB7",       // Purple for boss quests
    navbar: "#4682B4",       // Navbar blue
    "nav-hover": "#2B5D8C",  // Darker blue for hover
    "nav-active": "#2B5D8C", // Active state
    "nav-hover-text": "#F0FFFF", // Light text on dark hover
    "nav-active-text": "#F0FFFF"  // Light text on dark active
  },
  sunset: {
    primary: "#FFA07A",      // Light salmon
    secondary: "#CD5C5C",    // Indian red
    background: "#FFF0F5",   // Lavender blush
    accent: "#FF6347",       // Tomato
    text: "#8B4513",         // Saddle brown
    parchment: "#FFEFD5",    // Papaya whip
    positive: "#32CD32",     // Lime green
    negative: "#8B0000",     // Dark red
    purple: "#9C27B0",       // Purple for boss quests
    navbar: "#CD5C5C",       // Navbar red
    "nav-hover": "#B13E3E",  // Darker red for hover
    "nav-active": "#B13E3E", // Active state
    "nav-hover-text": "#FFEFD5", // Light text on dark hover
    "nav-active-text": "#FFEFD5"  // Light text on dark active
  },
  royal: {
    primary: "#B39DDB",      // Light purple
    secondary: "#673AB7",    // Deep purple
    background: "#F3E5F5",   // Light lavender
    accent: "#9C27B0",       // Purple
    text: "#311B92",         // Deep purple
    parchment: "#FFF8E1",    // Light amber
    positive: "#4CAF50",     // Green
    negative: "#D32F2F",     // Red
    purple: "#6A1B9A",       // Purple for boss quests
    navbar: "#673AB7",       // Navbar purple
    "nav-hover": "#4A2B82",  // Darker purple for hover
    "nav-active": "#4A2B82", // Active state
    "nav-hover-text": "#FFF8E1", // Light text on dark hover
    "nav-active-text": "#FFF8E1"  // Light text on dark active
  },
  custom: {
    primary: "#D2B48C",      // Default values that will be overridden
    secondary: "#8B4513",
    background: "#F5F5DC",
    accent: "#3A1F0E",
    text: "#3A3124",
    parchment: "#FFF8DC",
    positive: "#3A1F0E",
    negative: "#B22222",
    purple: "#8B5CF6",
    navbar: "#8B4513",
    "nav-hover": "#3A1F0E",
    "nav-active": "#3A1F0E",
    "nav-hover-text": "#FFF8DC",
    "nav-active-text": "#FFF8DC"
  }
};

// Function to apply theme to CSS variables
export function applyTheme(theme: ThemeColors): void {
  // Set default values for nav-hover and nav-active if not provided
  const navHover = theme["nav-hover"] || shadeColor(theme.navbar, -20);
  const navActive = theme["nav-active"] || shadeColor(theme.navbar, -30);
  
  // Set default values for hover/active text colors if not provided
  const navHoverText = theme["nav-hover-text"] || contrastColor(navHover);
  const navActiveText = theme["nav-active-text"] || contrastColor(navActive);

  // Main RPG theme variables
  document.documentElement.style.setProperty('--rpg-tan', theme.primary);
  document.documentElement.style.setProperty('--rpg-brown', theme.secondary);
  document.documentElement.style.setProperty('--rpg-background', theme.background);
  document.documentElement.style.setProperty('--rpg-green', theme.positive);
  document.documentElement.style.setProperty('--rpg-red', theme.negative);
  document.documentElement.style.setProperty('--rpg-parchment', theme.parchment);
  document.documentElement.style.setProperty('--rpg-accent', theme.accent);
  document.documentElement.style.setProperty('--rpg-text', theme.text);
  document.documentElement.style.setProperty('--rpg-purple', theme.purple);
  document.documentElement.style.setProperty('--rpg-dark-wood', shadeColor(theme.secondary, -20));
  document.documentElement.style.setProperty('--rpg-light-green', lightenColor(theme.positive, 20));
  
  // Apply to Tailwind CSS variables as well
  document.documentElement.style.setProperty('--primary', convertToHSL(theme.primary));
  document.documentElement.style.setProperty('--primary-foreground', convertToHSL(contrastColor(theme.primary)));
  document.documentElement.style.setProperty('--secondary', convertToHSL(theme.secondary));
  document.documentElement.style.setProperty('--secondary-foreground', convertToHSL(contrastColor(theme.secondary)));
  document.documentElement.style.setProperty('--accent', convertToHSL(theme.accent));
  document.documentElement.style.setProperty('--accent-foreground', convertToHSL(contrastColor(theme.accent)));
  document.documentElement.style.setProperty('--background', convertToHSL(theme.background));
  document.documentElement.style.setProperty('--foreground', convertToHSL(theme.text));
  document.documentElement.style.setProperty('--muted', convertToHSL(lightenColor(theme.secondary, 40)));
  document.documentElement.style.setProperty('--muted-foreground', convertToHSL(theme.text));
  document.documentElement.style.setProperty('--border', convertToHSL(theme.secondary));
  document.documentElement.style.setProperty('--destructive', convertToHSL(theme.negative));
  document.documentElement.style.setProperty('--destructive-foreground', convertToHSL(contrastColor(theme.negative)));
  
  // Navigation menu specific variables with improved contrast text colors
  document.documentElement.style.setProperty('--nav-bg', convertToHSL(theme.navbar));
  document.documentElement.style.setProperty('--nav-text', convertToHSL(contrastColor(theme.navbar)));
  document.documentElement.style.setProperty('--nav-hover', convertToHSL(navHover));
  document.documentElement.style.setProperty('--nav-hover-text', convertToHSL(navHoverText));
  document.documentElement.style.setProperty('--nav-active', convertToHSL(navActive));
  document.documentElement.style.setProperty('--nav-active-text', convertToHSL(navActiveText));
  
  // Card related variables
  document.documentElement.style.setProperty('--card', convertToHSL(lightenColor(theme.primary, 10)));
  document.documentElement.style.setProperty('--card-foreground', convertToHSL(theme.text));
  document.documentElement.style.setProperty('--popover', convertToHSL(theme.primary));
  document.documentElement.style.setProperty('--popover-foreground', convertToHSL(theme.text));
  
  // Input related
  document.documentElement.style.setProperty('--input', convertToHSL(theme.secondary));
  document.documentElement.style.setProperty('--ring', convertToHSL(theme.accent));
  
  // Additional components
  document.documentElement.style.setProperty('--sidebar-background', convertToHSL(theme.secondary));
  document.documentElement.style.setProperty('--sidebar-foreground', convertToHSL(contrastColor(theme.secondary)));
  document.documentElement.style.setProperty('--sidebar-primary', convertToHSL(theme.primary));
  document.documentElement.style.setProperty('--sidebar-primary-foreground', convertToHSL(theme.text));
  document.documentElement.style.setProperty('--sidebar-accent', convertToHSL(theme.accent));
  document.documentElement.style.setProperty('--sidebar-accent-foreground', convertToHSL(contrastColor(theme.accent)));
  document.documentElement.style.setProperty('--sidebar-border', convertToHSL(lightenColor(theme.secondary, 10)));
  document.documentElement.style.setProperty('--sidebar-ring', convertToHSL(theme.accent));
}

// Helper function to shade color (darken)
function shadeColor(color: string, percent: number): string {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}

// Helper function to lighten color
function lightenColor(color: string, percent: number): string {
  return shadeColor(color, Math.abs(percent));
}

// Function to determine contrasting text color
function contrastColor(hex: string): string {
  // Remove the # from the hex color
  hex = hex.replace('#', '');
  
  // Parse the hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return white or black based on luminance
  return luminance > 0.5 ? '#3A1F0E' : '#FFF8DC';
}

// Helper function to convert hex to HSL string for Tailwind CSS variables
function convertToHSL(hex: string): string {
  // Remove the # from the hex color
  hex = hex.replace('#', '');
  
  // Parse the hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Find the min and max values to calculate the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate the lightness
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    // Calculate the saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
    // Calculate the hue
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    h = Math.round(h * 60);
  }
  
  // Convert saturation and lightness to percentages
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}

// Get current theme from localStorage or use default
export function getCurrentTheme(): ThemeColors {
  const savedTheme = localStorage.getItem('rpgProductivityTheme');
  if (savedTheme) {
    return JSON.parse(savedTheme);
  }
  return THEME_PRESETS.default;
}

// Save theme to localStorage
export function saveTheme(theme: ThemeColors, themeName: ThemeName = 'custom'): void {
  // Ensure all required properties are set
  if (!theme["nav-hover"]) {
    theme["nav-hover"] = shadeColor(theme.navbar, -20);
  }
  if (!theme["nav-active"]) {
    theme["nav-active"] = shadeColor(theme.navbar, -30);
  }
  if (!theme["nav-hover-text"]) {
    theme["nav-hover-text"] = contrastColor(theme["nav-hover"]);
  }
  if (!theme["nav-active-text"]) {
    theme["nav-active-text"] = contrastColor(theme["nav-active"]);
  }
  
  localStorage.setItem('rpgProductivityTheme', JSON.stringify(theme));
  localStorage.setItem('rpgProductivityThemeName', themeName);
  applyTheme(theme);
}

// Initialize theme from localStorage or default
export function initializeTheme(): void {
  const theme = getCurrentTheme();
  applyTheme(theme);
}
