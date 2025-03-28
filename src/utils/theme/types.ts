
import { StatName } from "../../types/character";

// Define available themes
export type ThemeName = "default" | "forest" | "ocean" | "barbie" | "royal" | "custom";

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
