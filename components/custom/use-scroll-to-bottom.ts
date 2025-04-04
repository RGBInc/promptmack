import { useEffect, useRef } from 'react';

type ScrollToBottomReturn<T> = [React.RefObject<T>, React.RefObject<HTMLDivElement>];

export function useScrollToBottom<T extends HTMLElement>(): ScrollToBottomReturn<T> {
  const containerRef = useRef<T>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastUserInteractionRef = useRef<number>(Date.now());
  const lastContentHeightRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
      if (bottomRef.current && !isScrollingRef.current) {
        isScrollingRef.current = true;
        bottomRef.current.scrollIntoView({ behavior, block: 'end' });
        
        // Reset scrolling state after animation completes
        setTimeout(() => {
          isScrollingRef.current = false;
        }, behavior === 'smooth' ? 500 : 0);
      }
    };

    const observer = new MutationObserver(() => {
      const currentHeight = container.scrollHeight;
      const timeSinceLastInteraction = Date.now() - lastUserInteractionRef.current;
      const isNewContent = currentHeight > lastContentHeightRef.current;
      
      // Check if scrolled near bottom (within 150px or 25% of container height)
      const bottomThreshold = Math.min(150, container.clientHeight * 0.25);
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < bottomThreshold;
      
      if (isNewContent && (timeSinceLastInteraction > 2000 || isNearBottom)) {
        // Use instant scroll for small changes, smooth for larger ones
        const scrollBehavior = (currentHeight - lastContentHeightRef.current > 200) ? 'smooth' : 'auto';
        scrollToBottom(scrollBehavior);
      }

      lastContentHeightRef.current = currentHeight;
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    const handleScroll = () => {
      lastUserInteractionRef.current = Date.now();
    };
    
    // Handle touch events specifically for mobile
    const handleTouchStart = () => {
      lastUserInteractionRef.current = Date.now();
    };
    
    // Handle orientation changes on mobile
    const handleResize = () => {
      // Short delay to let the resize complete
      setTimeout(() => {
        // If we're already near the bottom, scroll all the way down after resize
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom) {
          scrollToBottom('auto');
        }
      }, 300);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleScroll, { passive: true });
    container.addEventListener('touchmove', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial scroll to bottom
    scrollToBottom('auto');

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchmove', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [containerRef, bottomRef];
}
