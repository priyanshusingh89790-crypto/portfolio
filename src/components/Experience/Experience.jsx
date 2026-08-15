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
        px-6
        py-24
        text-[#f0ebe3]
        sm:px-10
        lg:px-16
        lg:py-32
      "
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* =====================================
            HEADING
        ====================================== */}

        <div className="mb-20">
          <span
            className="
              mb-5
              block
              text-[10px]
              font-bold
              uppercase
              tracking-[0.35em]
              text-[#ef4423]
            "
          >
            04 — EXPERIENCE
          </span>

          <h2
            className="
              font-black
              uppercase
              tracking-[-0.04em]
              leading-[0.95]
              text-[clamp(2.5rem,5vw,6rem)]
              text-[#f0ebe3]
            "
            style={{
              fontFamily: "var(--font-display)",
            }}
          >
            Where I've been{" "}
            <span className="text-[#ef4423]">building.</span>
          </h2>
        </div>

        {/* =====================================
            TIMELINE
        ====================================== */}

        <div
          className="relative"
          style={{
            minHeight: "700px",
          }}
        >
          {/* ---------------------------------
              BACKGROUND TIMELINE LINE
          ---------------------------------- */}

          <div
            className="
              absolute
              left-1/2
              top-0
              h-full
              w-px
              -translate-x-1/2
              bg-white/10
            "
          />

          {/* ---------------------------------
              ANIMATED ORANGE LINE
          ---------------------------------- */}

          <div
            ref={lineRef}
            className="
              absolute
              left-1/2
              top-0
              z-10
              h-full
              w-[2px]
              -translate-x-1/2
              bg-[#ef4423]
            "
          />

          {/* =================================
              FIRST EXPERIENCE DOT
          ================================== */}

          <div
            ref={dotOneRef}
            className="
              absolute
              left-1/2
              z-30
              h-6
              w-6
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border-[5px]
              border-[#f7f6f2]
              bg-[#ef4423]
              shadow-[0_0_0_1px_rgba(239,68,35,0.2)]
            "
            style={{
              top: "28%",
            }}
          />

          {/* =================================
              SECOND EXPERIENCE DOT
          ================================== */}

          <div
            ref={dotTwoRef}
            className="
              absolute
              left-1/2
              z-30
              h-6
              w-6
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border-[5px]
              border-[#f7f6f2]
              bg-[#ef4423]
              shadow-[0_0_0_1px_rgba(239,68,35,0.2)]
            "
            style={{
              top: "72%",
            }}
          />

          {/* =================================
              FIRST EXPERIENCE
              LEFT SIDE
          ================================== */}

          <div
            ref={(element) => {
              itemRefs.current[0] = element;
            }}
            className="
              absolute
              left-0
              w-[43%]
              -translate-y-1/2
              pr-12
              text-right
            "
            style={{
              top: "28%",
            }}
          >
            {/* Year */}

            <div
              className="
                mb-4
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#ef4423]
              "
            >
              {timelineData[0].year}
            </div>

            {/* Role */}

            <h3
              className="
                mb-3
                font-black
                leading-[0.95]
                tracking-[-0.035em]
                text-[clamp(1.8rem,3vw,3.5rem)]
                text-[#f0ebe3]
              "
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              {timelineData[0].role}
            </h3>

            {/* Company */}

            <div
              className="
                mb-5
                text-sm
                font-semibold
                text-white/40
              "
            >
              {timelineData[0].company}
            </div>

            {/* Description */}

            <p
              className="
                ml-auto
                mb-6
                max-w-[480px]
                text-sm
                leading-7
                text-white/55
                md:text-base
              "
            >
              {timelineData[0].description}
            </p>

            {/* Tags */}

            <div className="flex flex-wrap justify-end gap-2">
              {timelineData[0].tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    border-[#ef4423]/20
                    bg-[#ef4423]/5
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#ef4423]
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* =================================
              SECOND EXPERIENCE
              RIGHT SIDE
          ================================== */}

          <div
            ref={(element) => {
              itemRefs.current[1] = element;
            }}
            className="
              absolute
              right-0
              w-[43%]
              -translate-y-1/2
              pl-12
              text-left
            "
            style={{
              top: "72%",
            }}
          >
            {/* Year */}

            <div
              className="
                mb-4
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#ef4423]
              "
            >
              {timelineData[1].year}
            </div>

            {/* Role */}

            <h3
              className="
                mb-3
                font-black
                leading-[0.95]
                tracking-[-0.035em]
                text-[clamp(1.8rem,3vw,3.5rem)]
                text-[#f0ebe3]
              "
              style={{
                fontFamily: "var(--font-display)",
              }}
            >
              {timelineData[1].role}
            </h3>

            {/* Company */}

            <div
              className="
                mb-5
                text-sm
                font-semibold
                text-white/40
              "
            >
              {timelineData[1].company}
            </div>

            {/* Description */}

            <p
              className="
                mb-6
                max-w-[480px]
                text-sm
                leading-7
                text-white/55
                md:text-base
              "
            >
              {timelineData[1].description}
            </p>

            {/* Tags */}

            <div className="flex flex-wrap gap-2">
              {timelineData[1].tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    border-[#ef4423]/20
                    bg-[#ef4423]/5
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#ef4423]
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}