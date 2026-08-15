import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  "TURNING IDEAS",
  "INTO DIGITAL",
  "EXPERIENCES",
  "THROUGH CODE",
];

export default function About() {
  const sectionRef = useRef(null);
  const headlineWrapperRef = useRef(null);
  const lineRefs = useRef([]);
  const roleRef = useRef(null);
  const descriptionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headlineWrapper = headlineWrapperRef.current;
    const role = roleRef.current;
    const description = descriptionRef.current;

    if (!section || !headlineWrapper || !role || !description) {
      return;
    }

    const ctx = gsap.context(() => {
      const lineElements = lineRefs.current.filter(Boolean);

      /* ------------------------------------------
         INITIAL STATES
      ------------------------------------------ */

      // Headline starts in the center
      gsap.set(headlineWrapper, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
      });

      // Start image hidden for wipe reveal
      gsap.set(role, { clipPath: "inset(0 100% 0 0)", opacity: 1, x: 0 });

      gsap.set(description, {
        opacity: 0,
        y: 20,
      });

      /* ------------------------------------------
         INTRO ANIMATION
      ------------------------------------------ */

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // 2. Move headline to the left
      intro.to(
        headlineWrapper,
        {
          left: "3%",
          xPercent: 0,
          duration: 1.3,
          ease: "power4.inOut",
        },
        "move"
      );

      // 3. Reveal Image left-to-right (like typing)
      intro.to(
        role,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.25,
          ease: "none",
        },
        "move"
      );

      // 4. Show description
      intro.to(
        description,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "move"
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="
        relative
        overflow-hidden
        bg-[#f7f6f2]
        text-[#111]
        z-20
        -mt-[80vh]
      "
    >
      {/* BACKGROUND TEXT */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="
            select-none
            whitespace-nowrap
            font-black
            uppercase
            tracking-[0.5em]
            text-[clamp(3rem,8vw,8.5rem)]
            text-black/[0.025]
          "
          style={{
            fontFamily: "var(--font-display)",
          }}
        >
          PRIYANSHU
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          relative
          w-full
          h-[380px]
          sm:h-[430px]
          md:h-[500px]
        "
      >
        {/* HEADLINE WRAPPER */}
        <div
          ref={headlineWrapperRef}
          className="
            absolute
            w-max
            max-w-[90vw]
          "
        >
          {/* HEADLINE */}
          <div className="relative flex flex-col">
            {lines.map((text, index) => (
              <div
                key={text}
                className="overflow-hidden"
              >
                <h1
                  ref={(element) => {
                    lineRefs.current[index] = element;
                  }}
                  className="
                    font-black
                    uppercase
                    tracking-[-0.04em]
                    leading-[1.4]
                    text-[clamp(2.2rem,5vw,6.5rem)]
                    text-[#111]
                    whitespace-nowrap
                  "
                  style={{
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {text}
                </h1>
              </div>
            ))}
          </div>

          {/* FRONTEND DEVELOPER */}
          <div
            className="
              absolute
              left-[88%]
              top-[73%]
              ml-2
              md:ml-4
              -rotate-[10deg]
              pointer-events-none
              whitespace-nowrap
            "
          >
            {/* Fixed-width area so F never moves */}
            <div
              className="
                w-[260px]
                sm:w-[320px]
                md:w-[480px]
              "
            >
              <img
                src="/text.png"
                alt="Frontend Developer"
                ref={roleRef}
                className="
                  w-full
                  h-auto
                  object-contain
                "
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-7 max-w-[500px] overflow-hidden">
            <p
              ref={descriptionRef}
              className="
                text-sm
                md:text-base
                leading-7
                text-neutral-600
              "
            >
              Building modern, responsive and interactive digital
              experiences with a focus on clean design, smooth motion
              and thoughtful frontend development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}