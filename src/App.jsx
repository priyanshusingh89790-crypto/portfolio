import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import components (will be created in subsequent steps)
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

function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });
    
    // Wire Lenis to GSAP ticker
    gsap.ticker.add((time) => { 
      lenis.raf(time * 1000); 
    });
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      {loaderComplete && (
        <div>
          <CustomCursor />
          {/* ── Persistent Header ── */}
          <header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 2.5rem",
              fontFamily: "var(--font-body, monospace)",
              backdropFilter: "blur(0px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,235,227,0.75)", fontWeight: 500 }}>
                PS
              </span>
              <span style={{ width: "1.5rem", height: "1px", background: "rgba(240,235,227,0.2)", display: "block" }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,235,227,0.4)" }}>
                Portfolio — 2026
              </span>
            </div>

            <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              {["Work", "About", "Contact"].map((item) => (
                <button
                  key={item}
                  style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: "12px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(240,235,227,0.6)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 500ms",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "rgba(240,235,227,1)")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(240,235,227,0.6)")}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "rgba(52,211,153,0.9)" }} />
                <span style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,227,0.55)" }}>
                  Available
                </span>
              </div>
              <span style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(240,235,227,0.3)" }}>
                INDIA
              </span>
            </div>
          </header>
          <Hero />
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
