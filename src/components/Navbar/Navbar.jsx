import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll listener for backdrop
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Animate in nav items after loader
    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ delay: 2.2 }); // Wait for loader to finish
      tl.from('.nav-item', {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled ? 'rgba(8, 8, 16, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s'
      }}
    >
      <div
        className="nav-item"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.25rem',
          color: 'var(--accent-indigo)'
        }}
      >
        PS.
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a
          href="#projects"
          className="nav-item"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          Work
        </a>
        <a
          href="#skills"
          className="nav-item"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          Skills
        </a>
        <a
          href="#about"
          className="nav-item"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          About
        </a>
        <a
          href="#contact"
          className="nav-item"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
