import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    year: "JUL 2026 — PRESENT",
    role: "Creative Technology Intern",
    company: "WPP",
    description:
      "Building AI agents, chatbots and intelligent automation systems while creating AI-powered frontend experiences for real production workflows.",
    tags: ["Agentic AI", "LangChain", "n8n", "React", "Next.js", "GSAP"],
  },
  {
    year: "JAN 2026 — JUN 2026",
    role: "Software Engineer Intern",
    company: "EWHENT",
    description:
      "Worked on B2B SaaS, ERP and B2C applications, building dashboards, authentication, inventory, billing and dynamic frontend experiences.",
    tags: [
      "React",
      "Redux",
      "REST APIs",
      "ERP",
      "Jest",
      "React Testing Library",
    ],
  },
];

// Shared card content used in both desktop and mobile layouts
function ExperienceCard({ data, align }) {
  const isRight = align === "right";
  return (
    <>
      <div className={`mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ${isRight ? "text-right" : "text-left"}`}>
        {data.year}
      </div>
      <h3
        className={`mb-3 font-black leading-[0.95] tracking-[-0.035em] text-[clamp(1.4rem,2vw,2.8rem)] text-[#f0ebe3] ${isRight ? "text-right" : "text-left"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {data.role}
      </h3>
      <div className={`mb-4 text-sm font-semibold text-white/40 ${isRight ? "text-right" : "text-left"}`}>
        {data.company}
      </div>
      <p className={`mb-5 max-w-[480px] text-sm leading-7 text-white/55 md:text-base ${isRight ? "ml-auto text-right" : "text-left"}`}>
        {data.description}
      </p>
      <div className={`flex flex-wrap gap-2 ${isRight ? "justify-end" : "justify-start"}`}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/40"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  const dotOneRef = useRef(null);
  const dotTwoRef = useRef(null);

  const itemRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const firstItem = itemRefs.current[0];
      const secondItem = itemRefs.current[1];

      // -----------------------------------
      // INITIAL STATES
      // -----------------------------------

      gsap.set(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      gsap.set([dotOneRef.current, dotTwoRef.current], {
        scale: 0,
        opacity: 0,
      });

      gsap.set(firstItem, {
        opacity: 0,
        x: -60,
      });

      gsap.set(secondItem, {
        opacity: 0,
        x: 60,
      });

      // -----------------------------------
      // MAIN ANIMATION
      // -----------------------------------

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      // Line starts growing from top
      tl.to(lineRef.current, {
        scaleY: 1,
        duration: 2,
        ease: "power2.inOut",
      });

      // First circle appears while line reaches it
      tl.to(
        dotOneRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(2)",
        },
        0.75
      );

      // First experience content
      tl.to(
        firstItem,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.8
      );

      // Second circle
      tl.to(
        dotTwoRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(2)",
        },
        1.55
      );

      // Second experience content
      tl.to(
        secondItem,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        1.6
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-[#080808]
        px-4
        py-20
        text-[#f0ebe3]
        sm:px-10
        lg:px-16
        lg:py-32
        2xl:px-24
      "
    >
      <div className="relative z-10 mx-auto max-w-[1600px]">

        {/* HEADING */}
        <div className="mb-16 lg:mb-20">
          <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.35em]">
            EXPERIENCE
          </span>
          <h2
            className="font-black uppercase tracking-[-0.04em] leading-[0.95] text-[clamp(2.5rem,5vw,6rem)] text-[#f0ebe3]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where I've been{" "}
            <span className="text-[#ef4423]">building.</span>
          </h2>
        </div>

        {/* TIMELINE */}
        {/* Desktop: absolute two-column layout | Mobile: stacked vertical list */}
        <div
          className="relative hidden md:block"
          style={{ minHeight: "700px" }}
        >
          {/* Ghost track */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />

          {/* Animated line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 z-10 h-full w-[2px] -translate-x-1/2 bg-[#ef4423]"
          />

          {/* First dot */}
          <div
            ref={dotOneRef}
            className="absolute left-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ef4423]"
            style={{ top: "28%" }}
          />

          {/* Second dot */}
          <div
            ref={dotTwoRef}
            className="absolute left-1/2 z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ef4423]"
            style={{ top: "72%" }}
          />

          {/* First item — left */}
          <div
            ref={(el) => { itemRefs.current[0] = el; }}
            className="absolute left-0 w-[43%] -translate-y-1/2 pr-12 text-right"
            style={{ top: "28%" }}
          >
            <ExperienceCard data={timelineData[0]} align="right" />
          </div>

          {/* Second item — right */}
          <div
            ref={(el) => { itemRefs.current[1] = el; }}
            className="absolute right-0 w-[43%] -translate-y-1/2 pl-12 text-left"
            style={{ top: "72%" }}
          >
            <ExperienceCard data={timelineData[1]} align="left" />
          </div>
        </div>

        {/* MOBILE: stacked vertical timeline */}
        <div className="md:hidden flex flex-col gap-12 pl-6 border-l-2 border-[#ef4423]/30">
          {timelineData.map((item, i) => (
            <div key={i} className="relative">
              {/* dot */}
              <div className="absolute -left-[1.45rem] top-1 h-5 w-5 rounded-full bg-[#ef4423]" />
              <ExperienceCard data={item} align="left" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}