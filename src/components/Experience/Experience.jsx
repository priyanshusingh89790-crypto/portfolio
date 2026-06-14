import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const timelineRef = useRef(null);

  const timeline = [
    {
      year: "2024 – Present",
      role: "Frontend Developer Intern",
      company: "Current Company",
      description: "Building ERP-style applications from scratch. Set up Redux state management, integrated REST APIs end-to-end, and delivered production-ready features in a team environment.",
      tags: ["React", "Redux", "REST API", "ERP"]
    },
    {
      year: "2023",
      role: "Prompt Engineering",
      company: "Certificate Program",
      description: "Completed a certified course in Prompt Engineering — learning to design precise, structured prompts for large language models across different domains.",
      tags: ["AI", "LLMs", "Prompt Design"]
    }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Animate timeline line
      gsap.from('.timeline-line', {
        height: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        }
      });

      // Animate each timeline item
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }
  }, []);

  return (
    <section id="experience" ref={timelineRef} style={{ position: 'relative' }}>
      <span className="section-label">04 — Experience</span>
      <h2>Where I've been</h2>

      <div style={{ position: 'relative', padding: '2rem 0' }}>
        {/* Center timeline line */}
        <div
          className="timeline-line"
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'var(--border-glass)',
            transform: 'translateX(-50%)'
          }}
        />

        {timeline.map((item, index) => (
          <div
            key={index}
            className="timeline-item"
            style={{
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
              marginBottom: '4rem',
              position: 'relative'
            }}
          >
            {/* Content */}
            <div
              style={{
                width: '45%',
                padding: index % 2 === 0 ? '0 3rem 0 0' : '0 0 0 3rem',
                textAlign: index % 2 === 0 ? 'right' : 'left'
              }}
            >
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '0.5rem'
                }}
              >
                {item.year}
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}
              >
                {item.role}
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1rem'
                }}
              >
                {item.company}
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '1rem'
                }}
              >
                {item.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--accent-indigo)44',
                      color: 'var(--accent-indigo)',
                      background: 'var(--accent-indigo)11'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--accent-indigo)',
                border: '3px solid var(--bg-primary)',
                zIndex: 1
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
