import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const xDot = gsap.quickTo(dotRef.current, 'x', { duration: 0.1, ease: 'power3.out' });
    const yDot = gsap.quickTo(dotRef.current, 'y', { duration: 0.1, ease: 'power3.out' });
    const xRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
    const yRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xDot(e.clientX - 4);
      yDot(e.clientY - 4);
      xRing(e.clientX - 20);
      yRing(e.clientY - 20);
    };

    const handleMouseEnter = () => {
      gsap.to(ringRef.current, {
        scale: 1.8,
        mixBlendMode: 'difference',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        mixBlendMode: 'normal',
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Add hover effects to links and buttons
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 w-2 h-2 bg-[var(--accent-indigo)] rounded-full z-[9998] pointer-events-none"
      />
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 w-10 h-10 border-[1.5px] border-[var(--accent-indigo)] rounded-full z-[9998] pointer-events-none bg-transparent"
      />
    </>
  );
}
