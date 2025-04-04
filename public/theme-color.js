// Script to update theme-color based on system preferences
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for the DOM to be fully styled
  setTimeout(() => {
    // Set up dark mode detection from system
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set theme color based on current preference and app state
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (prefersDarkScheme.matches && !document.documentElement.classList.contains('light'));
    updateThemeColor(isDarkMode);
    
    // Listen for changes in color scheme preference
    prefersDarkScheme.addEventListener('change', (event) => {
      // Only update if the app doesn't override the system preference
      if (!document.documentElement.classList.contains('dark') && 
          !document.documentElement.classList.contains('light')) {
        updateThemeColor(event.matches);
      }
    });
    
    // Listen for theme changes in the app (could be manual toggle)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          updateThemeColor(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }, 200);
  
  function updateThemeColor(isDarkMode) {
    // Sample the actual background color directly from the body
    const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
    console.log('Sampled background color:', bodyBgColor);
    
    // If we can get the color from the DOM, use it; otherwise use our predetermined values
    let themeColor;
    
    if (bodyBgColor && bodyBgColor !== 'rgba(0, 0, 0, 0)' && bodyBgColor !== 'transparent') {
      themeColor = bodyBgColor;
    } else {
      // Fallback to our hardcoded values
      // From --background: 240 10% 3.9% (HSL) in dark mode
      themeColor = isDarkMode ? '#121212' : '#ffffff';
    }
    
    // Ensure it's in hex format for the theme-color meta tag if it's in RGB/RGBA format
    if (themeColor.startsWith('rgb')) {
      themeColor = rgbToHex(themeColor);
    }
    
    console.log('Using theme color:', themeColor);
    
    // Update meta tags
    const themeMetaTags = document.querySelectorAll('meta[name="theme-color"]');
    
    // If there are multiple theme-color meta tags with media queries, they'll handle this automatically
    // For browsers that don't support media queries in meta tags, we'll update the first one
    if (themeMetaTags.length === 1 || !themeMetaTags[0].hasAttribute('media')) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
    }
    
    // Also update the media query ones to match exactly what we detected
    themeMetaTags.forEach(tag => {
      const media = tag.getAttribute('media');
      if ((media && media.includes('dark') && isDarkMode) ||
          (media && media.includes('light') && !isDarkMode)) {
        tag.setAttribute('content', themeColor);
      }
    });
    
    // Try to update the manifest.json theme color via localStorage
    try {
      localStorage.setItem('app-theme-preference', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('app-theme-color', themeColor);
    } catch {
      // Silently fail if localStorage is not available
    }
  }
  
  // Helper function to convert RGB to hex
  function rgbToHex(rgb) {
    // Extract the rgb values
    const parts = rgb.match(/\d+/g);
    if (!parts || parts.length < 3) {
      return '#121212'; // Fallback dark color
    }
    
    // Convert to hex
    const r = parseInt(parts[0]);
    const g = parseInt(parts[1]);
    const b = parseInt(parts[2]);
    
    return '#' + 
      (r < 16 ? '0' : '') + r.toString(16) +
      (g < 16 ? '0' : '') + g.toString(16) +
      (b < 16 ? '0' : '') + b.toString(16);
  }
}); 