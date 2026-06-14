import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ParticleField component for Three.js background
function ParticleField({ mouse }) {
  const meshRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
      meshRef.current.rotation.x += 0.0002;

      // Mouse parallax
      meshRef.current.rotation.y += (mouse.current.x * 0.3 - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (mouse.current.y * 0.3 - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#6366f1"
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse move listener for parallax
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // GSAP entrance animation (runs after loader)
    if (!prefersReducedMotion) {
      const tl = gsap.timeline({ delay: 2.4 }); // Wait for loader + navbar

      tl.from('.hero-eyebrow', { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: 'power3.out' 
      })
      .from('.hero-line-1 span', { 
        y: '110%', 
        duration: 1, 
        ease: 'power4.out', 
        stagger: 0.05 
      }, '-=0.4')
      .from('.hero-line-2 span', { 
        y: '110%', 
        duration: 1, 
        ease: 'power4.out', 
        stagger: 0.05 
      }, '-=0.7')
      .from('.hero-desc', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8, 
        ease: 'power3.out' 
      }, '-=0.5')
      .from('.hero-cta', { 
        opacity: 0, 
        y: 20, 
        duration: 0.6, 
        ease: 'power3.out' 
      }, '-=0.4');

      // Scroll indicator fade out
      gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '20% top',
          scrub: true
        }
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Helper function to wrap letters in spans
  const wrapLetters = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Three.js Canvas Background */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField mouse={mouseRef} />
      </Canvas>

      {/* Hero Text Layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 2rem'
        }}
      >
        {/* Eyebrow */}
        <div
          className="hero-eyebrow"
          style={{
            fontSize: '0.875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-body)'
          }}
        >
          Frontend Developer · Intern @ Company
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            fontSize: 'clamp(4rem, 10vw, 9rem)'
          }}
        >
          <div className="hero-line-1" style={{ overflow: 'hidden' }}>
            {wrapLetters('Priyanshu')}
          </div>
          <div 
            className="hero-line-2" 
            style={{ overflow: 'hidden', color: 'var(--accent-indigo)' }}
          >
            {wrapLetters('Singh.')}
          </div>
        </h1>

        {/* Description */}
        <p
          className="hero-desc"
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '1.5rem auto 2.5rem',
            lineHeight: 1.7,
            fontFamily: 'var(--font-body)'
          }}
        >
          I craft fast, beautiful interfaces — and I know what's happening on the other side too.
        </p>

        {/* CTA Button */}
        <button
          className="hero-cta"
          style={{
            background: 'var(--accent-indigo)',
            color: 'white',
            border: 'none',
            padding: '0.875rem 2rem',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            cursor: 'none',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 20px 40px rgba(99,102,241,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          See my work ↓
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
