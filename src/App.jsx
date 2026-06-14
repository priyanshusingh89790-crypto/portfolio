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
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';

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
          <Navbar />
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Contact />
          <AudioPlayer />
        </div>
      )}
      <Loader onComplete={() => setLoaderComplete(true)} />
    </div>
  );
}

export default App;
