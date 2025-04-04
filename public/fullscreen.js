// This script helps enhance fullscreen mode on various browsers
document.addEventListener('DOMContentLoaded', function() {
  // Only run in standalone mode (when app is installed)
  if (window.matchMedia('(display-mode: fullscreen)').matches || 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true) {
    
    // Try to enter programmatic fullscreen on interaction
    document.addEventListener('click', requestFullscreen, { once: true });
    
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

    // Support for older browsers
    if (document.documentElement.requestFullscreen) {
      document.documentElement.addEventListener('touchend', function() {
        if (!document.fullscreenElement && !document.documentHidden) {
          requestFullscreen();
        }
      });
    }
  }
});

// Try different fullscreen approaches
function requestFullscreen() {
  const elem = document.documentElement;
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  } else if (elem.webkitEnterFullscreen) { /* iOS Safari */
    elem.webkitEnterFullscreen();
  }
  
  // Optionally lock to portrait orientation if supported
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(function() {
      // Silently fail if not supported
    });
  }
} 