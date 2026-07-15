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
      <div className="marquee-wrapper mb-16">
        <div className="marquee-track animate-[marquee-left_20s_linear_infinite]">
          <span className="marquee-item">React · TypeScript · JavaScript · Tailwind CSS · Redux · REST APIs · Git · React · TypeScript · JavaScript · Tailwind CSS · Redux · REST APIs · Git ·</span>
        </div>
      </div>

      <div className="marquee-wrapper mb-16">
        <div className="marquee-track animate-[marquee-right_25s_linear_infinite]">
          <span className="marquee-item">Prompt Engineering · Figma · HTML5 · CSS3 · Node.js · Firebase · Vite · Prompt Engineering · Figma · HTML5 · CSS3 · Node.js · Firebase · Vite ·</span>
        </div>
      </div>

      {/* Bento skill cards grid */}
      <div
        className="skills-grid grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {skillCards.map((card) => (
          <div
            key={card.title}
            className="skill-card bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-[var(--radius-card)] p-7 backdrop-blur-md transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.accent + '55';
              e.currentTarget.style.boxShadow = `0 0 30px ${card.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="text-3xl mb-3" style={{ color: card.accent }}>{card.icon}</div>
            <h3 className="font-[family-name:var(--font-display)] text-[1.1rem] font-semibold mb-4">{card.title}</h3>
            <ul className="list-none flex flex-col gap-[0.4rem]">
              {card.items.map(item => (
                <li key={item} className="text-[0.85rem] text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: card.accent }} />
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
