"use client";
/**
 * DialHero — scroll-driven "clock" that asks questions.
 *
 * SAME VISUAL DESIGN AS BEFORE. Only the internals changed:
 *   - GSAP + ScrollTrigger drive the scroll -> dial mapping (replaces the old
 *     manual scroll listener + requestAnimationFrame lerp loop).
 *   - Lenis provides the smooth scroll itself, and its "scroll" event is what
 *     resets the idle timer (replaces the old native "scroll" listener).
 *   - GSAP animates the "grow into chat" launch circle with the exact same
 *     cubic-bezier(.7,0,.2,1) curve the old CSS transition used.
 * The JSX structure, Tailwind classes, and the <style> block below (which is
 * what actually controls the look) are unchanged.
 *
 * Install:   npm i gsap lenis
 * Needs:     React 18+, Tailwind v3.2+ (uses the max-md: variant), gsap ^3.12
 *            (CustomEase ships free in the core package from that version on).
 *
 * If your app already runs a single Lenis instance at the root (recommended
 * for a whole-site smooth scroll), pass it in and this component reuses it:
 *   <DialHero lenis={appLenis} />
 * Otherwise it creates its own and stores it on window.__lenis so other
 * components can share it, and cleans it up again on unmount.
 *
 * Usage:  <DialHero peek />
 *         <DialHero peek onAsk={(q) => router.push(`/chat?q=${encodeURIComponent(q.q)}`)} />
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis"; // older projects: "@studio-freight/lenis"

gsap.registerPlugin(ScrollTrigger, CustomEase);
// Exact same curve the old CSS used for the "grow into chat" circle.
CustomEase.create("dhLaunch", "0.7, 0, 0.2, 1");

const MOCK_QUESTIONS = [

  { label: "Projects", q: "Which project best represents what you can build?" },

  { label: "WPP", q: "How did you automate multilingual InDesign campaigns at WPP?" },

  { label: "EWHENT", q: "What did you build for the ERP platform at EWHENT?" },

  { label: "Frontend", q: "What does your frontend stack look like, and why?" },

  { label: "AI Agents", q: "How do you design and build agentic AI workflows?" },

  { label: "n8n", q: "What workflows have you automated with n8n?" },

  { label: "Performance", q: "How do you keep React applications fast as they scale?" },

  { label: "State", q: "How do you decide between Redux, Context, and other state solutions?" },

  { label: "RAG", q: "How does the AI assistant in this portfolio use RAG?" },

  { label: "Hiring", q: "What makes you a strong fit for a frontend developer role?" },

  { label: "Learning", q: "What are you currently learning and building?" },

  { label: "Contact", q: "How can I get in touch with you?" },

];

const RISE = 0.22; // share of the scroll used to lift the dial into view
const TAIL = 0.06; // dead scroll at the end so the last question can settle
const IDLE_MS = 200; // how long scrolling must stop before the needle locks

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const pad = (n) => String(n).padStart(2, "0");

export default function AskAiHero({
  questions = MOCK_QUESTIONS,
  chatHref = "/chat",
  onAsk,
  peek = false,
  lenis: lenisProp,
}) {
  const navigate = useNavigate();
  const count = questions.length;
  const step = 360 / count;
  const lead = peek ? RISE : 0;

  const sectionRef  = useRef(null);
  const stageRef    = useRef(null);
  const dialRef     = useRef(null);
  const needleRef   = useRef(null);
  const launchRef   = useRef(null);
  const wrapperRef  = useRef(null); // outer positioning wrapper

  const lenisRef      = useRef(null);
  const lastIdxRef    = useRef(0);
  const idleTimerRef  = useRef(null);

  const [active,  setActive]  = useState(0);
  const [idle,    setIdle]    = useState(true);
  const [ready,   setReady]   = useState(!peek);
  const [launch,  setLaunch]  = useState(null);

  // ── Lenis + ScrollTrigger ──────────────────────────────────────────────────
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis = lenisProp || window.__lenis;
    let ownsLenis = false;
    if (!lenis) {
      lenis = new Lenis({ smoothWheel: !reduce, duration: reduce ? 0 : 1.1 });
      window.__lenis = lenis;
      ownsLenis = true;
    }
    lenisRef.current = lenis;

    const onTick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const lockToNearest = () => {
      setIdle(true);
      gsap.to(needleRef.current, {
        rotation: lastIdxRef.current * step - 90,
        duration: reduce ? 0 : 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const resetIdle = () => {
      setIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(lockToNearest, IDLE_MS);
    };
    lenis.on("scroll", resetIdle);

    const apply = (self) => {
      const p = self.progress;

      const rise = peek ? easeOutCubic(clamp(p / RISE)) : 1;
      stageRef.current?.style.setProperty("--rise", rise.toFixed(4));
      setReady(rise > 0.985);

      const q = clamp((p - lead) / (1 - lead - TAIL));
      const angle = q * (count - 1) * step;
      if (!reduce) {
        gsap.set(needleRef.current, { rotation: angle - 90 });
      }

      const idx = clamp(Math.round(angle / step), 0, count - 1);
      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        setActive(idx);
        if (navigator.vibrate) navigator.vibrate(6);
      }
      if (reduce) {
        gsap.set(needleRef.current, { rotation: idx * step - 90 });
      }

      // ── Header docking: when progress > 0.92, fade in the nav slot ──
      const slot = document.getElementById("dial-nav-slot");
      if (slot) {
        const dockProgress = clamp((p - 0.88) / 0.08);
        slot.style.opacity = dockProgress.toFixed(3);
        slot.style.pointerEvents = dockProgress > 0.5 ? "auto" : "none";
      }
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: apply,
    });
    apply(st);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.off("scroll", resetIdle);
      gsap.ticker.remove(onTick);
      clearTimeout(idleTimerRef.current);
      st.kill();
      if (ownsLenis) {
        lenis.destroy();
        delete window.__lenis;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, step, peek, lead, lenisProp]);

  // clicking a rim label scrolls the page to that hour, via Lenis
  const jump = useCallback(
    (i) => {
      const el = sectionRef.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = lead + (i / (count - 1)) * (1 - lead - TAIL);
      const top = el.getBoundingClientRect().top + window.scrollY + p * range;
      if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1 });
      else window.scrollTo({ top, behavior: "smooth" });
    },
    [count, lead]
  );

  // the white circle grows from the dial's center, then we hand off to the chat
  const ask = (item) => {
    if (launch || !dialRef.current) return;
    const r = dialRef.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    setLaunch({ x, y });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const obj = { r: 0 };
    gsap.to(obj, {
      r: 150,
      duration: reduce ? 0.01 : 0.72,
      ease: reduce ? "none" : "dhLaunch",
      onUpdate: () => {
        if (launchRef.current) {
          launchRef.current.style.clipPath = `circle(${obj.r}vmax at ${x}px ${y}px)`;
        }
      },
      onComplete: () => {
        if (onAsk) {
          onAsk(item);
        } else {
          navigate(`${chatHref}?q=${encodeURIComponent(item.q)}`);
        }
        setTimeout(() => setLaunch(null), 1200);
      },
    });
  };
  const showCard = ready && idle && !launch;
  const current = questions[active];

  return (
    // Outer wrapper preserves document height so About stays in place.
    // When parked (peek + not released), the sticky stage is visually offset
    // so only ~10% peeks above the fold — but the scroll space is still there.
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        zIndex: 3,
      }}
    >
      <section
        ref={sectionRef}
        className="dh relative"
        style={{
          height: `${count * 40 + 140}vh`,
          // Shift the sticky stage down when parked
          transform: "translateY(0)",
        }}
      >
        <style>{css}</style>

        <div
          ref={stageRef}
          className="dh-stage sticky top-0 h-screen overflow-hidden"
          style={{ "--rise": 1 }}
        >
          {/* dial */}
          <div ref={dialRef} className="dh-dial">
            <div className="dh-ring" />

            <span className="dh-num" data-card={showCard ? 1 : 0}>
              {pad(active + 1)}
            </span>

            {questions.map((it, i) => (
              <button
                key={it.label}
                type="button"
                onClick={() => jump(i)}
                className={`dh-label ${i === active ? "is-on" : ""}`}
                style={{ "--a": `${i * step - 90}deg` }}
                aria-label={`Go to ${it.label}`}
              >
                {it.label}
              </button>
            ))}

            <div ref={needleRef} className="dh-needle" aria-hidden="true">
              <i />
              <span className="dh-tick">{active + 1}</span>
            </div>
          </div>

          {/* question card */}
          <div
            key={active}
            data-show={showCard ? 1 : 0}
            onClick={() => showCard && ask(current)}
            className="dh-card absolute cursor-pointer left-1/2 top-1/2 z-30 w-[min(30vmin,250px)] -translate-x-1/2 -translate-y-1/2 text-neutral-900 max-md:bottom-[6vh] max-md:top-auto max-md:w-[min(88vw,380px)] max-md:translate-y-0 max-md:rounded-2xl max-md:bg-white max-md:p-5 max-md:shadow-2xl"
          >
            <p className="text-xs text-neutral-400">
              {pad(active + 1)} of {pad(count)} · {current.label}
            </p>
            <p className="mt-2 text-[clamp(15px,2.3vmin,19px)] font-medium leading-snug tracking-[-0.01em]">
              {current.q}
            </p>
            <button
              type="button"
              className="mt-4 rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* launch circle */}
        <div ref={launchRef} className="dh-launch" data-go={launch ? 1 : 0} aria-hidden="true" />
      </section>
    </div>
  );
}

const css = `
.dh{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
.dh-stage{--rise:0}

.dh-dial{
  --size:min(84vmin,700px);--r:calc(var(--size)/2 - 22px);
  position:absolute;left:50%;top:50%;z-index:15;width:var(--size);height:var(--size);
  border-radius:50%;background:#fff;color:#111;
  box-shadow:0 30px 80px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06);
  transform:translate(-50%,calc(-50% + (1 - var(--rise)) * 50vh)) scale(calc(.88 + .12 * var(--rise)));
  will-change:transform}
.dh-ring{position:absolute;inset:14px;border-radius:50%;border:1px solid #ececec;pointer-events:none}

.dh-num{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  font-size:clamp(4rem,15vmin,9.5rem);font-weight:300;letter-spacing:-.06em;color:#ececec;
  font-variant-numeric:tabular-nums;transition:opacity .25s;pointer-events:none}
.dh-num[data-card="1"]{opacity:0}

.dh-label{
  position:absolute;left:50%;top:50%;transform-origin:0 50%;
  transform:translateY(-50%) rotate(var(--a)) translateX(calc(var(--r) - 100%));
  white-space:nowrap;padding:8px 4px;border:0;background:none;cursor:pointer;
  font:inherit;font-size:clamp(10px,1.6vmin,13px);color:#b9b9b9;transition:color .2s}
.dh-label:hover,.dh-label:focus-visible{color:#555;outline:none}
.dh-label.is-on{color:#000}

.dh-needle{position:absolute;left:50%;top:50%;width:0;height:0;will-change:transform}
.dh-needle i{position:absolute;top:0;left:calc(var(--r) * .44);height:1px;background:#000;
  width:max(18px,calc(var(--r) * .56 - 118px))}
.dh-tick{position:absolute;top:-6px;left:calc(var(--r) * .44 - 16px);font-size:10px;color:#000}

.dh-card{opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease}
.dh-card[data-show="1"]{opacity:1;pointer-events:auto;animation:dh-in .35s ease both}
@keyframes dh-in{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:blur(0)}}
@media (max-width:767px){
  .dh-num[data-card="1"]{opacity:1}
  .dh-card:not([data-show="1"]){transform:translateY(16px)}
}

.dh-launch{position:fixed;inset:0;z-index:60;background:#fff;pointer-events:none;
  clip-path:circle(0% at 50% 50%)}
.dh-launch[data-go="1"]{pointer-events:auto}

@media (prefers-reduced-motion:reduce){
  .dh-card,.dh-label{transition:none}
  .dh-card[data-show="1"]{animation:none}
}
`;