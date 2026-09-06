import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Devicon = developer/product logos.
// Simple Icons = additional brand logos.
// Lobehub = AI model/provider logos.
const DEVICON =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const SIMPLE =
  "https://cdn.simpleicons.org";

const LOBE =
  "https://unpkg.com/@lobehub/icons-static-svg@latest/icons";
const skillGroups = [
  {
    title: "Frontend",
    skills: [
      {
        name: "React",
        logo: `${DEVICON}/react/react-original.svg`,
      },
      {
        name: "JavaScript",
        logo: `${DEVICON}/javascript/javascript-original.svg`,
      },
      {
        name: "TypeScript",
        logo: `${DEVICON}/typescript/typescript-original.svg`,
      },
      {
        name: "HTML",
        logo: `${DEVICON}/html5/html5-original.svg`,
      },
      {
        name: "CSS",
        logo: `${DEVICON}/css3/css3-original.svg`,
      },
      {
        name: "Tailwind",
        logo: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
      },
    ],
  },

{
  title: "State & Data",
  skills: [
    {
      name: "Redux",
      logo: `${DEVICON}/redux/redux-original.svg`,
    },
    {
      name: "React Query",
      logo: `${SIMPLE}/reactquery`,
    },
    {
      name: "Axios",
      logo: `${SIMPLE}/axios`,
    },
    {
      name: "JSON",
      logo: `${DEVICON}/json/json-plain.svg`,
    },
    {
      name: "Zustand",
      logo: "/icons/zustand.svg",
    },
    {
      name: "Postman",
      logo: `${DEVICON}/postman/postman-original.svg`,
    },
  ],
},

  {
    title: "Tools",
    skills: [
      {
        name: "Git",
        logo: `${DEVICON}/git/git-original.svg`,
      },
      {
        name: "GitHub",
        logo: `${DEVICON}/github/github-original.svg`,
      },
      {
        name: "Vite",
        logo: `${DEVICON}/vitejs/vitejs-original.svg`,
      },
      {
        name: "VS Code",
        logo: `${DEVICON}/vscode/vscode-original.svg`,
      },
      {
        name: "Figma",
        logo: `${DEVICON}/figma/figma-original.svg`,
      },
      {
        name: "Docker",
        logo: `${DEVICON}/docker/docker-original.svg`,
      },
    ],
  },

{
  title: "Backend",
  skills: [
    {
      name: "Node.js",
      logo: `${DEVICON}/nodejs/nodejs-original.svg`,
    },
    
{
  name: "Express.js",
  logo: "https://expressjs.com/images/logos/logo-express-black.svg",
},
    {
      name: "MongoDB",
      logo: `${DEVICON}/mongodb/mongodb-original.svg`,
    },
    {
      name: "Firebase",
      logo: `${DEVICON}/firebase/firebase-plain.svg`,
    },
    {
      name: "PostgreSQL",
      logo: `${DEVICON}/postgresql/postgresql-original.svg`,
    },
    {
      name: "JWT",
      logo: `${SIMPLE}/jsonwebtokens`,
    },
  ],
},

{
  title: "AI",
  skills: [
    {
      name: "n8n",
      logo: `${SIMPLE}/n8n`,
    },
    {
      name: "Zapier",
      logo: `${SIMPLE}/zapier`,
    },
    {
      name: "Cursor",
      logo: `${SIMPLE}/cursor`,
    },
    {
      name: "Kiro",
      logo: `${LOBE}/kiro-color.svg`,
    },
    {
      name: "Claude",
      logo: `${LOBE}/claude-color.svg`,
    },
    {
      name: "Gemini",
      logo: `${LOBE}/gemini-color.svg`,
    },
  ],
},
];

// Base tilt angles per column, in degrees: \ | / repeating.
const TILT_ANGLES = [-16, 0, 16];

export default function Skills() {
  const sectionRef = useRef(null);
  const titlesWrapperRef = useRef(null);

  const titleRefs = useRef([]);
  const panelRefs = useRef([]);
  const iconRefs = useRef([]);

useLayoutEffect(() => {
  const section = sectionRef.current;

  if (!section) return;

  const ctx = gsap.context(() => {
    const titles = titleRefs.current.filter(Boolean);
    const panels = panelRefs.current.filter(Boolean);
    const titleWrapper = titlesWrapperRef.current;

    if (!titles.length || !panels.length || !titleWrapper) {
      return;
    }

    const totalSteps = skillGroups.length - 1;

    let titleOffsets = [];

    const measure = () => {
      titleOffsets = titles.map(
        (el) => el.offsetTop - titles[0].offsetTop
      );
    };

    measure();

    const render = (progress) => {
      const virtualIndex = gsap.utils.clamp(
        0,
        totalSteps,
        progress * totalSteps
      );

      const floor = Math.floor(virtualIndex);
      const frac = virtualIndex - floor;

      const from = titleOffsets[floor] ?? 0;

      const to =
        titleOffsets[
          Math.min(floor + 1, titleOffsets.length - 1)
        ] ?? from;

      gsap.set(titleWrapper, {
        y: -gsap.utils.interpolate(from, to, frac),
      });

      titles.forEach((title, i) => {
        const distance = Math.min(
          Math.abs(i - virtualIndex),
          1
        );

        const focus = 1 - distance;
        const signed = i - virtualIndex;

        gsap.set(title, {
          color: gsap.utils.interpolate(
            "#18181b",
            "#ff4d2e",
            focus
          ),

          opacity: gsap.utils.interpolate(
            0.32,
            1,
            focus
          ),

          scale: gsap.utils.interpolate(
            0.86,
            1,
            focus
          ),

          rotationX: gsap.utils.clamp(
            -50,
            50,
            signed * 38
          ),

          z: -Math.abs(signed) * 70,

          transformPerspective: 800,

          transformOrigin: "left center",
        });
      });

      panels.forEach((panel, i) => {
        const distance = Math.min(
          Math.abs(i - virtualIndex),
          1
        );

        const focus = 1 - distance;

        gsap.set(panel, {
          autoAlpha: 1 - distance,

          y: (i - virtualIndex) * 45,

          scale: gsap.utils.interpolate(
            0.94,
            1,
            focus
          ),
        });

        const groupIcons = iconRefs.current[i];

        if (groupIcons) {
          groupIcons.forEach((iconEl, j) => {
            if (!iconEl) return;

            const tilt =
              TILT_ANGLES[
                j % TILT_ANGLES.length
              ];

            gsap.set(iconEl, {
              rotation: gsap.utils.interpolate(
                tilt,
                0,
                focus
              ),
            });
          });
        }
      });
    };

    render(0);

    // ---------------------------------------------
    // SCROLLTRIGGER
    // ---------------------------------------------

    const skillsTrigger = ScrollTrigger.create({
      trigger: section,

      start: "top top",

      end: `+=${(skillGroups.length - 1) * 85}%`,

      pin: true,

      scrub: 0.45,

      anticipatePin: 1,

      invalidateOnRefresh: true,

      onRefresh: (self) => {
        measure();
        render(self.progress);

        // Only the Skills pin spacer gets this background
        if (self.pinSpacer) {
          self.pinSpacer.style.backgroundColor = "#f7f6f2";
        }
      },

      onUpdate: (self) => {
        render(self.progress);
      },
    });

    // Set the background immediately
    if (skillsTrigger.pinSpacer) {
      skillsTrigger.pinSpacer.style.backgroundColor = "#f7f6f2";
    }

    ScrollTrigger.refresh();
  }, section);

  return () => {
    ctx.revert();
  };
}, []);
  

  return (
<section
  ref={sectionRef}
  id="skills"
  className="
    relative
    h-screen
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
        {/* =====================================================
            LEFT SIDE
            ===================================================== */}

        <div
          className="
            relative
            z-10
            flex
            w-[44%]
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
              text-zinc-900
            "
          >
            Skills
          </div>

          <div
            className="
              relative
              h-[280px]
              overflow-visible
              sm:h-[300px]
              lg:h-[320px]
            "
          >
            <div
              ref={titlesWrapperRef}
              className="
                absolute
                left-0
                top-0
                flex
                flex-col
                gap-1
                will-change-transform
                sm:left-10
                lg:left-20
              "
            >
              {skillGroups.map((group, index) => (
                <h2
                  key={group.title}
                  ref={(el) => {
                    titleRefs.current[index] = el;
                  }}
                  className="
                    whitespace-nowrap
                    text-[clamp(1.6rem,2.8vw,4.3rem)]
                    font-bold
                    uppercase
                    leading-[1.1]
                    tracking-[-0.04em]
                  "
                  style={{
                    fontFamily:
                      "var(--font-display)",
                  }}
                >
                  {group.title}
                </h2>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
            ===================================================== */}

        <div
          className="
            relative
            flex
            h-full
            w-[56%]
            items-center
            justify-center
          "
        >
          <div
            className="
              relative
              h-[300px]
              w-full
              max-w-[560px]
              sm:h-[340px]
              lg:h-[360px]
            "
          >
            {skillGroups.map(
              (group, groupIndex) => (
                <div
                  key={group.title}
                  ref={(el) => {
                    panelRefs.current[groupIndex] =
                      el;
                  }}
                  className="
                    absolute
                    inset-0
                    grid
                    grid-cols-2
                    gap-5
                    sm:grid-cols-3
                    sm:gap-6
                    lg:gap-8
                  "
                >
                  {group.skills.map(
                    (skill, skillIndex) => (
                      <div
                        key={skill.name}
                        ref={(el) => {
                          if (
                            !iconRefs.current[
                              groupIndex
                            ]
                          ) {
                            iconRefs.current[
                              groupIndex
                            ] = [];
                          }

                          iconRefs.current[
                            groupIndex
                          ][skillIndex] = el;
                        }}
                        className="
                          group
                          flex
                          aspect-square
                          items-center
                          justify-center
                          p-3
                          will-change-transform
                        "
                        title={skill.name}
                      >
                        <img
                          src={skill.logo}
                          alt={skill.name}
                          loading="lazy"
                          draggable="false"
                          className="
                            h-full
                            w-full
                            object-contain
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        />
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}