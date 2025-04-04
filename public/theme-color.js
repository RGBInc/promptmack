// Script to update theme-color based on system preferences
document.addEventListener('DOMContentLoaded', function() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set theme color based on current preference
  updateThemeColor(prefersDarkScheme.matches);
  
  // Listen for changes in color scheme preference
  prefersDarkScheme.addEventListener('change', (event) => {
    updateThemeColor(event.matches);
  });
  
  function updateThemeColor(isDarkMode) {
    // Update theme-color for status bar
    const themeMetaTags = document.querySelectorAll('meta[name="theme-color"]');
    const lightColor = '#ffffff';
    const darkColor = '#1f2937';
    
    // If there are multiple theme-color meta tags with media queries, they'll handle this automatically
    // For browsers that don't support media queries in meta tags, we'll update the first one
    if (themeMetaTags.length === 1 || !themeMetaTags[0].hasAttribute('media')) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? darkColor : lightColor);
    }
    
    // Also try to update the manifest.json theme color via localStorage
    try {
      localStorage.setItem('app-theme-preference', isDarkMode ? 'dark' : 'light');
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}); 