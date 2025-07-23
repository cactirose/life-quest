// Helper function to shade color (darken)
export function shadeColor(color: string, percent: number): string {
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
export function lightenColor(color: string, percent: number): string {
  return shadeColor(color, Math.abs(percent));
}

// Function to determine contrasting text color
export function contrastColor(hex: string): string {
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
export function convertToHSL(hex: string): string {
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

// Function to ensure contrasting text color for specific themes
export function ensureReadableText(hex: string, themeType: string = ''): string {
  // For pink colors in Barbie theme, force white text
  if (themeType === 'barbie') {
    return '#FFFFFF';
  }
  
  // For all other themes, use the normal contrast calculation
  return contrastColor(hex);
}
