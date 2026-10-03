import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink, Github, Globe, Paperclip, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { analyzeJobDescription, sendChatMessage } from "../services/chatService";

const QUESTIONS = [

  "What can Priyanshu build?",

  "What are Priyanshu's strongest technical skills?",

  "Tell me about Priyanshu's best projects",

  "Show me Priyanshu's AI work",

  "How does Priyanshu's portfolio AI work?",

  "What has Priyanshu built with React?",

  "What full-stack applications has Priyanshu built?",

  "What has Priyanshu built with AI and RAG?",

  "How does Priyanshu integrate LLMs into applications?",

  "What makes Priyanshu's projects technically interesting?",

  "Show me Priyanshu's GitHub projects",

  "What is Priyanshu currently learning?",

  "Why should we hire Priyanshu?",

  "What kind of developer is Priyanshu?",

  "How does Priyanshu approach building a project?",

  "What technologies does Priyanshu use to build AI applications?"

];

// design constants measured from the reference (1838 x 922)
const DW = 1838, DH = 922;
const CX = 341;          // dial / circle centre x
const CIRCLE_R = 614;    // white circle radius
const DOT_R = 582;       // dots arc radius
const TEXT_R = 636;      // label start radius
const BUMP = 95;         // active label push-out
const STEP = 5;        // degrees between items
const ACTIVE = "#ff7a1a";
const INK = "#12141f";

export default function AskPage() {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get("q") || "";
  const [size, setSize] = useState({ w: DW, h: DH });
  const [pos, setPos] = useState(0);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const fileInput = useRef(null);

  const proxy = useRef({ v: 0 });
  const target = useRef(0);
  const lastWheel = useRef(0);
  const drag = useRef(null);
  const knob = useRef(null);
  const ring = useRef(null);
  const scroller = useRef(null);
  const moved = useRef(false);

  const s = size.h / DH;                 // scale factor
  const cx = (CX / DW) * size.w;         // centre x in px
  const cy = size.h / 2;
  const active = Math.round(pos);

  /* ---------- resize ---------- */
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  /* ---------- wheel navigation ---------- */
  const goTo = (i) => {
    const t = Math.max(0, Math.min(QUESTIONS.length - 1, i));
    target.current = t;
    gsap.to(proxy.current, {
      v: t, duration: 0.8, ease: "power3.out", overwrite: true,
      onUpdate: () => setPos(proxy.current.v),
    });
  };

  const onWheel = (e) => {
    const now = performance.now();
    if (now - lastWheel.current < 90) return;
    lastWheel.current = now;
    goTo(target.current + Math.sign(e.deltaY));
  };

  useEffect(() => {
    const key = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowDown") goTo(target.current + 1);
      if (e.key === "ArrowUp") goTo(target.current - 1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const onPointerDown = (e) => { drag.current = e.clientY; moved.current = false; };
  const onPointerMove = (e) => {
    if (drag.current == null) return;
    const dy = e.clientY - drag.current;
    if (Math.abs(dy) > 44 * s) {
      moved.current = true;
      goTo(target.current - Math.sign(dy));
      drag.current = e.clientY;
    }
  };
  const onPointerUp = () => { drag.current = null; };

  /* ---------- custom cursor ---------- */
  useEffect(() => {
    const xTo = gsap.quickTo(ring.current, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(ring.current, "y", { duration: 0.35, ease: "power3" });
    const mv = (e) => { xTo(e.clientX - 17); yTo(e.clientY - 17); };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  /* ---------- dial shrinks to corner after first message ---------- */
  useEffect(() => {
    const started = messages.length > 0;
    gsap.to(knob.current, {
      scale: started ? 0.24 : 1,
      x: started ? 72 * s - cx : 0,
      y: started ? 72 * s - cy : 0,
      duration: 1,
      ease: "power4.inOut",
    });
    // eslint-disable-next-line
  }, [messages.length > 0, size.w, size.h]);

  /* ---------- keep chat pinned to the latest message ---------- */
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // If AskAiHero sent a question, run it automatically on this page.
  useEffect(() => {
    if (!initialQuestion) return;
    send(initialQuestion);
  }, [initialQuestion]);

  /* ---------- sending ---------- */
  const send = async (text) => {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true);
    setDraft("");
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: q }, { id: id + 1, role: "ai", text: "" }]);

    try {
      const response = await sendChatMessage(q);
      const answer = response.answer;

      // typing effect
      let i = 0;
      const tick = setInterval(() => {
        i += 2;
        setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, text: answer.slice(0, i) } : x)));
        if (i >= answer.length) { clearInterval(tick); setBusy(false); }
      }, 16);
    } catch (error) {
      setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, text: `Error: ${error.message}` } : x)));
      setBusy(false);
    }
  };

  const extractFileText = async (file) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".txt") || name.endsWith(".md")) return file.text();
    if (name.endsWith(".pdf")) {
      const pdfjs = await import("pdfjs-dist");
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const pages = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => item.str || "").join(" "));
      }
      return pages.join("\n\n");
    }
    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      return (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
    }
    throw new Error("Please upload a TXT, MD, PDF, or DOCX job description.");
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setSelectedFile(file.name);
    try {
      const text = await extractFileText(file);
      if (!text.trim()) throw new Error("Could not extract any text from this file.");
      const result = await analyzeJobDescription(text);
      const strong = (result.strong_matches || []).map((x) => `- **${x.requirement}** — ${x.evidence}`).join("\n");
      const partial = (result.partial_matches || []).map((x) => `- **${x.requirement}** — ${x.evidence}`).join("\n");
      const gaps = (result.gaps || []).map((x) => `- **${x.requirement}** — ${x.evidence}`).join("\n");
      setMessages((m) => [...m,
        { id: Date.now(), role: "user", text: `Analyze this job description: **${file.name}**` },
        { id: Date.now() + 1, role: "ai", text: `### JD Match — ${result.fit_score ?? 0}%\n\n${result.summary || "Analysis completed."}\n\n**Strong matches**\n${strong || "- None"}\n\n**Partial matches**\n${partial || "- None"}\n\n**Not demonstrated**\n${gaps || "- None"}` }
      ]);
    } catch (error) {
      setMessages((m) => [...m, { id: Date.now(), role: "ai", text: `Error: ${error.message}` }]);
    } finally {
      setBusy(false);
      setSelectedFile("");
    }
  };
  const onItemClick = (i) => {
    if (moved.current) return;
    if (i === active) send(QUESTIONS[i]);
    else goTo(i);
  };

  /* ---------- helpers ---------- */
  const px = (n) => n * s;
  const dialRot = pos * 24;

  return (
    <div
      onWheel={onWheel}
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: "#e8e9ed", fontFamily: "'Inter', system-ui, sans-serif", color: INK }}
    >
      {/* big white circle = the ")" curve */}
      <div
        className="absolute rounded-full"
        style={{
          width: px(CIRCLE_R * 2), height: px(CIRCLE_R * 2),
          left: cx - px(CIRCLE_R), top: cy - px(CIRCLE_R),
          background: "linear-gradient(180deg,#ffffff 0%,#f4f5f8 100%)",
        }}
      />

      {/* dial */}
      <div
        ref={knob}
        className="absolute"
        style={{ width: px(334), height: px(334), left: cx - px(167), top: cy - px(167), zIndex: 5, pointerEvents: "none" }}
      >
        <svg viewBox="-167 -167 334 334" width="100%" height="100%">
          <defs>
            <radialGradient id="disc" cx="50%" cy="38%" r="70%">
              <stop offset="0" stopColor="#1a1b22" />
              <stop offset="1" stopColor="#030304" />
            </radialGradient>
          </defs>
          <circle r="167" fill="#e8e9ec" />
          <circle r="150" fill="url(#disc)" />
          <g style={{ transform: `rotate(${dialRot}deg)` }}>
            <circle r="68" fill="#fff" />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="-17" y="-100" width="34" height="60" rx="15" fill="#fff"
                transform={`rotate(${i * 45})`} />
            ))}
          </g>
          <g style={{ transform: `rotate(${-dialRot * 0.6}deg)` }} stroke="#fff" strokeWidth="7" strokeLinecap="round">
            {[0, 120, 240].map((a) => (
              <line key={a} x1="0" y1="-142" x2="0" y2="-126" transform={`rotate(${a + 15})`} />
            ))}
          </g>
        </svg>
      </div>

      {/* CHAT (left) */}
      <div
        className="absolute flex flex-col"
        style={{ left: px(56), top: 0, bottom: 0, width: px(560), zIndex: 10 }}
      >
        <div
          ref={scroller}
          data-lenis-prevent
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: px(messages.length ? 150 : 0),
            paddingRight: px(12),
            scrollbarWidth: "none",
            maskImage: "linear-gradient(to bottom, transparent 0, #000 12%, #000 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 12%, #000 100%)",
          }}
        >
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: px(34) }}>
              <div style={{ fontSize: px(12), letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.45, marginBottom: px(8) }}>
                {m.role === "user" ? "You" : "AI"}
              </div>
              <div
                style={{
                  fontSize: px(m.role === "user" ? 34 : 22),
                  lineHeight: 1.25,
                  fontWeight: 400,
                  color: m.role === "user" ? ACTIVE : INK,
                  letterSpacing: "-0.01em",
                }}
              >
                {m.text ? (
                  m.role === "ai" ? (
                    <div className="ai-markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p>{children}</p>,
                          strong: ({ children }) => <strong>{children}</strong>,
                          ul: ({ children }) => <ul>{children}</ul>,
                          ol: ({ children }) => <ol>{children}</ol>,
                          li: ({ children }) => <li>{children}</li>,
                          br: () => <br />,
                          a: ({ href, children }) => {
                            const isGithub = /github\.com/i.test(href || "");
                            const isLive = !isGithub && /^(https?:\/\/)/i.test(href || "");
                            const label = isGithub ? "GitHub Repository" : isLive ? "Open Link" : "External Link";
                            const Icon = isGithub ? Github : Globe;
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="ai-link-card"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="ai-link-icon"><Icon size={18} strokeWidth={1.8} /></span>
                                <span className="ai-link-copy">
                                  <span className="ai-link-label">{label}</span>
                                  <span className="ai-link-title">{children}</span>
                                </span>
                                <ExternalLink className="ai-link-arrow" size={17} strokeWidth={1.8} />
                              </a>
                            );
                          },
                          table: ({ children }) => <div className="ai-table-wrap"><table>{children}</table></div>,
                          th: ({ children }) => <th>{children}</th>,
                          td: ({ children }) => <td>{children}</td>,
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    m.text
                  )
                ) : "…"}
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingBottom: px(64), paddingTop: px(16) }}>
          <div className="relative">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(draft)}
              placeholder={selectedFile || "Ask me anything…"}
              disabled={busy}
              className="w-full bg-transparent outline-none pr-24"
              style={{
                fontSize: px(24), fontWeight: 400, letterSpacing: "-0.01em",
                borderBottom: `${Math.max(1, px(2))}px solid ${INK}`, paddingBottom: px(10),
              }}
            />
            <input ref={fileInput} type="file" accept=".txt,.md,.pdf,.docx" onChange={onFileChange} className="hidden" />
            <div className="absolute right-0 bottom-1 flex items-center gap-2">
              <button type="button" aria-label="Upload job description" title="Upload job description" disabled={busy}
                onClick={() => fileInput.current?.click()}
                className="grid place-items-center rounded-full transition-all duration-200 hover:bg-black/5 disabled:opacity-40"
                style={{ width: px(38), height: px(38) }}>
                <Paperclip size={px(20)} strokeWidth={1.8} />
              </button>
              <button type="button" aria-label="Send message" title="Send" disabled={busy || !draft.trim()}
                onClick={() => send(draft)}
                className="grid place-items-center rounded-full text-white transition-all duration-200 hover:scale-105 disabled:opacity-30"
                style={{ width: px(38), height: px(38), background: INK }}>
                <ArrowUp size={px(20)} strokeWidth={2.1} />
              </button>
            </div>
          </div>      </div>
      </div>

      <style>{`
        .ai-markdown { font-size: ${px(22)}px; line-height: 1.5; letter-spacing: -0.01em; }
        .ai-markdown p { margin: 0 0 ${px(22)}px; }
        .ai-markdown p:last-child { margin-bottom: 0; }
        .ai-markdown strong { font-weight: 650; color: #080a10; }
        .ai-markdown ul, .ai-markdown ol { margin: 0 0 ${px(22)}px; padding-left: ${px(28)}px; }
        .ai-markdown li { margin: 0 0 ${px(8)}px; padding-left: ${px(3)}px; }
        .ai-markdown li::marker { color: #ff6b35; }
        .ai-link-card {
          display: flex; align-items: center; gap: ${px(14)}px; width: 100%;
          box-sizing: border-box; margin: ${px(24)}px 0; padding: ${px(15)}px ${px(16)}px;
          border: 1px solid rgba(18,20,31,.12); border-radius: ${px(16)}px;
          background: rgba(255,255,255,.68); color: #12141f; text-decoration: none;
          box-shadow: 0 10px 30px rgba(18,20,31,.06);
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .ai-link-card:hover { transform: translateY(-3px); border-color: rgba(255,107,53,.5); background: #fff; box-shadow: 0 16px 36px rgba(18,20,31,.11); }
        .ai-link-icon { width: ${px(38)}px; height: ${px(38)}px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 11px; background: #12141f; color: #fff; }
        .ai-link-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .ai-link-label { font-size: ${px(10)}px; letter-spacing: .14em; text-transform: uppercase; opacity: .45; }
        .ai-link-title { font-size: ${px(15)}px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ai-link-arrow { flex: 0 0 auto; opacity: .5; transition: transform .25s ease, opacity .25s ease; }
        .ai-link-card:hover .ai-link-arrow { transform: translate(2px,-2px); opacity: 1; }
        .ai-table-wrap { width: 100%; overflow-x: auto; margin: ${px(22)}px 0; border: 1px solid rgba(18,20,31,.1); border-radius: ${px(14)}px; background: rgba(255,255,255,.5); }
        .ai-table-wrap table { width: 100%; border-collapse: collapse; min-width: 420px; font-size: ${px(15)}px; }
        .ai-table-wrap th, .ai-table-wrap td { text-align: left; padding: ${px(11)}px ${px(13)}px; border-bottom: 1px solid rgba(18,20,31,.08); }
        .ai-table-wrap th { font-weight: 650; background: rgba(18,20,31,.04); }
        .ai-table-wrap tr:last-child td { border-bottom: 0; }
        @media (max-width: 767px) {
          .ai-markdown { font-size: 17px; line-height: 1.48; }
          .ai-markdown p { margin-bottom: 18px; }
          .ai-link-card { margin: 18px 0; padding: 13px; border-radius: 14px; }
          .ai-link-title { font-size: 14px; }
        }
      `}</style>

      {/* WHEEL (right, fixed) */}
      <div
        className="absolute"
        style={{ left: cx, top: cy, width: 0, height: 0, zIndex: 8, cursor: "pointer", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {QUESTIONS.map((q, i) => {
          const off = i - pos;
          if (Math.abs(off) > 14) return null;
          const a = off * STEP;
          const near = Math.max(0, 1 - Math.abs(off));
          const isActive = i === active;
          return (
            <div key={q}>
              {/* dot */}
              <div
                className="absolute"
                style={{
                  left: 0, top: 0, transformOrigin: "0 0",
                  transform: `rotate(${a}deg) translate(${px(DOT_R)}px, -50%)`,
                }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: px(isActive ? 13 : 9), height: px(isActive ? 13 : 9),
                    marginLeft: px(isActive ? -6 : -4.5),
                    background: isActive ? "#ff3b30" : "#b9bbc3",
                    transform: "translateY(0)",
                  }}
                />
              </div>
              {/* dash for active */}
              <div
                className="absolute rounded-full"
                style={{
                  left: 0, top: 0, transformOrigin: "0 0",
                  width: px(53), height: px(7), background: INK,
                  opacity: near > 0.5 ? (near - 0.5) * 2 : 0,
                  transform: `rotate(${a}deg) translate(${px(499)}px, -50%)`,
                }}
              />
              {/* label */}
              <div
                onClick={() => onItemClick(i)}
                className="absolute whitespace-nowrap"
                style={{
                  left: 0, top: 0, transformOrigin: "0 0",
                  fontSize: px(24), fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1,
                  color: isActive ? ACTIVE : INK,
                  transform: `rotate(${a}deg) translate(${px(TEXT_R + BUMP * near)}px, -50%)`,
                  transition: "color .25s",
                }}
              >
                {q}
              </div>
            </div>
          );
        })}
      </div>

      {/* footer labels */}
      <div className="absolute" style={{ left: px(19), bottom: px(14), fontSize: px(13), color: "#8a8b93", zIndex: 12 }}>
        © Your Name
      </div>
      <div className="absolute flex items-center" style={{ right: px(8), bottom: px(14), fontSize: px(13), color: "#55565e", fontWeight: 500, zIndex: 12 }}>
        <span className="rounded-full" style={{ width: px(5), height: px(5), background: "#4a90e2", marginRight: px(8) }} />
        Click to ask
      </div>

      {/* custom cursor */}
      <div
        ref={ring}
        className="fixed pointer-events-none hidden md:block"
        style={{ left: 0, top: 0, width: 34, height: 34, border: "1.5px solid #5a5b63", borderRadius: "50%", zIndex: 50 }}
      >
        <span className="absolute rounded-full" style={{ width: 3, height: 3, background: "#12141f", left: 14, top: 14 }} />
      </div>
    </div>
  );
}
