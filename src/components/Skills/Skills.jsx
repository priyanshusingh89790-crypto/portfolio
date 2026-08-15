import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "⚛️" },
      { name: "JavaScript", icon: "JS" },
      { name: "TypeScript", icon: "TS" },
      { name: "HTML", icon: "5" },
      { name: "CSS", icon: "3" },
      { name: "Tailwind", icon: "〰️" },
    ],
  },
  {
    title: "State & Data",
    skills: [
      { name: "Redux", icon: "🔺" },
      { name: "Context API", icon: "◉" },
      { name: "REST API", icon: "⇄" },
      { name: "Axios", icon: "◈" },
      { name: "JSON", icon: "{ }" },
      { name: "Async", icon: "⌁" },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: "◆" },
      { name: "GitHub", icon: "◉" },
      { name: "Vite", icon: "⚡" },
      { name: "VS Code", icon: "⌘" },
      { name: "Figma", icon: "●" },
      { name: "Postman", icon: "✦" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "⬡" },
      { name: "Express", icon: "EX" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Firebase", icon: "🔥" },
      { name: "REST APIs", icon: "⇄" },
      { name: "JWT", icon: "🔐" },
    ],
  },
  {
    title: "AI",
    skills: [
      { name: "ChatGPT", icon: "✦" },
      { name: "Claude", icon: "✳" },
      { name: "Gemini", icon: "✧" },
      { name: "Prompting", icon: "⌁" },
      { name: "AI Tools", icon: "◉" },
      { name: "Automation", icon: "⚡" },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const titlesWrapperRef = useRef(null);
  const titleRefs = useRef([]);
  const panelRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const titles = titleRefs.current.filter(Boolean);
      const panels = panelRefs.current.filter(Boolean);

      if (!titles.length || !panels.length) return;

      // -------------------------------
      // INITIAL STATES
      // -------------------------------

      gsap.set(titles, {
        color: "#18181b",
      });

      // Only first active title is orange
      gsap.set(titles[0], {
        color: "#ff4d2e",
      });

      panels.forEach((panel, index) => {
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 40,
          scale: index === 0 ? 1 : 0.97,
        });
      });

      // -----------------------------------------
      // GET EXACT TITLE POSITIONS
      //
      // This is important because titles like
      // "State & Data" may have a different width,
      // but every movement uses their real position.
      // -----------------------------------------

      const getOffset = (index) => {
        const firstTop = titles[0].offsetTop;
        const currentTop = titles[index].offsetTop;

        return currentTop - firstTop;
      };

      // -----------------------------------------
      // MASTER TIMELINE
      // -----------------------------------------

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(skillGroups.length - 1) * 90}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // -----------------------------------------
      // EACH SKILL TRANSITION
      // -----------------------------------------

      for (let i = 1; i < skillGroups.length; i++) {
        const previousTitle = titles[i - 1];
        const currentTitle = titles[i];

        const previousPanel = panels[i - 1];
        const currentPanel = panels[i];

        const step = `step-${i}`;

        // -----------------------------------------
        // 1. TITLE LIST MOVES UP
        //
        // Current title lands in the EXACT SAME
        // position where the previous title was.
        // -----------------------------------------

        tl.to(
          titlesWrapperRef.current,
          {
            y: () => -getOffset(i),
            duration: 0.8,
            ease: "power3.inOut",
          },
          step
        );

        // -----------------------------------------
        // 2. OLD TITLE BECOMES BLACK
        //
        // Happens while moving upward.
        // -----------------------------------------

        tl.to(
          previousTitle,
          {
            color: "#18181b",
            duration: 0.35,
            ease: "power1.inOut",
          },
          step
        );

        // -----------------------------------------
        // 3. NEW TITLE BECOMES ORANGE
        //
        // It becomes orange while arriving at the
        // exact fixed selection position.
        // -----------------------------------------

        tl.to(
          currentTitle,
          {
            color: "#ff4d2e",
            duration: 0.35,
            ease: "power1.inOut",
          },
          `${step}+=0.25`
        );

        // -----------------------------------------
        // 4. OLD CARDS LEAVE
        // -----------------------------------------

        tl.to(
          previousPanel,
          {
            autoAlpha: 0,
            y: -25,
            scale: 0.98,
            duration: 0.45,
            ease: "power2.inOut",
          },
          step
        );

        // -----------------------------------------
        // 5. NEW CARDS ENTER
        // -----------------------------------------

        tl.fromTo(
          currentPanel,
          {
            autoAlpha: 0,
            y: 35,
            scale: 0.97,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
          },
          `${step}+=0.15`
        );

        // Small pause before next change
        tl.to({}, { duration: 0.35 });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="
        relative
        h-[78vh]
        min-h-[580px]
        bg-[#f7f6f2]
        text-zinc-900
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1400px]
          items-center
          gap-4
          px-6
          sm:px-10
          lg:px-14
        "
      >
        {/* ================================
            LEFT — TITLE SELECTOR
        ================================= */}

        <div
          className="
            relative
            flex
            w-[45%]
            flex-col
            justify-center
          "
        >
          <div
            className="
              mb-5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.3em]
            "
          >
            Skills
          </div>

          {/* 
            FIXED SELECTION POINT

            The wrapper starts here.
            The entire list moves upward.
            Every new active title lands here.
          */}

          <div className="relative h-[320px]">
            <div
              ref={titlesWrapperRef}
              className="
                absolute
                left-0
                top-0
                flex
                flex-col
                gap-1
              "
            >
              {skillGroups.map((group, index) => (
                <h2
                  key={group.title}
                  ref={(element) => {
                    titleRefs.current[index] = element;
                  }}
                  className="
                    whitespace-nowrap
                    font-medium
                    uppercase
                    tracking-[-0.04em]
                    leading-[1.1]
                    text-[clamp(2.2rem,3.2vw,4.3rem)]
                  "
                  style={{
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {group.title}
                </h2>
              ))}
            </div>
          </div>
        </div>

        {/* ================================
            RIGHT — SKILL CARDS
        ================================= */}

        <div
          className="
            relative
            flex
            h-full
            w-[55%]
            items-center
            justify-center
          "
        >
          <div
            className="
              relative
              h-[360px]
              w-full
              max-w-[560px]
            "
          >
            {skillGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                ref={(element) => {
                  panelRefs.current[groupIndex] = element;
                }}
                className="
                  absolute
                  inset-0
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-3
                "
              >
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="
                      group
                      flex
                      aspect-square
                      flex-col
                      items-center
                      justify-center
                      rounded-[1.1rem]
                      border
                      border-black/10
                      bg-white/60
                      p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#ff4d2e]/40
                      hover:bg-white
                    "
                  >
                    <div
                      className="
                        mb-2
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#f3f2ee]
                        text-lg
                        font-bold
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    >
                      {skill.icon}
                    </div>

                    <span
                      className="
                        text-center
                        text-[11px]
                        font-semibold
                        text-zinc-700
                        sm:text-xs
                      "
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}