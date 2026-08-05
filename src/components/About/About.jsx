import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const typingText = "Hello.\n\nSo you found me.\n\nI'm Priyanshu.\n\nLet's build the future together.";

const floatingNodes = [
  { id: 1, label: '01', className: 'left-[8%] top-[18%] text-slate-300/70' },
  { id: 2, label: 'UI', className: 'right-[10%] top-[22%] text-cyan-300/70' },
  { id: 3, label: 'SYSTEM', className: 'right-[16%] bottom-[22%] text-violet-300/60' },
  { id: 4, label: 'VISION', className: 'left-[16%] bottom-[20%] text-slate-300/60' },
];

function AboutBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <img src="/Aboutme.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_30%),linear-gradient(120deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_35%,rgba(2,6,23,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_58%)] opacity-70" />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '110px 110px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.25)_45%,rgba(2,6,23,0.6)_100%)]" />
    </div>
  );
}

function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {floatingNodes.map((item) => (
        <div key={item.id} className={`float-item absolute ${item.className}`}>
          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] backdrop-blur-sm">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Avatar({ avatarRef, onMouseMove, onMouseLeave }) {
  return (
    <div
      ref={avatarRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative mx-auto flex h-[430px] w-[320px] items-end justify-center lg:h-[520px] lg:w-[380px]"
    >
      <div className="absolute inset-x-0 bottom-0 h-[82%] rounded-[32px] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(0,0,0,0.35)] backdrop-blur-xl" />
      <div className="absolute inset-x-8 top-8 h-20 rounded-full bg-cyan-400/15 blur-3xl" />
      <img
        src="/aboutme.jpeg"
        alt="Priyanshu"
        className="relative h-full w-full object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
      />
      <div className="absolute bottom-8 left-8 right-8 h-20 rounded-full border border-white/10 bg-black/20 blur-3xl" />
    </div>
  );
}

function SpeechBubble({ bubbleRef, text, visible }) {
  return (
    <div ref={bubbleRef} className="pointer-events-none absolute left-[36%] top-[10%] w-[270px] max-w-[85vw] rounded-[24px] border border-white/15 bg-slate-950/60 p-4 text-sm leading-7 text-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:left-[46%] lg:w-[320px]">
      <div className="mb-3 h-1 w-10 rounded-full bg-cyan-400/70" />
      <div className="min-h-[120px] whitespace-pre-line text-[14px] text-slate-100/90">
        {visible ? text : ''}
      </div>
      <div className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-slate-400">
        <span className="h-2 w-2 rounded-full bg-cyan-300" />
        Studio live
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const avatarRef = useRef(null);
  const bubbleRef = useRef(null);
  const contentRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroScene = document.querySelector('[data-hero-scene]');
    const panel = panelRef.current;
    const avatar = avatarRef.current;
    const bubble = bubbleRef.current;
    const content = contentRef.current;

    if (!heroScene || !panel || !avatar || !bubble || !content || prefersReducedMotion) {
      return undefined;
    }

    gsap.set(panel, { y: '100vh', opacity: 0, scale: 0.94, filter: 'blur(16px)' });
    gsap.set(avatar, { y: 36, opacity: 0, scale: 0.95, rotate: -2 });
    gsap.set(bubble, { y: 24, opacity: 0, scale: 0.95 });
    gsap.set('.float-item', { opacity: 0, y: 18, scale: 0.95 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 88%',
        end: '+=1400',
        scrub: 0.9,
        pin: heroScene,
        pinSpacing: false,
        anticipatePin: 1,
      },
    });

    tl.to(heroScene, { scale: 0.96, opacity: 0.72, filter: 'blur(6px)', y: -40, duration: 1, ease: 'power2.out' }, 0)
      .to(panel, { y: '0vh', opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 0)
      .to(bubble, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.16)
      .to(avatar, { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
      .to('.float-item', { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.8, ease: 'power2.out' }, 0.24)
      .to(content, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.22);

    const startTyping = () => {
      setBubbleVisible(true);
      let index = 0;
      const chars = typingText.split('');
      const cursor = window.setInterval(() => {
        setTypedText((prev) => prev + chars[index]);
        index += 1;
        if (index >= chars.length) {
          window.clearInterval(cursor);
          gsap.to(bubble, { opacity: 0.82, duration: 0.6, ease: 'power2.out' });
        }
      }, 32);
      return () => window.clearInterval(cursor);
    };

    const typingTimer = gsap.delayedCall(0.4, startTyping);

    gsap.to(avatar, { y: -8, scale: 1.01, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    return () => {
      typingTimer.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([avatar, bubble, '.float-item', heroScene, panel, content]);
    };
  }, []);

  const handleMouseMove = (event) => {
    const rect = avatarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(avatarRef.current, { x: x * 12, y: y * 10, rotate: x * 5, duration: 0.8, ease: 'power2.out' });
    gsap.to(bubbleRef.current, { x: x * 10, y: y * 8, duration: 0.8, ease: 'power2.out' });
    gsap.to('.float-item', { x: x * -8, y: y * -6, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    gsap.to(avatarRef.current, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: 'power2.out' });
    gsap.to(bubbleRef.current, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
    gsap.to('.float-item', { x: 0, y: 0, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <div ref={sectionRef} className="relative z-20 mt-[-100vh] w-full overflow-visible">
      <section
        ref={panelRef}
        id="about"
        className="relative isolate flex min-h-screen w-screen items-center overflow-hidden py-20"
        style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', boxShadow: '0 -32px 100px rgba(0,0,0,0.55)' }}
      >
        <AboutBackground />
        <FloatingElements />

        <div ref={contentRef} className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-10 px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-slate-300/70">
              01 — About Studio
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="relative order-2 lg:order-1">
              <SpeechBubble bubbleRef={bubbleRef} text={typedText} visible={bubbleVisible} />
              <Avatar avatarRef={avatarRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
            </div>

            <div className="order-1 space-y-8 lg:order-2">
              <div className="space-y-5">
                <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-300/80">Creative technologist</p>
                <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.6rem,5vw,4.2rem)] font-semibold leading-[0.95] text-white">
                  I build immersive digital experiences that feel alive.
                </h2>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400" />
              </div>

              <div className="max-w-2xl rounded-[28px] border border-white/10 bg-white/8 p-7 backdrop-blur-xl">
                <p className="text-base leading-8 text-slate-200/90">
                  I’m a frontend engineer crafting premium interfaces with cinematic motion, thoughtful systems, and future-facing product design.
                  My work lives at the intersection of code, storytelling, and tactile interaction.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Focus</p>
                  <p className="mt-2 text-lg font-semibold text-white">Cinematic product experiences</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Stack</p>
                  <p className="mt-2 text-lg font-semibold text-white">React • GSAP • Tailwind</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
