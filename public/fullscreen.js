// This script helps enhance PWA behavior on various browsers
document.addEventListener('DOMContentLoaded', function() {
  // Only run in standalone mode (when app is installed)
  if (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true) {
    
    // Prevent default touch behaviors that might interfere with app-like experience
    document.addEventListener('touchmove', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault(); // Prevent pinch zoom
      }
    }, { passive: false });
    
    // Prevent pull-to-refresh
    document.body.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1 && e.touches[0].clientY < 10) {
        e.preventDefault();
      }
    }, { passive: false });

    // Optionally lock to portrait orientation if supported
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait').catch(function() {
        // Silently fail if not supported
      });
    }
  }
}); 