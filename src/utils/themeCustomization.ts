
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
}

// Preset themes
export const THEME_PRESETS: Record<ThemeName, ThemeColors> = {
  default: {
    primary: "#D2B48C",      // Tan
    secondary: "#8B4513",    // Brown
    background: "#F5F5DC",   // Beige
    accent: "#6B8E23",       // Olive green
    text: "#3A3124",         // Dark brown
    parchment: "#FFF8DC",    // Cornsilk
    positive: "#4CAF50",     // Green
    negative: "#B22222",     // Firebrick
    purple: "#8B5CF6"        // Purple for boss quests
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
    purple: "#9C27B0"        // Purple for boss quests
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
    purple: "#673AB7"        // Purple for boss quests
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
    purple: "#9C27B0"        // Purple for boss quests
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
    purple: "#6A1B9A"        // Purple for boss quests
  },
  custom: {
    primary: "#D2B48C",      // Default values that will be overridden
    secondary: "#8B4513",
    background: "#F5F5DC",
    accent: "#6B8E23",
    text: "#3A3124",
    parchment: "#FFF8DC",
    positive: "#4CAF50",
    negative: "#B22222",
    purple: "#8B5CF6"        // Purple for boss quests
  }
};

// Function to apply theme to CSS variables
export function applyTheme(theme: ThemeColors): void {
  document.documentElement.style.setProperty('--rpg-tan', theme.primary);
  document.documentElement.style.setProperty('--rpg-brown', theme.secondary);
  document.documentElement.style.setProperty('--rpg-background', theme.background);
  document.documentElement.style.setProperty('--rpg-green', theme.positive);
  document.documentElement.style.setProperty('--rpg-red', theme.negative);
  document.documentElement.style.setProperty('--rpg-parchment', theme.parchment);
  document.documentElement.style.setProperty('--rpg-accent', theme.accent);
  document.documentElement.style.setProperty('--rpg-text', theme.text);
  document.documentElement.style.setProperty('--rpg-purple', theme.purple);
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
  localStorage.setItem('rpgProductivityTheme', JSON.stringify(theme));
  localStorage.setItem('rpgProductivityThemeName', themeName);
  applyTheme(theme);
}

// Initialize theme from localStorage or default
export function initializeTheme(): void {
  const theme = getCurrentTheme();
  applyTheme(theme);
}
