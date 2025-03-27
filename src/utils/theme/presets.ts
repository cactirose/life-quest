import { ThemeName, ThemeColors } from "./types";

// Preset themes
export const THEME_PRESETS: Record<ThemeName, ThemeColors> = {
  default: {
    primary: "#D2B48C",      // Tan
    secondary: "#3f210e",   // Brown
    background: "#F5F5DC",   // Beige
    accent: "#3A1F0E",       // Dark brown
    text: "#3f210e",         // Dark text
    parchment: "#FFF8DC",    // Light cream background
    positive: "#3A1F0E",     // Dark brown
    negative: "#B22222",     // Firebrick
    purple: "#8B5CF6",       // Purple for boss quests
    navbar: "#3f210e",       // Dark brown for navbar
    "nav-hover": "#3A1F0E",  // Hover color
    "nav-active": "#3A1F0E", // Active color
    "nav-hover-text": "#FFF8DC", // Same text color on hover as normal
    "nav-active-text": "#FFF8DC", // White text on dark active
    brown: "#3f210e",        // Dark brown for text and buttons
  },
  forest: {
    primary: "#8FBC8F",      // Dark sea green
    secondary: "#2E8B57",    // Sea green
    background: "#F0FFF0",   // Honeydew
    accent: "#556B2F",       // Dark olive green
    text: "#2E4A2E",         // Dark forest text
    parchment: "#F0FFF0",    // Light forest background
    positive: "#32CD32",     // Lime green
    negative: "#8B0000",     // Dark red
    purple: "#9C27B0",       // Purple for boss quests
    navbar: "#2E8B57",       // Navbar green
    "nav-hover": "#1A5D38",  // Darker green for hover
    "nav-active": "#1A5D38", // Active state
    "nav-hover-text": "#F0FFF0", // Keep the same text color on hover
    "nav-active-text": "#F0FFF0", // Keep the same text color on active
    brown: "#2E4A2E",        // Dark forest green for text and buttons
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
    "nav-hover-text": "#F0F8FF", // Keep the same text color on hover
    "nav-active-text": "#F0F8FF"  // Keep the same text color on active
  },
  sunset: {
    primary: "#FFA07A",      // Light salmon
    secondary: "#CD5C5C",    // Indian red
    background: "#FFF0F5",   // Lavender blush
    accent: "#FF6347",       // Tomato
    text: "#3F210E",         // Saddle brown
    parchment: "#FFEFD5",    // Papaya whip
    positive: "#32CD32",     // Lime green
    negative: "#8B0000",     // Dark red
    purple: "#9C27B0",       // Purple for boss quests
    navbar: "#CD5C5C",       // Navbar red
    "nav-hover": "#B13E3E",  // Darker red for hover
    "nav-active": "#B13E3E", // Active state
    "nav-hover-text": "#FFF0F5", // Keep the same text color on hover
    "nav-active-text": "#FFF0F5"  // Keep the same text color on active
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
    "nav-hover-text": "#F3E5F5", // Keep the same text color on hover
    "nav-active-text": "#F3E5F5"  // Keep the same text color on active
  },
  custom: {
    primary: "#D2B48C",      // Default values that will be overridden
    secondary: "#3F210E",
    background: "#F5F5DC",
    accent: "#3A1F0E",
    text: "#3A3124",
    parchment: "#FFF8DC",
    positive: "#3A1F0E",
    negative: "#B22222",
    purple: "#8B5CF6",
    navbar: "#3F210E",
    "nav-hover": "#3A1F0E",
    "nav-active": "#3A1F0E",
    "nav-hover-text": "#F5F5DC", // Light text for custom theme hover
    "nav-active-text": "#F5F5DC"  // Light text for custom theme active
  }
};
