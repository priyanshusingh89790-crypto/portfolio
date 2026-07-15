import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRef = useRef();
  const contentRef = useRef();
  const headingRef = useRef();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Image parallax and entrance
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Paragraph animations - staggered
      gsap.utils.toArray('.about-para').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Stats animation
      gsap.utils.toArray('.stat-item').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          x: -40,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.1 + 0.3,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Accent line animation
      gsap.from('.about-accent-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }, []);

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-1 bg-[var(--accent-indigo)] rounded-full" />
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
            01 — About Me
          </span>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-center">
          
          {/* LEFT SIDE - Image with visual enhancements */}
<div className="relative order-2 lg:order-1">
  {/* Premium Background Glow */}
  <div
    className="absolute -inset-16 rounded-[40px] blur-[90px] pointer-events-none"
    style={{
      background: `
        radial-gradient(circle at 0% 0%, rgba(255,145,210,0.55), transparent 35%),
        radial-gradient(circle at 100% 0%, rgba(255,235,120,0.45), transparent 35%),
        radial-gradient(circle at 0% 100%, rgba(255,170,80,0.45), transparent 35%),
        radial-gradient(circle at 100% 100%, rgba(255,180,220,0.18), transparent 45%)
      `,
      zIndex: 0,
    }}
  />

<div
  ref={imageRef}
  className="relative aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.18)] bg-white"
>
  {/* Background inside container */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        radial-gradient(circle at 0% 0%, rgba(255,120,190,.45), transparent 38%),
        radial-gradient(circle at 100% 0%, rgba(255,236,150,.45), transparent 38%),
        radial-gradient(circle at 0% 100%, rgba(255,170,90,.40), transparent 38%),
        radial-gradient(circle at 100% 100%, rgba(255,185,210,.15), transparent 45%),
        #ffffff
      `,
    }}
  />

  {/* Optional blur for premium look */}
  <div
    className="absolute inset-0"
    style={{
      backdropFilter: "blur(40px)",
    }}
  />

  {/* Your Image */}
  <img
    src="mypic.jpg"
    alt="Priyanshu Singh"
    className="absolute inset-0 w-full h-full object-contain z-10"
  />

  {/* Bottom fade */}
  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

  {/* Badge */}
  <div className="absolute bottom-6 right-6 z-30 rounded-full bg-white/80 backdrop-blur-xl border border-cyan-300/40 px-4 py-2">
    <p className="text-xs font-semibold text-cyan-500">
      Available Now
    </p>
  </div>
</div>

  {/* Floating Stats Card */}
  <div className="absolute -bottom-6 -left-6 z-20 rounded-2xl border border-white/10 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:bg-black/40">
    <div className="space-y-4">
      <div>
        <p className="text-2xl font-bold text-violet-600">5+</p>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Projects Built
        </p>
      </div>

      <div className="h-px w-12 bg-gradient-to-r from-violet-500 to-transparent" />

      <div>
        <p className="text-2xl font-bold text-cyan-500">2026</p>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Certified AI
        </p>
      </div>
    </div>
  </div>
</div>

          {/* RIGHT SIDE - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Main heading */}
            <div>
              <h2
                ref={headingRef}
                className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] text-[var(--text-primary)] mb-6"
              >
                Product-focused developer crafting seamless digital experiences.
              </h2>
              <div className="about-accent-line h-1 w-16 bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-cyan)] rounded-full" />
            </div>

            {/* Professional intro paragraph - highlighted */}
            <div className="p-6 rounded-2xl border border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.05)] backdrop-filter backdrop-blur-sm">
              <p className="text-[var(--text-primary)] text-base leading-[1.8] font-medium">
                I'm a <span className="text-[var(--accent-indigo)] font-semibold">Frontend Developer</span> at EWHENT, 
                specializing in building production-grade applications. My focus: turning complex product flows into intuitive, 
                pixel-perfect interfaces that users love.
              </p>
            </div>

            {/* Main body paragraphs */}
            <div className="space-y-6">
              <p className="about-para text-[var(--text-secondary)] leading-[1.8] text-base">
                Currently designing and building the complete UI/UX for enterprise ERP systems — from architecture planning 
                to pixel-perfect delivery. I own the entire product flow across multiple client-facing modules: dashboards, 
                inventory management, billing systems, and role-based user management.
              </p>

              <p className="about-para text-[var(--text-secondary)] leading-[1.8] text-base">
                What sets me apart: I don't just build interfaces. I architect state management from scratch, integrate 
                complex REST API flows, and ensure every data transfer is predictable and traceable. Working alongside backend 
                engineers means I think in data flows, not just components.
              </p>

              <p className="about-para text-[var(--text-secondary)] leading-[1.8] text-base">
                Beyond React: I hold a Prompt Engineering certificate, giving me the ability to leverage AI strategically in 
                development workflows. I approach tools — whether code editors, LLMs, or design systems — with the same 
                precision I apply to building products.
              </p>

              <p className="about-para text-[var(--text-secondary)] leading-[1.8] text-base">
                When I'm not building, I'm obsessed with understanding what makes great interfaces feel effortless. 
                That intersection of technical depth and user-centric design is where I thrive.
              </p>
            </div>

            {/* Tech stack badges */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-4">
                Core Stack
              </p>
              <div className="flex flex-wrap gap-3">
                {['React', 'TypeScript', 'Redux', 'REST APIs', 'Tailwind CSS', 'Node.js'].map((tech) => (
                  <div
                    key={tech}
                    className="px-4 py-2 rounded-full border border-[var(--accent-indigo)] bg-[rgba(99,102,241,0.1)] text-[var(--accent-indigo)] text-xs font-semibold hover:border-[var(--accent-cyan)] hover:bg-[rgba(34,211,238,0.1)] hover:text-[var(--accent-cyan)] transition-all duration-300"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA with status badge */}
            <div className="pt-4 flex items-center gap-4">
              <div className="inline-flex items-center gap-2 bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] rounded-full py-3 px-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-cyan)]" />
                </span>
                <span className="text-[var(--text-primary)] text-sm font-semibold">
                  Available for New Projects
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent divider */}
        <div className="mt-24 pt-12 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-indigo)] via-transparent to-transparent" />
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold whitespace-nowrap">
              Building Next
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-[var(--accent-cyan)] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}