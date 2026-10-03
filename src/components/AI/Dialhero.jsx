"use client";
/**
 * DialHero — scroll-driven "clock" that asks questions.
 *
 * Needs: React 18+, Tailwind v3.2+ (uses the max-md: variant). No other deps.
 * Usage:  <DialHero />  or  <DialHero onAsk={(q) => router.push(`/ask?q=${encodeURIComponent(q.q)}`)} />
 *
 * Just the dial, transparent, so it sits on your own page background.
 * Scroll spins the needle around the rim -> the moment scrolling stops, the
 * center turns into "Ask AI" -> click grows the white circle and opens the chat.
 * Pass peek to start with the dial half-hidden and rise on scroll.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dialhero.css";

const MOCK_QUESTIONS = [
  { label: "Proudest Project", q: "Which project are you proudest of?" },
  { label: "RAG Assistant", q: "How does your RAG assistant work?" },
  { label: "Tech Stack", q: "What's your tech stack?" },
  { label: "AI Projects", q: "Tell me about your AI projects" },
  { label: "Performance", q: "How do you handle performance?" },
  { label: "React", q: "What's your experience with React?" },
  { label: "System Design", q: "How do you design systems?" },
  { label: "Learning", q: "What are you learning now?" },
  { label: "WPP", q: "How does the WPP automation work?" },
  { label: "Testing", q: "What's your approach to testing?" },
  { label: "EWHENT", q: "Tell me about your work at EWHENT" },
  { label: "Hire Me", q: "Why should someone hire you?" },
];

const RISE = 0.22;
const PEEK_REVEAL_PROGRESS = 0.12;
const TAIL = 0.06;
const IDLE_MS = 200;
const DOCK_THRESHOLD = 0.94;
const DOCK_HYSTERESIS = 0.02;
const PEEK_TIMING = 1000;
const PEEK_RISE = 0.1;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const pad = (n) => String(n).padStart(2, "0");

export default function DialHero({
  questions = MOCK_QUESTIONS,
  chatHref = "/ask",
  onAsk,
  peek = false,
}) {
  const navigate = useNavigate();
  const count = questions.length;
  const step = 360 / count;
  const lead = peek ? RISE : 0;

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const dialRef = useRef(null);
  const needleRef = useRef(null);
  const s = useRef({ raw: 0, angle: 0, rise: peek ? PEEK_RISE : 1, riseV: peek ? PEEK_RISE : 1, handoff: 0, snap: true, idx: 0, ready: false });

  const [active, setActive] = useState(0);
  const [idle, setIdle] = useState(true);
  const [ready, setReady] = useState(false);
  const [launch, setLaunch] = useState(null);
  const [docked, setDocked] = useState(false);
  const [heroReleased, setHeroReleased] = useState(false);

  useEffect(() => {
    if (!peek) return;
    s.current.rise = PEEK_RISE;
    s.current.riseV = PEEK_RISE;
  }, [peek]);

  useEffect(() => {
    let timer;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = Math.max(1, r.height - window.innerHeight);
      const p = clamp(-r.top / range);
      const q = clamp((p - lead) / (1 - lead - TAIL));
      
      s.current.rise = peek
        ? PEEK_RISE + (1 - PEEK_RISE) * easeOut(clamp(p / PEEK_REVEAL_PROGRESS))
        : 1;

      s.current.handoff = heroReleased
        ? easeOut(clamp(p / PEEK_REVEAL_PROGRESS))
        : 0;
      
      s.current.raw = q * (count - 1) * step;
      s.current.snap = false;
      setIdle(false);
      
      const threshold = docked ? DOCK_THRESHOLD - DOCK_HYSTERESIS : DOCK_THRESHOLD;
      const shouldDock = q > threshold;
      
      if (shouldDock !== docked) {
        setDocked(shouldDock);
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
      stageRef.current?.style.setProperty("--handoff", st.handoff.toFixed(4));

      const idx = clamp(Math.round(st.angle / step), 0, count - 1);
      if (idx !== st.idx) {
        st.idx = idx;
        setActive(idx);
        if (navigator.vibrate) navigator.vibrate(6);
      }
      const isReady = st.riseV >= (peek ? PEEK_RISE : 0.985);
      if (isReady !== st.ready) {
        st.ready = isReady;
        setReady(isReady);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, step]);

  useEffect(() => {
    const dial = dialRef.current;
    const navSlot = document.getElementById('dial-nav-slot');
    if (!dial || !navSlot) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (docked) {
      const dialRect = dial.getBoundingClientRect();
      const navRect = navSlot.getBoundingClientRect();
      
      const deltaX = navRect.left + navRect.width / 2 - (dialRect.left + dialRect.width / 2);
      const deltaY = navRect.top + navRect.height / 2 - (dialRect.top + dialRect.height / 2);
      const scale = navRect.width / dialRect.width;
      
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

  const ask = (item) => {
    if (launch || !dialRef.current) return;
    const r = dialRef.current.getBoundingClientRect();
    setLaunch({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setTimeout(() => {
      if (onAsk) {
        onAsk(item);
        setTimeout(() => setLaunch(null), 1200);
      } else {
        navigate(`${chatHref}?q=${encodeURIComponent(item.q)}`);
      }
    }, 720);
  };

  const showCard = ready && idle && !launch && !docked;
  const current = questions[active];

  useEffect(() => {
    const handleHeroExitComplete = () => {
      setHeroReleased(true);
    };

    window.addEventListener("hero-exit-complete", handleHeroExitComplete);

    return () => {
      window.removeEventListener("hero-exit-complete", handleHeroExitComplete);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="dh relative"
      style={{
        height: `${count * 40 + 140}vh`,
        marginTop: 0,
        pointerEvents: 'none',
        zIndex: 150
      }}
    >
      <div ref={stageRef} className="dh-stage sticky top-0 h-screen overflow-hidden" style={{ 
        "--rise": peek ? PEEK_RISE : 1, 
        pointerEvents: 'auto'
      }}>
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

        <div
          key={active}
          data-show={showCard ? 1 : 0}
          onClick={() => showCard && ask(current)}
          className="dh-card absolute cursor-pointer left-1/2 top-1/2 z-[200] w-[min(30vmin,250px)] -translate-x-1/2 -translate-y-1/2 text-neutral-900 max-md:bottom-[6vh] max-md:top-auto max-md:w-[min(88vw,380px)] max-md:translate-y-0 max-md:rounded-2xl max-md:bg-white max-md:p-5 max-md:shadow-2xl"
        >
          <p className="text-xs text-neutral-400">
            {pad(active + 1)} of {pad(count)} · {current.label}
          </p>
          <p className="mt-2 text-[clamp(15px,2.3vmin,19px)] font-medium leading-snug tracking-[-0.01em]">
            {current.q}
          </p>
          <button
            type="button"
            className="mt-4 rounded-full px-2 py-1 text-sm text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black border border-white/20"
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #7fd1ae 100%)'
            }}
          >
            Ask AI
          </button>
        </div>
      </div>

      <div
        className="dh-launch"
        data-go={launch ? 1 : 0}
        style={launch ? { "--x": `${launch.x}px`, "--y": `${launch.y}px` } : undefined}
        aria-hidden="true"
      />
    </section>
  );
}
