// Script to update theme-color based on system preferences
document.addEventListener('DOMContentLoaded', function() {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set theme color based on current preference
  updateThemeColor(prefersDarkScheme.matches);
  
  // Listen for changes in color scheme preference
  prefersDarkScheme.addEventListener('change', (event) => {
    updateThemeColor(event.matches);
  });
  
  // Listen for theme changes in the app (could be manual toggle)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' && 
          (document.documentElement.classList.contains('dark') || 
           document.documentElement.classList.contains('light'))) {
        updateThemeColor(document.documentElement.classList.contains('dark'));
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  function updateThemeColor(isDarkMode) {
    // Convert from HSL to hex for theme-color
    let themeColor;
    if (isDarkMode) {
      // Dark mode - actual app background #0e0e11 (240 10% 3.9%)
      themeColor = '#0e0e11';
    } else {
      // Light mode - white
      themeColor = '#ffffff';
    }
    
    // Update meta tags
    const themeMetaTags = document.querySelectorAll('meta[name="theme-color"]');
    
    // If there are multiple theme-color meta tags with media queries, they'll handle this automatically
    // For browsers that don't support media queries in meta tags, we'll update the first one
    if (themeMetaTags.length === 1 || !themeMetaTags[0].hasAttribute('media')) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
    }
    
    // Also try to update the manifest.json theme color via localStorage
    try {
      localStorage.setItem('app-theme-preference', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('app-theme-color', themeColor);
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}); 