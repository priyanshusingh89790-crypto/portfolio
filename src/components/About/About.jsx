import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      gsap.utils.toArray('.about-para').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }
  }, []);

  return (
    <section id="about" style={{ position: 'relative' }}>
      <div
        className="about-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '6rem',
          alignItems: 'start'
        }}
      >
        {/* Left column - pinned */}
        <div className="about-sticky" style={{ position: 'sticky', top: '30vh' }}>
          <span className="section-label">01 — About</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: '1.5rem'
            }}
          >
            Building things that work — and look like they do.
          </h2>
          <div
            style={{
              width: '3px',
              height: '60px',
              background: 'var(--accent-indigo)',
              marginTop: '1.5rem'
            }}
          />
        </div>

        {/* Right column - scrollable content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <p className="about-para" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
            I'm a frontend developer currently interning and building complex ERP-style systems from
            scratch. Not just the UI — I set up the entire Redux architecture, wired it to REST APIs,
            and made sure every state update is predictable and traceable.
          </p>

          <p className="about-para" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
            Working alongside backend engineers taught me to think in data flows, not just components.
            I can read an API contract, spot a mismatch, and debug it before it becomes someone else's problem.
          </p>

          <p className="about-para" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
            I also hold a Prompt Engineering certificate — which means I think about how to communicate
            with AI tools the way I think about code: precisely, intentionally, and with a clear output in mind.
          </p>

          <p className="about-para" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
            When I'm not building, I'm studying what makes great interfaces feel effortless. That
            curiosity is what brings me here.
          </p>

          {/* Available for work badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.5rem 1.25rem',
              alignSelf: 'flex-start',
              marginTop: '1rem'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                background: '#22d3ee',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}
            />
            <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
              Available for opportunities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
