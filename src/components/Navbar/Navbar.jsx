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
      className={`fixed top-0 left-0 right-0 z-[100] py-6 px-12 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-[rgba(8,8,16,0.8)] backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div
        className="nav-item font-[family-name:var(--font-display)] font-extrabold text-xl text-[var(--accent-indigo)]"
      >
        PS.
      </div>

      <div className="flex gap-8 items-center">
        <a
          href="#projects"
          className="nav-item text-[var(--text-primary)] no-underline text-[0.9rem] font-[family-name:var(--font-body)] transition-colors duration-300 hover:text-[var(--accent-indigo)]"
        >
          Work
        </a>
        <a
          href="#skills"
          className="nav-item text-[var(--text-primary)] no-underline text-[0.9rem] font-[family-name:var(--font-body)] transition-colors duration-300 hover:text-[var(--accent-indigo)]"
        >
          Skills
        </a>
        <a
          href="#about"
          className="nav-item text-[var(--text-primary)] no-underline text-[0.9rem] font-[family-name:var(--font-body)] transition-colors duration-300 hover:text-[var(--accent-indigo)]"
        >
          About
        </a>
        <a
          href="#contact"
          className="nav-item text-[var(--text-primary)] no-underline text-[0.9rem] font-[family-name:var(--font-body)] transition-colors duration-300 hover:text-[var(--accent-indigo)]"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
