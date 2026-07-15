import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../../utils/projectcontent';
import PenguinWalker from './PenguinWalker';
import ProjectModal from './ProjectModal';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index, onOpen }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Scroll-reveal: staggered slide-up
    gsap.fromTo(
      cardRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        delay: index * 0.12,
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.6, ease: 'power2.out' });
    gsap.to(glowRef.current, { opacity: 1, duration: 0.4 });
  };
  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => onOpen(project)}
      className="group relative rounded-[var(--radius-card)] overflow-hidden border cursor-none"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-glass)',
        backdropFilter: 'blur(12px)',
        willChange: 'transform, opacity',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />

      {/* Glow on hover */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-0 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${project.color}18 0%, transparent 70%)`,
        }}
      />

      {/* Image */}
      <div className="h-[220px] md:h-[260px] overflow-hidden relative">
        <img
          ref={imgRef}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover origin-center"
          style={{ willChange: 'transform' }}
          onError={(e) => {
            e.target.style.background = project.color;
            e.target.style.opacity = '0.25';
          }}
        />
        {/* Image overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.45))' }}
        />

        {/* "Click to view" pill — appears on hover */}
        <div
          className="absolute bottom-3 right-3 text-xs font-semibold py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          style={{
            background: project.color,
            color: 'white',
            fontFamily: 'var(--font-body)',
          }}
        >
          View project ↗
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 md:p-8 relative z-[1]">
        {/* Number */}
        <span
          className="text-[0.7rem] tracking-[0.25em] uppercase mb-1 block"
          style={{ color: project.color, fontFamily: 'var(--font-body)' }}
        >
          {String(index + 1).padStart(2, '0')} — Project
        </span>

        <h3
          className="text-[1.5rem] font-bold mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          {project.title}
        </h3>

        <p
          className="text-[0.875rem] leading-[1.65] mb-5 line-clamp-2"
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {project.description}
        </p>

        {/* Tech chips */}
        <div className="flex gap-2 flex-wrap">
          {project.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[0.72rem] py-[3px] px-3 rounded-full border"
              style={{
                borderColor: `${project.color}44`,
                color: project.color,
                background: `${project.color}11`,
                fontFamily: 'var(--font-body)',
              }}
            >
              {t}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span
              className="text-[0.72rem] py-[3px] px-3 rounded-full border"
              style={{
                borderColor: 'var(--border-glass)',
                color: 'var(--text-muted)',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
              }}
            >
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    // Section heading reveal
    gsap.fromTo(
      headingRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="relative"
        style={{ paddingBottom: '10rem' }} // extra space for penguin
      >
        {/* Heading */}
        <div ref={headingRef} className="mb-16">
          <span className="section-label">02 — Work</span>
          <h2 style={{ marginBottom: 0 }}>Selected Projects</h2>
          <p
            className="mt-3 text-base max-w-[480px]"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            A handful of things I've shipped — click any card to dive in.
          </p>
        </div>

        {/* Project grid — 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projectData.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setActiveProject}
            />
          ))}
        </div>

        {/* Penguin walker — absolute at bottom of section */}
        <div className="relative mt-16 h-[120px] overflow-hidden">
          {/* Ground line */}
          <div
            className="absolute bottom-[6px] left-0 right-0 h-[1px]"
            style={{ background: 'var(--border-glass)' }}
          />
          <PenguinWalker sectionRef={sectionRef} />
        </div>
      </section>

      {/* Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  );
}
