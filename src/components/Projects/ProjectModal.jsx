import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(modalRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.15'
    );

    // Subtle image parallax on mouse move
    const handleMouseMove = (e) => {
      if (!imgRef.current) return;
      const rect = modalRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(imgRef.current, {
        x: dx * 12,
        y: dy * 8,
        duration: 0.6,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [project]);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, {
      y: 40, opacity: 0, scale: 0.96,
      duration: 0.35, ease: 'power2.in',
    })
    .to(overlayRef.current, {
      opacity: 0, duration: 0.25,
    }, '-=0.15');
  };

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] border"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-glass)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${project.color}22`,
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px]"
          style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            cursor: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = project.color; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          ✕
        </button>

        {/* Hero image */}
        <div className="w-full h-[280px] md:h-[360px] overflow-hidden rounded-t-[24px]"
          style={{ background: `${project.color}18` }}>
          <img
            ref={imgRef}
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover scale-105"
            style={{ willChange: 'transform' }}
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span
                className="text-xs tracking-[0.2em] uppercase mb-2 block"
                style={{ color: project.color, fontFamily: 'var(--font-body)' }}
              >
                Featured Project
              </span>
              <h2
                className="text-[2rem] md:text-[2.5rem] font-bold leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {project.title}
              </h2>
            </div>

            {/* Live link */}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 text-sm font-semibold py-3 px-5 rounded-full transition-all duration-300 no-underline"
              style={{
                background: project.color,
                color: 'white',
                fontFamily: 'var(--font-body)',
                boxShadow: `0 8px 24px ${project.color}44`,
                cursor: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 32px ${project.color}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px ${project.color}44`; }}
            >
              View Live
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Description */}
          <p
            className="text-base leading-[1.8] mb-8"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', maxWidth: '620px' }}
          >
            {project.longDescription || project.description}
          </p>

          {/* Tech stack */}
          <div>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-3"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
            >
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-sm py-1.5 px-4 rounded-full border font-medium"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
