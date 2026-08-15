import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;

    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.1, ease: 'power3.out' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.1, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xDot(e.clientX - 4);
      yDot(e.clientY - 4);
      xRing(e.clientX - 20);
      yRing(e.clientY - 20);
    };

    const handleMouseEnter = () => {
      gsap.to(ring, { scale: 1.8, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

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
      {/* Solid dot — mix-blend-mode: difference for instant auto-invert */}
      <div
        ref={dotRef}
        className="custom-cursor fixed top-0 left-0 w-2 h-2 rounded-full z-[9999] pointer-events-none"
        style={{ backgroundColor: '#ffffff', mixBlendMode: 'difference' }}
      />
      {/* Ring — border only, mix-blend-mode: difference same as dot */}
      <div
        ref={ringRef}
        className="custom-cursor fixed top-0 left-0 w-10 h-10 border-[1.5px] rounded-full z-[9999] pointer-events-none bg-transparent"
        style={{ borderColor: '#ffffff', mixBlendMode: 'difference' }}
      />
    </>
  );
}
