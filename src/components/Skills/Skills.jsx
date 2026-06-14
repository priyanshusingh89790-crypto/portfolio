import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.7,
          ease: 'power3.out',
          delay: (i % 3) * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }
  }, []);

  const skillCards = [
    {
      title: "Frontend",
      icon: "⬡",
      accent: "#6366f1",
      items: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"]
    },
    {
      title: "State & Data",
      icon: "◈",
      accent: "#22d3ee",
      items: ["Redux", "Context API", "REST APIs", "Async/Await", "Axios"]
    },
    {
      title: "Tools",
      icon: "◉",
      accent: "#a78bfa",
      items: ["Git", "GitHub", "Vite", "VS Code", "Figma (basic)", "Postman"]
    },
    {
      title: "AI & Prompting",
      icon: "◎",
      accent: "#f472b6",
      items: ["Prompt Engineering (Certified)", "ChatGPT", "Claude", "Windsurf"]
    },
    {
      title: "Learning",
      icon: "◌",
      accent: "#fb923c",
      items: ["Next.js", "Node.js", "Express", "Docker basics"]
    },
    {
      title: "Soft Skills",
      icon: "◐",
      accent: "#34d399",
      items: ["ERP System Design", "API Integration", "Team Collaboration", "Problem Solving"]
    }
  ];

  return (
    <section id="skills">
      <span className="section-label">03 — Skills</span>
      <h2>What I work with</h2>

      {/* Marquee rows */}
      <div className="marquee-wrapper" style={{ marginBottom: '4rem' }}>
        <div className="marquee-track" style={{ animation: 'marquee-left 20s linear infinite' }}>
          <span className="marquee-item">React · TypeScript · JavaScript · Tailwind CSS · Redux · REST APIs · Git · React · TypeScript · JavaScript · Tailwind CSS · Redux · REST APIs · Git ·</span>
        </div>
      </div>

      <div className="marquee-wrapper" style={{ marginBottom: '4rem' }}>
        <div className="marquee-track" style={{ animation: 'marquee-right 25s linear infinite' }}>
          <span className="marquee-item">Prompt Engineering · Figma · HTML5 · CSS3 · Node.js · Firebase · Vite · Prompt Engineering · Figma · HTML5 · CSS3 · Node.js · Firebase · Vite ·</span>
        </div>
      </div>

      {/* Bento skill cards grid */}
      <div
        className="skills-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}
      >
        {skillCards.map((card) => (
          <div
            key={card.title}
            className="skill-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-card)',
              padding: '1.75rem',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.3s, box-shadow 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.accent + '55';
              e.currentTarget.style.boxShadow = `0 0 30px ${card.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem', color: card.accent }}>{card.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{card.title}</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {card.items.map(item => (
                <li key={item} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: card.accent, flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
