export const validateThemeImplementation = () => {
  if (import.meta.env.DEV) {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    
    // Check if any elements are using the default brown color
    const elements = document.querySelectorAll('*');
    const defaultBrown = '#4A2511';
    const defaultTan = '#D2B48C';
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      const borderColor = computedStyle.borderColor;
      
      if (
        backgroundColor === defaultBrown ||
        color === defaultBrown ||
        borderColor === defaultBrown ||
        backgroundColor === defaultTan ||
        color === defaultTan ||
        borderColor === defaultTan
      ) {
        console.warn(
          'Found hardcoded theme color:',
          element,
          {
            backgroundColor,
            color,
            borderColor
          }
        );
      }
    });
  }
}; 