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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        ref={logoRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4rem',
          fontWeight: 800,
          color: 'var(--accent-indigo)',
          marginBottom: '2rem'
        }}
      >
        PS
      </div>
      
      <div
        ref={progressRef}
        style={{
          width: '200px',
          height: '2px',
          background: 'var(--border-glass)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}
      >
        <div
          style={{
            width: '0%',
            height: '100%',
            background: 'var(--accent-indigo)'
          }}
        />
      </div>

      <div
        ref={counterRef}
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)'
        }}
      >
        0%
      </div>
    </div>
  );
}
