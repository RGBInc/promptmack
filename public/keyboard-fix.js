// Script to handle mobile keyboard behavior
document.addEventListener('DOMContentLoaded', function() {
  // Only run on mobile devices
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    let originalViewportHeight = window.innerHeight;
    let isKeyboardVisible = false;
    
    // Variables for iOS Safari
    let inputFocused = false;
    let chatContainer = null;
    
    // Initialize after a short delay to ensure DOM is fully loaded
    setTimeout(() => {
      const inputs = document.querySelectorAll('input, textarea');
      chatContainer = document.querySelector('.chat-container');
      
      // Watch for focus events on input fields
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          inputFocused = true;
          document.body.classList.add('keyboard-visible');
          
          // On iOS, create some extra space for the keyboard
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // Scroll to input after a small delay
            setTimeout(() => {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Make sure chat container has proper scroll
              if (chatContainer) {
                chatContainer.style.overflowY = 'auto';
                chatContainer.style.WebkitOverflowScrolling = 'touch';
              }
            }, 300);
          }
        });
        
        input.addEventListener('blur', () => {
          inputFocused = false;
          // Only remove class if keyboard is likely hidden
          setTimeout(() => {
            if (!inputFocused) {
              document.body.classList.remove('keyboard-visible');
              
              // Make sure we scroll back to the messages
              const messagesEnd = document.querySelector('.chat-container > div:last-child');
              if (messagesEnd) {
                messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
              }
            }
          }, 300);
        });
      });
      
      // Add scroll event listeners to ensure smooth chat scrolling
      if (chatContainer) {
        chatContainer.addEventListener('touchstart', function() {
          chatContainer.style.overflowY = 'auto';
        });
      }
    }, 500);
    
    // Watch for resize events (keyboard appearing/disappearing)
    window.addEventListener('resize', function() {
      const viewportHeight = window.innerHeight;
      
      // If the height significantly decreased, keyboard likely appeared
      if (viewportHeight < originalViewportHeight * 0.75 && !isKeyboardVisible) {
        isKeyboardVisible = true;
        document.body.classList.add('keyboard-visible');
        
        // Make sure chat container has proper scroll in keyboard mode
        if (chatContainer) {
          chatContainer.classList.add('momentum-scroll');
        }
      } 
      // If height is back to normal, keyboard likely disappeared
      else if (viewportHeight > originalViewportHeight * 0.9 && isKeyboardVisible) {
        isKeyboardVisible = false;
        document.body.classList.remove('keyboard-visible');
        
        // Scroll to bottom of chat when keyboard closes
        setTimeout(() => {
          const messagesEnd = document.querySelector('.chat-container > div:last-child');
          if (messagesEnd) {
            messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      }
    });
    
    // Add CSS rule for keyboard visibility
    const style = document.createElement('style');
    style.innerHTML = `
      .keyboard-visible .input-container {
        position: sticky;
        bottom: 0;
        z-index: 100;
      }
      
      .keyboard-visible .chat-container {
        padding-bottom: 180px;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      @media screen and (max-height: 600px) {
        .keyboard-visible .chat-container {
          padding-bottom: 250px;
        }
      }
      
      /* Fix scrolling issues */
      .chat-container {
        scroll-behavior: smooth;
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);
  }
}); 