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
    <section id="experience" ref={timelineRef} className="relative">
      <span className="section-label">04 — Experience</span>
      <h2>Where I've been</h2>

      <div className="relative py-8">
        {/* Center timeline line */}
        <div
          className="timeline-line absolute left-1/2 top-0 bottom-0 w-[1px] bg-[var(--border-glass)] -translate-x-1/2"
        />

        {timeline.map((item, index) => (
          <div
            key={index}
            className={`timeline-item flex relative mb-16 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            {/* Content */}
            <div
              className={`w-[45%] ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}
            >
              <div
                className="text-5xl font-extrabold text-[var(--text-muted)] font-[family-name:var(--font-display)] mb-2"
              >
                {item.year}
              </div>
              <div
                className="text-xl font-semibold text-[var(--text-primary)] mb-1"
              >
                {item.role}
              </div>
              <div
                className="text-sm text-[var(--accent-cyan)] mb-4"
              >
                {item.company}
              </div>
              <p
                className="text-sm text-[var(--text-secondary)] leading-[1.7] mb-4"
              >
                {item.description}
              </p>
              <div className={`flex gap-2 flex-wrap ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs py-1 px-3 rounded-[var(--radius-pill)] border border-indigo-500/40 text-[var(--accent-indigo)] bg-indigo-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Center dot */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--accent-indigo)] border-[3px] border-[var(--bg-primary)] z-10"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
