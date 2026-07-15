import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pure SVG penguin — no external assets needed
export default function PenguinWalker({ sectionRef }) {
  const penguinRef = useRef(null);
  const leftLegRef = useRef(null);
  const rightLegRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const bodyRef = useRef(null);
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    if (!sectionRef?.current || !penguinRef.current) return;

    // Walking leg/arm animation loop
    const walkTl = gsap.timeline({ repeat: -1, yoyo: false });
    walkTl
      .to(leftLegRef.current,  { rotation: 18,  duration: 0.28, ease: 'sine.inOut', transformOrigin: 'top center' })
      .to(rightLegRef.current, { rotation: -18, duration: 0.28, ease: 'sine.inOut', transformOrigin: 'top center' }, '<')
      .to(leftArmRef.current,  { rotation: -12, duration: 0.28, ease: 'sine.inOut', transformOrigin: 'top right' }, '<')
      .to(rightArmRef.current, { rotation: 12,  duration: 0.28, ease: 'sine.inOut', transformOrigin: 'top left' }, '<')
      // body waddle
      .to(bodyRef.current,     { rotation: 3,   duration: 0.28, ease: 'sine.inOut', transformOrigin: 'bottom center' }, '<')

      .to(leftLegRef.current,  { rotation: -18, duration: 0.28, ease: 'sine.inOut' })
      .to(rightLegRef.current, { rotation: 18,  duration: 0.28, ease: 'sine.inOut' }, '<')
      .to(leftArmRef.current,  { rotation: 12,  duration: 0.28, ease: 'sine.inOut' }, '<')
      .to(rightArmRef.current, { rotation: -12, duration: 0.28, ease: 'sine.inOut' }, '<')
      .to(bodyRef.current,     { rotation: -3,  duration: 0.28, ease: 'sine.inOut' }, '<');

    // Blink eyes randomly
    const blinkLoop = () => {
      const delay = 2 + Math.random() * 3;
      gsap.delayedCall(delay, () => {
        gsap.to([eyeLeftRef.current, eyeRightRef.current], {
          scaleY: 0.05,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          transformOrigin: 'center center',
          onComplete: blinkLoop,
        });
      });
    };
    blinkLoop();

    // Scroll-driven horizontal walk across the section
    const ctx = gsap.context(() => {
      // Walk from left to right across the full section width
      gsap.fromTo(
        penguinRef.current,
        { x: -60 },
        {
          x: () => sectionRef.current.offsetWidth - 100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.2,
          },
        }
      );

      // Speech bubble changes as penguin walks through sections
      const messages = [
        "Here's what I've built!",
        "Netflix with AI? Done.",
        "Full-stack devs, assemble!",
        "And yes, this portfolio too 🐧",
      ];
      let msgIdx = 0;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const newIdx = Math.min(
            messages.length - 1,
            Math.floor(self.progress * messages.length)
          );
          if (newIdx !== msgIdx && speechRef.current) {
            msgIdx = newIdx;
            gsap.to(speechRef.current, {
              opacity: 0, scale: 0.85, duration: 0.2,
              onComplete: () => {
                if (speechRef.current) {
                  speechRef.current.querySelector('.speech-text').textContent = messages[msgIdx];
                  gsap.to(speechRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.7)' });
                }
              }
            });
          }
        },
      });

      // Pause walk when section is above/below viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: ()  => walkTl.play(),
        onLeave: ()  => walkTl.pause(),
        onEnterBack: () => walkTl.play(),
        onLeaveBack: () => walkTl.pause(),
      });
    });

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <div
      ref={penguinRef}
      className="absolute bottom-[-10px] z-20 pointer-events-none select-none"
      style={{ willChange: 'transform' }}
    >
      {/* Speech bubble */}
      <div
        ref={speechRef}
        className="absolute bottom-[110px] left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ opacity: 1 }}
      >
        <div className="relative bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-lg border border-gray-200"
          style={{ fontFamily: 'var(--font-body)' }}>
          <span className="speech-text">Here's what I've built!</span>
          {/* Triangle pointer */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[8px] w-0 h-0"
            style={{
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '8px solid white',
              filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.08))'
            }} />
        </div>
      </div>

      {/* Penguin SVG */}
      <svg
        width="80"
        height="110"
        viewBox="0 0 80 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === LEGS === */}
        <g ref={leftLegRef} style={{ transformOrigin: '34px 90px' }}>
          <rect x="28" y="88" width="10" height="16" rx="5" fill="#1a1a2e" />
          {/* foot */}
          <ellipse cx="30" cy="104" rx="8" ry="4" fill="#f59e0b" />
        </g>
        <g ref={rightLegRef} style={{ transformOrigin: '46px 90px' }}>
          <rect x="42" y="88" width="10" height="16" rx="5" fill="#1a1a2e" />
          <ellipse cx="50" cy="104" rx="8" ry="4" fill="#f59e0b" />
        </g>

        {/* === BODY === */}
        <g ref={bodyRef} style={{ transformOrigin: '40px 88px' }}>
          {/* Main body */}
          <ellipse cx="40" cy="65" rx="26" ry="30" fill="#1a1a2e" />
          {/* White belly */}
          <ellipse cx="40" cy="68" rx="16" ry="22" fill="#f1f5f9" />

          {/* === ARMS === */}
          <g ref={leftArmRef} style={{ transformOrigin: '16px 58px' }}>
            <ellipse cx="14" cy="62" rx="7" ry="14" rx2="7" fill="#1a1a2e"
              transform="rotate(-15 14 62)" />
          </g>
          <g ref={rightArmRef} style={{ transformOrigin: '64px 58px' }}>
            <ellipse cx="66" cy="62" rx="7" ry="14"
              fill="#1a1a2e"
              transform="rotate(15 66 62)" />
          </g>

          {/* === HEAD === */}
          <ellipse cx="40" cy="36" rx="22" ry="22" fill="#1a1a2e" />
          {/* White face patch */}
          <ellipse cx="40" cy="39" rx="14" ry="14" fill="#f1f5f9" />

          {/* Eyes */}
          <g ref={eyeLeftRef} style={{ transformOrigin: '33px 35px' }}>
            <circle cx="33" cy="35" r="5" fill="white" />
            <circle cx="34" cy="35" r="2.5" fill="#1a1a2e" />
            <circle cx="35" cy="34" r="1" fill="white" />
          </g>
          <g ref={eyeRightRef} style={{ transformOrigin: '47px 35px' }}>
            <circle cx="47" cy="35" r="5" fill="white" />
            <circle cx="48" cy="35" r="2.5" fill="#1a1a2e" />
            <circle cx="49" cy="34" r="1" fill="white" />
          </g>

          {/* Beak */}
          <ellipse cx="40" cy="44" rx="5" ry="3.5" fill="#f59e0b" />

          {/* Rosy cheeks */}
          <circle cx="28" cy="40" r="4" fill="#f472b6" opacity="0.35" />
          <circle cx="52" cy="40" r="4" fill="#f472b6" opacity="0.35" />

          {/* Tiny hat (dev cap) */}
          <rect x="24" y="14" width="32" height="6" rx="3" fill="#6366f1" />
          <rect x="28" y="6" width="24" height="12" rx="4" fill="#6366f1" />
          {/* Hat stripe */}
          <rect x="28" y="14" width="24" height="2" fill="#a5b4fc" />
          {/* Hat logo */}
          <text x="35" y="13" fontSize="6" fill="white" fontWeight="bold" fontFamily="monospace">{"<>"}</text>
        </g>
      </svg>
    </div>
  );
}
