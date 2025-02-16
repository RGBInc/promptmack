import { useEffect, useRef } from 'react';

type ScrollToBottomReturn<T> = [React.RefObject<T>, React.RefObject<HTMLDivElement>];

export function useScrollToBottom<T extends HTMLElement>(): ScrollToBottomReturn<T> {
  const containerRef = useRef<T>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastUserInteractionRef = useRef<number>(Date.now());
  const lastContentHeightRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver((mutations) => {
      const currentHeight = container.scrollHeight;
      const timeSinceLastInteraction = Date.now() - lastUserInteractionRef.current;
      const isNewContent = currentHeight > lastContentHeightRef.current;

      // Only auto-scroll if:
      // 1. This is new content (height increased)
      // 2. User hasn't interacted with the scroll in the last 2 seconds
      // 3. We're already near the bottom (within 100px)
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNewContent && (timeSinceLastInteraction > 2000 || isNearBottom)) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('wheel', handleScroll);
    container.addEventListener('touchmove', handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return [containerRef, bottomRef];
}
