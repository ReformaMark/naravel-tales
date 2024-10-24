import { useEffect, RefObject } from 'react';

export function useParallax(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (ref.current) {
        const sections = ref.current.querySelectorAll('.parallax-section');
        sections.forEach((section, index) => {
          const speed = 0.1 + (index * 0.05);
          const yPos = -(scrolled * speed);
          (section as HTMLElement).style.transform = `translateY(${yPos}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);
}