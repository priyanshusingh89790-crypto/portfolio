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
      const titleWrapper = titlesWrapperRef.current;

      if (!titles.length || !panels.length || !titleWrapper) return;

      // ==========================================
      // INITIAL STATES
      // ==========================================

      gsap.set(titles, {
        color: "#18181b",
      });

      // First title starts as selected
      gsap.set(titles[0], {
        color: "#ff4d2e",
      });

      // Panels
      panels.forEach((panel, index) => {
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          y: index === 0 ? 0 : 40,
          scale: index === 0 ? 1 : 0.97,
        });
      });

      // ==========================================
      // GET TITLE OFFSET
      // ==========================================

      const getTitleOffset = (index) => {
        const firstTop = titles[0].offsetTop;
        const currentTop = titles[index].offsetTop;

        return currentTop - firstTop;
      };

      // ==========================================
      // CONTINUOUS MASTER TIMELINE
      // ==========================================

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(skillGroups.length - 1) * 85}%`,
          pin: true,

          // Smooth but directly connected to scrolling
          scrub: 0.15,

          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ==========================================
      // SKILL TRANSITIONS
      // ==========================================

      for (let i = 1; i < skillGroups.length; i++) {
        const previousTitle = titles[i - 1];
        const currentTitle = titles[i];

        const previousPanel = panels[i - 1];
        const currentPanel = panels[i];

        // Each transition starts immediately
        const position = i - 1;

        // ------------------------------------------
        // MOVE TITLE LIST UP CONTINUOUSLY
        // ------------------------------------------

        tl.to(
          titleWrapper,
          {
            y: () => -getTitleOffset(i),
            duration: 1,
            ease: "none",
          },
          position
        );

        // ------------------------------------------
        // PREVIOUS TITLE → BLACK
        // ------------------------------------------

        tl.to(
          previousTitle,
          {
            color: "#18181b",
            duration: 0.35,
            ease: "none",
          },
          position
        );

        // ------------------------------------------
        // NEW TITLE → ORANGE
        // ------------------------------------------

        tl.to(
          currentTitle,
          {
            color: "#ff4d2e",
            duration: 0.35,
            ease: "none",
          },
          position + 0.35
        );

        // ------------------------------------------
        // OLD CARDS LEAVE
        // ------------------------------------------

        tl.to(
          previousPanel,
          {
            autoAlpha: 0,
            y: -35,
            scale: 0.97,
            duration: 0.65,
            ease: "power2.inOut",
          },
          position
        );

        // ------------------------------------------
        // NEW CARDS ENTER
        // ------------------------------------------

        tl.fromTo(
          currentPanel,
          {
            autoAlpha: 0,
            y: 45,
            scale: 0.97,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power2.out",
          },
          position + 0.15
        );
      }

      ScrollTrigger.refresh();
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
        min-h-[560px]
        overflow-visible
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
          max-w-[1600px]
          items-center
          gap-2
          px-4
          sm:px-8
          lg:px-14
          2xl:px-20
        "
      >
        {/* LEFT SIDE */}
        <div className="relative z-10 flex w-[44%] flex-col justify-center">
          <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">
            Skills
          </div>
          <div className="relative h-[280px] sm:h-[300px] lg:h-[320px] overflow-visible">
            <div
              ref={titlesWrapperRef}
              className="absolute left-0 sm:left-10 lg:left-20 top-0 flex flex-col gap-1 will-change-transform"
            >
              {skillGroups.map((group, index) => (
                <h2
                  key={group.title}
                  ref={(element) => { titleRefs.current[index] = element; }}
                  className="
                    whitespace-nowrap
                    font-bold
                    uppercase
                    tracking-[-0.04em]
                    leading-[1.1]
                    text-[clamp(1.6rem,2.8vw,4.3rem)]
                  "
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {group.title}
                </h2>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex h-full w-[56%] items-center justify-center">
          <div className="relative h-[300px] sm:h-[340px] lg:h-[360px] w-full max-w-[560px]">
            {skillGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                ref={(element) => { panelRefs.current[groupIndex] = element; }}
                className="
                  absolute
                  inset-0
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  gap-2
                  sm:gap-3
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
                      rounded-[1rem]
                      border
                      border-black/10
                      bg-white/60
                      p-2
                      sm:p-3
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#ff4d2e]/40
                      hover:bg-white
                    "
                  >
                    <div
                      className="
                        mb-1.5
                        flex
                        h-9
                        w-9
                        sm:h-11
                        sm:w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#f3f2ee]
                        text-base
                        font-bold
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    >
                      {skill.icon}
                    </div>
                    <span className="text-center text-[10px] sm:text-[11px] font-semibold text-zinc-700">
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