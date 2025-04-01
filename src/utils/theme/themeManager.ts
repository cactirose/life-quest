import { ThemeColors, ThemeName } from "./types";
import { THEME_PRESETS } from "./presets";
import { shadeColor, contrastColor, convertToHSL, lightenColor, ensureReadableText } from "./colorUtils";

// Function to apply theme to CSS variables
export function applyTheme(theme: ThemeColors, themeName: ThemeName = 'default'): void {
  // Set default values for nav-hover and nav-active if not provided
  const navHover = theme["nav-hover"] || shadeColor(theme.navbar, -20);
  const navActive = theme["nav-active"] || shadeColor(theme.navbar, -30);
  
  // Handle text colors based on theme
  let navText, navHoverText, navActiveText;
  if (themeName === 'dark') {
    navText = theme.text;
    navHoverText = theme["nav-hover-text"] || theme.text;
    navActiveText = theme["nav-active-text"] || theme.text;
  } else {
    navText = ensureReadableText(theme.navbar, themeName);
    navHoverText = theme["nav-hover-text"] || theme["nav-text"] || ensureReadableText(navHover, themeName);
    navActiveText = theme["nav-active-text"] || ensureReadableText(navActive, themeName);
  }

  // Handle dark theme class
  if (themeName === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

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
  document.documentElement.style.setProperty('--nav-text', convertToHSL(navText));
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

  // Ensure proper contrast for auth components
  const parchmentColor = theme.parchment || "#FFF8DC";
  const brownColor = theme.secondary || "#3f210e";
  
  document.documentElement.style.setProperty('--rpg-parchment', parchmentColor);
  document.documentElement.style.setProperty('--rpg-brown', brownColor);
  
  // Calculate and set hover/active states
  const darkerBrown = shadeColor(brownColor, -15);
  document.documentElement.style.setProperty('--rpg-brown-dark', darkerBrown);

  if (process.env.NODE_ENV === 'development') {
    console.log('Applying theme:', {
      theme,
      computedStyles: {
        brown: getComputedStyle(document.documentElement)
          .getPropertyValue('--rpg-brown'),
        // ... other colors
      }
    });
  }
}

// Get current theme from localStorage or use default
export function getCurrentTheme(): ThemeColors {
  const savedTheme = localStorage.getItem('rpgProductivityTheme');
  if (savedTheme) {
    return JSON.parse(savedTheme);
  }
  return THEME_PRESETS.default;
}

// Get current theme name from localStorage or use default
export function getCurrentThemeName(): ThemeName {
  return localStorage.getItem('rpgProductivityThemeName') as ThemeName || 'default';
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
  applyTheme(theme, themeName);
}

// Initialize theme from localStorage or default
export function initializeTheme(): void {
  const theme = getCurrentTheme();
  const themeName = localStorage.getItem('rpgProductivityThemeName') as ThemeName || 'default';
  applyTheme(theme, themeName);
}
