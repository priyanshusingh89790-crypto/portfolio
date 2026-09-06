import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_ID = "9hFezqLc6zQ";
const lines = ["MORE", "THAN", "JUST", "CODE"];

export default function ScrollVideoSection() {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const imageRef = useRef(null);
  const lineRefs = useRef([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;

    if (!stage || !frame || !image) return;

    const ctx = gsap.context(() => {
      const lineElements = lineRefs.current.filter(Boolean);

      // ---------- initial states ----------

      gsap.set(frame, {
        width: "18vw",
        height: "54vh",
        borderRadius: "40px",
      });

      gsap.set(lineElements, {
        xPercent: -110,
        opacity: 0,
      });

      gsap.set(image, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1,
      });

      // ---------- 1) entrance ----------

      gsap
        .timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
        .to(lineElements, {
          xPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.15,
        })
        .to(
          image,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            ease: "none",
          },
          "-=0.3"
        );

      // ---------- 2) ONLY FRAME ANIMATES ----------

      gsap.to(frame, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        ease: "none",

        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=1800",
          scrub: true,
        },
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-[calc(100vh+1800px)] bg-[#f7f6f2]"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <h1
          className="absolute top-[20%] left-[6%] z-30 font-black uppercase tracking-[-0.04em] leading-[1.35] text-[clamp(1.6rem,4.5vw,6.5rem)] text-[#111]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lines.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <span
                ref={(el) => (lineRefs.current[i] = el)}
                className="inline-block"
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div className="absolute left-[28%] top-[70%] z-20 w-[25%] -translate-x-1/2 -translate-y-1/2 -rotate-[10deg]">
          <img
            ref={imageRef}
            src="./AI-powered.png"
            alt="aipowered"
            className="w-full h-auto object-contain"
          />
        </div>

        <div
          ref={frameRef}
          className="absolute left-1/2 top-1/2 z-30 overflow-hidden pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <iframe
            className="fixed left-1/2 top-1/2 border-0"
            style={{
              width: "100vw",
              height: "56.25vw",
              minWidth: "177.78vh",
              minHeight: "100vh",
              transform: "translate(-50%, -50%)",
            }}
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1`}
            title="Portfolio video"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}