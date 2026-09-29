"use client";
/**
 * DialHero — scroll-driven "clock" that asks questions.
 *
 * Needs: React 18+, Tailwind v3.2+ (uses the max-md: variant). No other deps.
 * Usage:  <DialHero />  or  <DialHero onAsk={(q) => router.push(`/chat?q=${encodeURIComponent(q.q)}`)} />
 *
 * Just the dial, transparent, so it sits on your own page background.
 * Scroll spins the needle around the rim -> the moment scrolling stops, the
 * center turns into "Ask AI" -> click grows the white circle and opens the chat.
 * Pass peek to start with the dial half-hidden and rise on scroll.
 */
import { useCallback, useEffect, useRef, useState } from "react";

const MOCK_QUESTIONS = [
  { label: "Projects", q: "Which project are you proudest of, and why?" },
  { label: "WPP", q: "How did you automate multilingual InDesign campaigns?" },
  { label: "EWHENT", q: "What did you build on the ERP platform at EWHENT?" },
  { label: "Stack", q: "What does your day-to-day frontend stack look like?" },
  { label: "Agents", q: "How do you design an agentic AI workflow?" },
  { label: "n8n", q: "Which n8n automations have saved the most time?" },
  { label: "Performance", q: "How do you keep a React app fast as it grows?" },
  { label: "State", q: "Redux, context or something else: how do you choose?" },
  { label: "RAG", q: "How does this portfolio's RAG chatbot work?" },
  { label: "Hire me", q: "Why should a team hire you as a frontend developer?" },
  { label: "Learning", q: "What are you learning right now?" },
  { label: "Contact", q: "What's the best way to reach you?" },
];

const RISE = 0.22; // share of the scroll used by the question sequence
const PEEK_REVEAL_PROGRESS = 0.392; // reveal timing: ~half visible when the Hero finishes
const TAIL = 0.06; // dead scroll at the end so the last question can settle
const IDLE_MS = 200; // how long scrolling must stop before the needle locks
const DOCK_THRESHOLD = 0.94; // scroll progress threshold for docking (94%)
const DOCK_HYSTERESIS = 0.02; // hysteresis to prevent flicker (2%)
const PEEK_TIMING = 1000; // ms for peek entrance animation
const PEEK_RISE = 0.5; // rise value for peek position (0.5 = top half visible)

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const pad = (n) => String(n).padStart(2, "0");

export default function DialHero({
  questions = MOCK_QUESTIONS,
  chatHref = "/chat",
  onAsk,
  peek = false, // true: dial starts half-hidden and rises on scroll
}) {
  const count = questions.length;
  const step = 360 / count;
  const lead = peek ? RISE : 0;

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const dialRef = useRef(null);
  const needleRef = useRef(null);
  const s = useRef({ raw: 0, angle: 0, rise: peek ? PEEK_RISE : 1, riseV: peek ? PEEK_RISE : 1, snap: true, idx: 0, ready: false });

  const [active, setActive] = useState(0);
  const [idle, setIdle] = useState(true);
  const [ready, setReady] = useState(false);
  const [launch, setLaunch] = useState(null);
  const [docked, setDocked] = useState(false);

  // The dial is parked half-hidden at the bottom of the Hero while the Hero is sticky.
  // It only begins rising once normal document scrolling reaches this section.
  useEffect(() => {
    if (!peek) return;
    s.current.rise = PEEK_RISE;
    s.current.riseV = PEEK_RISE;
  }, [peek]);

  // scroll -> target angle + rise; idle timer decides when to snap
  useEffect(() => {
    let timer;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = Math.max(1, r.height - window.innerHeight);
      const p = clamp(-r.top / range);
      const q = clamp((p - lead) / (1 - lead - TAIL));
      
      // The first half is parked at the Hero's bottom. After the Hero ends,
      // normal scrolling lifts the dial toward the center.
      s.current.rise = peek
        ? PEEK_RISE + (1 - PEEK_RISE) * easeOut(clamp(p / PEEK_REVEAL_PROGRESS))
        : 1;
      
      s.current.raw = q * (count - 1) * step;
      s.current.snap = false;
      setIdle(false);
      
      // Check docking threshold (STATE 3)
      const threshold = docked ? DOCK_THRESHOLD - DOCK_HYSTERESIS : DOCK_THRESHOLD;
      const shouldDock = q > threshold;
      
      if (shouldDock !== docked) {
        setDocked(shouldDock);
        // Update nav slot visibility
        const navSlot = document.getElementById('dial-nav-slot');
        if (navSlot) {
          navSlot.style.opacity = shouldDock ? '1' : '0';
          navSlot.style.pointerEvents = shouldDock ? 'auto' : 'none';
        }
      }
      
      clearTimeout(timer);
      timer = setTimeout(() => {
        s.current.snap = true;
        setIdle(true);
      }, IDLE_MS);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, step, peek, lead, docked]);

  // animation loop: eases the needle and the rise, only touches transforms
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const tick = () => {
      const st = s.current;
      const target = st.snap ? Math.round(st.raw / step) * step : st.raw;
      st.angle += (target - st.angle) * (reduce ? 1 : st.snap ? 0.13 : 0.22);
      st.riseV += (st.rise - st.riseV) * (reduce ? 1 : 0.16);

      if (needleRef.current) needleRef.current.style.transform = `rotate(${st.angle - 90}deg)`;
      stageRef.current?.style.setProperty("--rise", st.riseV.toFixed(4));

      const idx = clamp(Math.round(st.angle / step), 0, count - 1);
      if (idx !== st.idx) {
        st.idx = idx;
        setActive(idx);
        if (navigator.vibrate) navigator.vibrate(6);
      }
      const isReady = st.riseV > 0.985;
      if (isReady !== st.ready) {
        st.ready = isReady;
        setReady(isReady);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, step]);

  // FLIP animation for docking to navbar
  useEffect(() => {
    const dial = dialRef.current;
    const navSlot = document.getElementById('dial-nav-slot');
    if (!dial || !navSlot) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (docked) {
      // Get positions
      const dialRect = dial.getBoundingClientRect();
      const navRect = navSlot.getBoundingClientRect();
      
      // Calculate the transform needed
      const deltaX = navRect.left + navRect.width / 2 - (dialRect.left + dialRect.width / 2);
      const deltaY = navRect.top + navRect.height / 2 - (dialRect.top + dialRect.height / 2);
      const scale = navRect.width / dialRect.width;
      
      // Store the FLIP values on the element
      dial.style.setProperty('--dock-x', `${deltaX}px`);
      dial.style.setProperty('--dock-y', `${deltaY}px`);
      dial.style.setProperty('--dock-scale', scale);
      dial.classList.add('dh-docked');
      
      if (reduce) {
        dial.style.transition = 'none';
      } else {
        dial.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease';
      }
    } else {
      dial.classList.remove('dh-docked');
      if (reduce) {
        dial.style.transition = 'none';
      } else {
        dial.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease';
      }
    }
  }, [docked]);

  // clicking a rim label scrolls the page to that hour
  const jump = useCallback(
    (i) => {
      const el = sectionRef.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = lead + (i / (count - 1)) * (1 - lead - TAIL);
      const top = el.getBoundingClientRect().top + window.scrollY + p * range;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [count, lead]
  );

  // the white circle grows from the dial's center, then we hand off to the chat
  const ask = (item) => {
    if (launch || !dialRef.current) return;
    const r = dialRef.current.getBoundingClientRect();
    setLaunch({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setTimeout(() => {
      if (onAsk) {
        onAsk(item);
        setTimeout(() => setLaunch(null), 1200);
      } else {
        window.location.assign(`${chatHref}?q=${encodeURIComponent(item.q)}`);
      }
    }, 720);
  };

  const showCard = ready && idle && !launch && !docked;
  const current = questions[active];

  return (
    <section
      ref={sectionRef}
      className="dh relative"
      style={{ 
        height: `${count * 40 + 140}vh`,
        marginTop: peek ? '-50vh' : 0,
        pointerEvents: 'none',
        zIndex: 150
      }}
    >
      <style>{css}</style>

      <div ref={stageRef} className="dh-stage sticky top-0 h-screen overflow-hidden"
        style={{ 
          "--rise": peek ? PEEK_RISE : 1, 
          pointerEvents: 'auto'
        }}
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
              ({it.label})
            </button>
          ))}

          <div ref={needleRef} className="dh-needle" aria-hidden="true">
            <i />
            <span className="dh-tick">{active + 1}</span>
          </div>
        </div>

        {/* question card: centered on the dial on desktop, bottom sheet on phones */}
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
            className="mt-4 rounded-full px-5 py-2 text-sm text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #7fd1ae 100%)',
              opacity: 0.9
            }}
          >
            Ask AI
          </button>
        </div>
      </div>

      {/* white circle that becomes the chat page */}
      <div
        className="dh-launch"
        data-go={launch ? 1 : 0}
        style={launch ? { "--x": `${launch.x}px`, "--y": `${launch.y}px` } : undefined}
        aria-hidden="true"
      />
    </section>
  );
}

const css = `
.dh{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
.dh-stage{--rise:0}

.dh-dial{
  --size:min(84vmin,700px);--r:calc(var(--size)/2 - 22px);
  position:absolute;left:50%;top:50%;z-index:150;width:var(--size);height:var(--size);
  border-radius:50%;background:#fff;color:#111;
  box-shadow:0 30px 80px rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.06);
  transform:translate(-50%,calc(-50% + (1 - var(--rise)) * 50vh)) scale(calc(.88 + .12 * var(--rise)));
  will-change:transform;transition:transform 1s cubic-bezier(0.22,1,0.36,1);pointer-events:auto}
.dh-dial.dh-docked{
  transform:translate(-50%,-50%) translate(var(--dock-x,0),var(--dock-y,0)) scale(var(--dock-scale,1));
  opacity:0}
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

.dh-card{opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;z-index:20}
.dh-card[data-show="1"]{opacity:1;pointer-events:auto;animation:dh-in .35s ease both}
@keyframes dh-in{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:blur(0)}}
@media (max-width:767px){
  .dh-num[data-card="1"]{opacity:1}
  .dh-card:not([data-show="1"]){transform:translateY(16px)}
}

.dh-launch{position:fixed;inset:0;z-index:60;background:#fff;pointer-events:none;
  clip-path:circle(0 at var(--x,50%) var(--y,50%));
  transition:clip-path .72s cubic-bezier(.7,0,.2,1)}
.dh-launch[data-go="1"]{clip-path:circle(150vmax at var(--x,50%) var(--y,50%));pointer-events:auto}

@media (prefers-reduced-motion:reduce){
  .dh-card,.dh-launch,.dh-label{transition:none}
  .dh-card[data-show="1"]{animation:none}
  .dh-dial{transition:none}
}
`;
