import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(loaderRef.current, { 
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => {
              loaderRef.current.style.display = 'none';
              if (onComplete) onComplete();
            }
          });
        }
      });

      tl.to(progressRef.current, {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: function() {
          counterRef.current.textContent = Math.round(this.progress() * 100) + '%';
        }
      });

      tl.to(logoRef.current, { 
        scale: 1.2, 
        opacity: 0, 
        duration: 0.4, 
        ease: 'power2.in' 
      }, '-=0.2');
    } else {
      // Skip animation for reduced motion
      loaderRef.current.style.display = 'none';
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-[var(--bg-primary)] flex flex-col items-center justify-center"
    >
      <div
        ref={logoRef}
        className="font-[family-name:var(--font-display)] text-[4rem] font-extrabold text-[var(--accent-indigo)] mb-8"
      >
        PS
      </div>
      
      <div
        ref={progressRef}
        className="w-[200px] h-[2px] bg-[var(--border-glass)] rounded-[2px] overflow-hidden mb-4"
      >
        <div
          className="w-0 h-full bg-[var(--accent-indigo)]"
        />
      </div>

      <div
        ref={counterRef}
        className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-body)]"
      >
        0%
      </div>
    </div>
  );
}
