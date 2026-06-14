import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const projects = [
    {
      id: 1,
      title: "ERP System",
      description: "Built a full-scale ERP platform from scratch during internship. Set up Redux architecture, integrated REST APIs, and created dashboards for real business workflows.",
      tech: ["React", "Redux", "REST API", "Tailwind CSS"],
      color: "#6366f1",
      image: "/images/project-erp.png",
      link: "#"
    },
    {
      id: 2,
      title: "Project Two",
      description: "Replace this with your actual project description. Keep it to 2 lines max.",
      tech: ["React", "JavaScript", "CSS"],
      color: "#22d3ee",
      image: "/images/project-2.png",
      link: "#"
    },
    {
      id: 3,
      title: "Project Three",
      description: "Replace this with your actual project description. Keep it to 2 lines max.",
      tech: ["TypeScript", "Tailwind", "API"],
      color: "#a78bfa",
      image: "/images/project-3.png",
      link: "#"
    }
  ];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && !isMobile) {
      const totalWidth = trackRef.current.scrollWidth - window.innerWidth + (3 * 16);

      gsap.to(trackRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stickyRef.current,
          onUpdate: (self) => {
            progressRef.current.style.width = (self.progress * 100) + '%';
          }
        }
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  function ProjectCard({ project }) {
    const cardRef = useRef();
    const imgRef = useRef();

    const onEnter = () => gsap.to(imgRef.current, { scale: 1.06, duration: 0.6, ease: 'power2.out' });
    const onLeave = () => gsap.to(imgRef.current, { scale: 1.0, duration: 0.6, ease: 'power2.out' });

    return (
      <div
        ref={cardRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          flexShrink: 0,
          width: 'min(80vw, 760px)',
          height: '75vh',
          borderRadius: 'var(--radius-card)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'none'
        }}
      >
        {/* Image — fills top 60% of card */}
        <div style={{ height: '60%', overflow: 'hidden' }}>
          <img
            ref={imgRef}
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center' }}
            onError={(e) => { e.target.style.background = project.color; e.target.style.opacity = 0.3; }}
          />
        </div>

        {/* Card content — bottom 40% */}
        <div style={{ padding: '1.75rem 2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {project.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {project.tech.map(t => (
              <span key={t} style={{
                fontSize: '0.75rem', padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${project.color}44`,
                color: project.color,
                background: `${project.color}11`
              }}>{t}</span>
            ))}
          </div>
          <a href={project.link} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            View project <span style={{ transition: 'transform 0.3s' }}>→</span>
          </a>
        </div>

        {/* Accent glow at card top edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`
        }} />
      </div>
    );
  }

  if (isMobile) {
    // Mobile: stack vertically
    return (
      <section id="projects" style={{ height: 'auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="section-label">02 — Work</span>
          <h2>Selected Projects</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    );
  }

  // Desktop: horizontal scroll
  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ position: 'relative', height: `${projects.length * 100}vh`, padding: 0 }}
    >
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Section heading — outside the scrolling track */}
        <div className="projects-header" style={{ position: 'absolute', top: '2.5rem', left: '3rem', zIndex: 10 }}>
          <span className="section-label">02 — Work</span>
          <h2 style={{ marginBottom: 0 }}>Selected Projects</h2>
        </div>

        {/* Horizontal track — this is what GSAP moves */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '0 3rem',
            alignItems: 'center',
            height: '100%',
            willChange: 'transform'
          }}
        >
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '3rem', right: '3rem', height: '1px', background: 'var(--border-glass)' }}>
          <div ref={progressRef} style={{ height: '100%', background: 'var(--accent-indigo)', width: '0%', transition: 'none' }} />
        </div>
      </div>
    </section>
  );
}
