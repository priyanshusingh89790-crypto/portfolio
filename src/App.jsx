import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

import Loader from './components/Loader/Loader';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

// Sections in DOM order — mark each as light or dark background
const NAV_SECTIONS = [
  { id: 'hero',       label: 'Home',       dark: true  },
  { id: 'about',      label: 'About',      dark: false },
  { id: 'projects',   label: 'Projects',   dark: true  },
  { id: 'skills',     label: 'Skills',     dark: false },
  { id: 'experience', label: 'Experience', dark: false },
  { id: 'contact',    label: 'Contact',    dark: true  },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── Smart Header ──────────────────────────────────────────────────────────────
function Header() {
  // true = dark bg section (white text), false = light bg section (black text)
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    // Track scroll position to add bg blur once we leave the very top
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    // IntersectionObserver — watch each section's top edge crossing 50% viewport
    const observers = NAV_SECTIONS.map(({ id, dark }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsDark(dark);
            setActive(id);
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observers.forEach((obs) => obs && obs.disconnect());
    };
  }, []);

  // ── Derived colours ─────────────────────────────────────────────────────────
  const onHero = active === 'hero';

  // Hero: always transparent, always white — no bg, no blur ever
  // Other sections: bg+blur kicks in once scrolled past 40px
  const textColor      = (onHero || isDark) ? 'rgba(240,235,227,0.75)' : 'rgba(17,17,17,0.75)';
  const textColorFull  = (onHero || isDark) ? 'rgba(240,235,227,1)'    : 'rgba(17,17,17,1)';
  const textColorMuted = (onHero || isDark) ? 'rgba(240,235,227,0.4)'  : 'rgba(17,17,17,0.4)';
  const dividerColor   = (onHero || isDark) ? 'rgba(240,235,227,0.2)'  : 'rgba(17,17,17,0.15)';

  const bgBlur = (!onHero && scrolled) ? 'blur(14px) saturate(1.4)' : 'blur(0px)';
  const bgColor = (!onHero && scrolled)
    ? isDark
      ? 'rgba(8,8,8,0.55)'
      : 'rgba(247,246,242,0.65)'
    : 'transparent';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        fontFamily: 'var(--font-body, monospace)',
        backdropFilter: bgBlur,
        WebkitBackdropFilter: bgBlur,
        background: bgColor,
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, color 0.4s ease',
      }}
    >
      {/* ── Logo ── */}
      <button
        onClick={() => scrollToSection('hero')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', color: textColorFull, fontWeight: 600, transition: 'color 0.4s' }}>
          PS
        </span>
        <span style={{ width: '1.5rem', height: '1px', background: dividerColor, display: 'block', transition: 'background 0.4s' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColorMuted, transition: 'color 0.4s' }}>
          Portfolio — 2026
        </span>
      </button>

      {/* ── Nav ── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {NAV_SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              style={{
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isActive ? textColorFull : textColor,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.4s',
                position: 'relative',
                paddingBottom: '3px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textColorFull)}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? textColorFull : textColor)}
            >
              {label}
              {/* Active underline dot */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#ef4423',
                  display: 'block',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Status ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(52,211,153,0.9)' }} />
          <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: textColor, transition: 'color 0.4s' }}>
            Available
          </span>
        </div>
        <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: textColorMuted, transition: 'color 0.4s' }}>
          INDIA
        </span>
      </div>
    </header>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <div>
      {loaderComplete && (
        <div>
          <CustomCursor />
          <Header />
          {/* Hero has no id set inside its component — add a wrapper */}
          <div id="hero">
            <Hero />
          </div>
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Contact />
          <AudioPlayer />
          <ThemeToggle />
        </div>
      )}
      <Loader onComplete={() => setLoaderComplete(true)} />
    </div>
  );
}

export default App;
