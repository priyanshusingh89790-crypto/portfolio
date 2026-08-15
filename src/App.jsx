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
  { id: 'experience', label: 'Experience', dark: true  },
  { id: 'contact',    label: 'Contact',    dark: true  },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── Smart Header ──────────────────────────────────────────────────────────────
function Header() {
  const [isDark, setIsDark]     = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // ── Scroll-position based section detection ──────────────────────────────
    // Works for any section height, including 400vh monsters like Projects/Hero.
    const detectSection = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      // Walk sections from bottom to top — first one whose top is above
      // the middle of the viewport wins.
      const midpoint = scrollY + window.innerHeight * 0.4;

      let currentId   = NAV_SECTIONS[0].id;
      let currentDark = NAV_SECTIONS[0].dark;

      for (const { id, dark } of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (midpoint >= top) {
          currentId   = id;
          currentDark = dark;
        }
      }

      setActive(currentId);
      setIsDark(currentDark);
    };

    detectSection(); // run once on mount
    window.addEventListener('scroll', detectSection, { passive: true });
    window.addEventListener('resize', detectSection, { passive: true });
    return () => {
      window.removeEventListener('scroll', detectSection);
      window.removeEventListener('resize', detectSection);
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Derived colours ─────────────────────────────────────────────────────────
  const onHero = active === 'hero';

  const textColor      = (onHero || isDark) ? 'rgba(240,235,227,0.75)' : 'rgba(17,17,17,0.75)';
  const textColorFull  = (onHero || isDark) ? 'rgba(240,235,227,1)'    : 'rgba(17,17,17,1)';
  const textColorMuted = (onHero || isDark) ? 'rgba(240,235,227,0.4)'  : 'rgba(17,17,17,0.4)';
  const dividerColor   = (onHero || isDark) ? 'rgba(240,235,227,0.2)'  : 'rgba(17,17,17,0.15)';
  const hamburgerColor = (onHero || isDark) ? '#f0ebe3'                : '#111111';

  const bgBlur  = (!onHero && scrolled) ? 'blur(14px) saturate(1.4)' : 'blur(0px)';
  const bgColor = (!onHero && scrolled)
    ? isDark ? 'rgba(8,8,8,0.55)' : 'rgba(247,246,242,0.65)'
    : 'transparent';

  // Mobile menu bg always solid so it's readable
  const mobileBg = isDark ? 'rgba(8,8,8,0.96)' : 'rgba(247,246,242,0.97)';

  const handleNavClick = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          fontFamily: 'var(--font-body, monospace)',
          backdropFilter: bgBlur,
          WebkitBackdropFilter: bgBlur,
          background: bgColor,
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => handleNavClick('hero')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          <span style={{ fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', color: textColorFull, fontWeight: 600, transition: 'color 0.4s',  color: "#ff4d2e" }}>
            PS
          </span>
          <span className="hidden sm:block" style={{ width: '1.5rem', height: '1px', background: dividerColor, transition: 'background 0.4s' }} />
          <span className="hidden md:block" style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColorMuted, transition: 'color 0.4s' }}>
            Portfolio — 2026
          </span>
        </button>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 'clamp(0.75rem, 1.5vw, 2rem)' }}>
          {NAV_SECTIONS.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                style={{
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: 'clamp(9px, 1vw, 11px)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: isActive ? textColorFull : textColor,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.4s',
                  position: 'relative',
                  paddingBottom: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textColorFull)}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? textColorFull : textColor)}
              >
                {label}
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

        {/* ── Right side: status + hamburger ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Status — desktop only */}
          <div className="hidden sm:flex" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
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

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-[5px]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: hamburgerColor,
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: hamburgerColor,
              transition: 'opacity 0.3s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '22px', height: '1.5px',
              background: hamburgerColor,
              transition: 'transform 0.3s, opacity 0.3s',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 199,
          background: mobileBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          display: menuOpen ? 'flex' : 'none',
        }}
      >
        {NAV_SECTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: isActive ? '#ef4423' : textColorFull,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </button>
          );
        })}

        {/* Available status in drawer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(52,211,153,0.9)' }} />
          <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: textColorMuted }}>
            Available — India
          </span>
        </div>
      </div>
    </>
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
