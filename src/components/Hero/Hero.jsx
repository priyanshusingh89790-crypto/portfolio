import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

const PORTRAIT = "./mypic.jpg"

const fd = "var(--font-display, sans-serif)"
const fm = "var(--font-body, monospace)"

export default function HeroAS() {
  const containerRef = useRef(null)

  // ── Primary hero scroll: 0→1 over the 300vh container
  const { scrollYProgress: sp } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })  // ── Cinematic exit: driven by the final 100vh of the 400vh container
  // sp goes 0→1 over 400vh, so the last 100vh = sp 0.75→1.0
  const exitProgress = useTransform(sp, [0.75, 1.0], [0, 1])
  const heroOpacity  = useTransform(exitProgress, [0, 0.6, 1], [1, 0.25, 0])
  const heroTransform = useTransform(exitProgress, [0, 0.6, 1], [
    "translate3d(0px, 0px, 0px) scale(1)",
    "translate3d(0px, -8px, -26px) scale(0.97)",
    "translate3d(0px, -20px, -70px) scale(0.95)",
  ])
  const lampOpacity  = useTransform(exitProgress, [0, 0.4, 0.8, 1], [1, 0.85, 0.2, 0])
  const lampScale    = useTransform(exitProgress, [0, 0.45, 0.8, 1], [1, 0.96, 0.82, 0.72])
  const lampY        = useTransform(exitProgress, [0, 0.5, 1], [0, 8, 24])
  const lampRotate   = useTransform(exitProgress, [0, 0.55, 1], [0, -3, -8])

  // ── Stage 1 — name fade-out on scroll
  const n1ScrollOp = useTransform(sp, [0, 0.37, 0.5], [1, 1, 0])
  const n2ScrollOp = useTransform(sp, [0, 0.34, 0.48], [1, 1, 0])

  const sideOp = useTransform(sp, [0.02, 0.12, 0.45, 0.55], [0, 1, 1, 0])
  const sideY  = useTransform(sp, [0.02, 0.12], ["2.5rem", "0rem"])
  const subOp  = useTransform(sp, [0.02, 0.1, 0.43, 0.53], [0, 1, 1, 0])

  // ── Stage 2 — Typography morphing (0.18 → 0.44)
  const n1LS = useTransform(sp, [0.18, 0.42], ["0.01em", "0.32em"])
  const n1SY = useTransform(sp, [0.22, 0.44], [1, 0.68])
  const n2SX = useTransform(sp, [0.2,  0.45], [1, 2.7])
  const n2SY = useTransform(sp, [0.2,  0.45], [1, 0.28])
  const n2LS = useTransform(sp, [0.18, 0.45], ["0.01em", "0.58em"])

  // ── Stage 3 — Portrait reveal (0.28 → 0.68) — compressed to fit 300vh portion
  const pClip = useTransform(sp,
    [0.21, 0.51],
    ["polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
     "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"]
  )
  const pOp    = useTransform(sp, [0.21, 0.32, 0.64, 0.72], [0, 1, 1, 0])
  const pScale = useTransform(sp, [0.21, 0.54], [1.14, 1.0])
  const pX     = useTransform(sp, [0.21, 0.49], ["5%", "0%"])

  // Layer swap — portrait overtakes text once it's fully revealed
  const pZIndex    = useTransform(sp, [0.2, 0.26], [10, 80])
  const textZIndex = useTransform(sp, [0.2, 0.26], [20, 4])

  // Orbital rings
  const s1Rot      = useTransform(sp, [0, 0.75], [0, 180])
  const sRingScale = useTransform(sp, [0.22, 0.44, 0.66, 0.72], [0, 1, 1, 0])
  const s1Op       = useTransform(sp, [0.24, 0.36, 0.66, 0.72], [0, 0.7, 0.7, 0])
  const s2Rot      = useTransform(sp, [0, 0.75], [45, 225])
  const s2Op       = useTransform(sp, [0.29, 0.41, 0.66, 0.72], [0, 0.45, 0.45, 0])

  // Floating fragments
  const fAOp = useTransform(sp, [0.29, 0.39, 0.57, 0.65], [0, 0.1, 0.1, 0])
  const fARot = useTransform(sp, [0.29, 0.57], [-6, 10])
  const fAY  = useTransform(sp, [0.29, 0.57], ["0rem", "-4.5rem"])
  const fMOp = useTransform(sp, [0.32, 0.42, 0.57, 0.65], [0, 0.07, 0.07, 0])
  const fMX  = useTransform(sp, [0.32, 0.57], ["0rem", "4rem"])

  // Diagonal line
  const diagRot = useTransform(sp, [0.34, 0.64], [-1, -6])
  const diagOp  = useTransform(sp, [0.33, 0.45, 0.64, 0.69], [0, 0.8, 0.8, 0])

  // Grid overlay
  const gridOp = useTransform(sp, [0.52, 0.64], [0, 0.85])

  const circRot     = useTransform(sp, [0, 0.75], [0, 720])
  const scrollIndOp = useTransform(sp, [0, 0.04, 0.14], [0, 1, 0])

  return (
    <>
      {/*
        ── 400vh total:
           0→300vh  = hero internal scroll stages (sp 0→0.75)
           300→400vh = cinematic exit transition (sp 0.75→1.0)
           About reads this same final 100vh window to slide up simultaneously.
      */}
      <div ref={containerRef} style={{ height: "400vh" }} className="relative">

        {/* ── Cinematic scale wrapper — perspective container */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            zIndex: 1,
            isolation: "isolate",
            // perspective on the outer container makes translateZ work
            perspective: "1200px",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              transform: heroTransform,
              opacity: heroOpacity,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              style={{ background: "#080808", color: "#f0ebe3", width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
            >
              {/* Grain */}
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  opacity: 0.022,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "128px",
                }}
              />

              {/* Grid overlay */}
              <motion.div className="absolute inset-0 pointer-events-none z-[2]" style={{ opacity: gridOp }}>
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={`v${i}`} className="absolute top-0 bottom-0 border-l"
                    style={{ left: `${(i + 1) * (100 / 12)}%`, borderColor: "rgba(240,235,227,0.04)" }} />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={`h${i}`} className="absolute left-0 right-0 border-t"
                    style={{ top: `${(i + 1) * (100 / 8)}%`, borderColor: "rgba(240,235,227,0.04)" }} />
                ))}
              </motion.div>

              {/* ── Lamp */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "13%",
                  top: "0.6rem",
                  zIndex: 35,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Wire */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "18vh", opacity: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.7,
                  }}
                  style={{
                    width: "1px",
                    background:
                      "linear-gradient(to bottom, rgba(240,235,227,0), rgba(240,235,227,.35))",
                    transformOrigin: "top center",
                  }}
                />

                {/* Lamp */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: "easeOut",
                    delay: 1.7,
                  }}
                  style={{
                    position: "relative",
                    width: "170px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    opacity: lampOpacity,
                    scale: lampScale,
                    y: lampY,
                    rotate: lampRotate,
                    transformOrigin: "top center",
                  }}
                >
                  {/* Bulb */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.34, 1.56, 0.64, 1],
                      delay: 1.85,
                    }}
                    style={{
                      position: "relative",
                      zIndex: 2,
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#fff8e8",
                      boxShadow:
                        "0 0 5px rgba(255,240,180,.8), 0 0 14px rgba(255,215,120,.35)",
                    }}
                  />

                  {/* Spotlight Cone */}
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 2,
                    }}
                    style={{
                      position: "absolute",
                      top: "7px",
                      transform: "translateX(-50%)",
                      transformOrigin: "top center",
                      width: "340px",
                      height: "170px",
                      clipPath: "polygon(50% 0%, 18% 100%, 82% 100%)",
                      background:
                        "linear-gradient(to bottom, rgba(255,235,170,.18) 0%, rgba(255,220,120,.08) 45%, rgba(255,210,80,0) 100%)",
                      filter: "blur(2px)",
                      zIndex: 1,
                    }}
                  />
                </motion.div>
              </div>

              {/* ── Left editorial column — hidden on mobile */}
              <motion.div className="absolute left-10 bottom-10 -translate-y-1/2 z-30 hidden sm:block" style={{ opacity: sideOp, y: sideY }}>
                <div className="flex flex-col">
                  <div className="pb-5">
                    <div style={{ fontFamily: fm, fontSize: "7px", letterSpacing: "0.52em" }} className="uppercase text-white/18 mb-1.5">Role</div>
                    <div style={{ fontFamily: fm, fontSize: "8px", letterSpacing: "0.2em" }} className="uppercase text-white/44">Creative Technologist</div>
                  </div>
                  <div className="w-px h-9 mb-5" style={{ background: "rgba(240,235,227,0.1)" }} />
                  <div className="pb-5">
                    <div style={{ fontFamily: fm, fontSize: "7px", letterSpacing: "0.52em" }} className="uppercase text-white/18 mb-1.5">Discipline</div>
                    <div style={{ fontFamily: fm, fontSize: "8px", letterSpacing: "0.2em" }} className="uppercase text-white/44">Frontend Engineer</div>
                  </div>
                  <div className="w-px h-9 mb-5" style={{ background: "rgba(240,235,227,0.1)" }} />

                </div>
              </motion.div>

              {/* ── Portrait with orbital rings */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-[52%]"
                style={{ opacity: pOp, scale: pScale, x: pX, zIndex: pZIndex }}
              >
                <motion.div className="absolute inset-0" style={{ clipPath: pClip }}>
                  <img src={PORTRAIT} alt="Priyanshu Singh"
                    className="w-full h-full object-cover object-top"
                    style={{ filter: "grayscale(100%) contrast(1.06) brightness(0.78)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to left, transparent 25%, rgba(8,8,8,0.12) 55%, rgba(8,8,8,0.6) 100%)" }} />
                </motion.div>
                <motion.div className="absolute rounded-full border" style={{
                  width: "66%", aspectRatio: "1/1", top: "50%", left: "50%",
                  x: "-50%", y: "-50%", borderColor: "rgba(240,235,227,0.08)",
                  rotate: s1Rot, scale: sRingScale, opacity: s1Op,
                }} />
                <motion.div className="absolute border" style={{
                  width: "44%", aspectRatio: "1/1", top: "50%", left: "50%",
                  x: "-50%", y: "-50%", borderColor: "rgba(240,235,227,0.05)",
                  rotate: s2Rot, scale: sRingScale, opacity: s2Op,
                }} />
              </motion.div>

              {/* ── Main typography */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center pl-[14%] select-none"
                style={{ zIndex: textZIndex }}
              >
                <div className="overflow-hidden leading-none">
                  <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                    style={{ scaleY: n1SY, letterSpacing: n1LS, opacity: n1ScrollOp, transformOrigin: "center bottom" }}
                  >
                    <span style={{ fontFamily: fd, fontWeight: 300, fontStyle: "normal", fontSize: "clamp(5rem, 13.5vw, 16rem)", lineHeight: 0.88, display: "block", color: "#f0ebe3" }}>
                      PRIYANSHU
                    </span>
                  </motion.div>
                </div>
                <div className="overflow-hidden leading-none">
                  <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
                    style={{ scaleX: n2SX, scaleY: n2SY, letterSpacing: n2LS, opacity: n2ScrollOp, transformOrigin: "left center" }}
                  >
                    <span style={{ fontFamily: fd, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(5rem, 13.5vw, 16rem)", lineHeight: 0.88, display: "block", color: "#f0ebe3" }}>
                      SINGH
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating fragments */}
              <motion.div className="absolute top-[20%] right-[56%] z-20 pointer-events-none" style={{ opacity: fAOp, rotate: fARot, y: fAY }}>
                <span style={{ fontFamily: fd, fontWeight: 300, fontSize: "clamp(4rem, 11vw, 13rem)", lineHeight: 1, color: "#f0ebe3", display: "block" }}>P</span>
              </motion.div>
              <motion.div className="absolute bottom-[22%] left-[40%] z-20 pointer-events-none" style={{ opacity: fMOp, x: fMX }}>
                <span style={{ fontFamily: fd, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2.5rem, 7.5vw, 9rem)", lineHeight: 1, color: "#f0ebe3", display: "block" }}>S</span>
              </motion.div>

              {/* Diagonal line */}
              <motion.div
                className="absolute top-1/2 left-[14%] right-0 h-px origin-left z-20 pointer-events-none"
                style={{ opacity: diagOp, rotate: diagRot, background: "rgba(240,235,227,0.07)" }}
              />

              {/* Bottom bar — hidden on mobile */}
              <motion.div className="absolute bottom-9 left-10 right-10 hidden sm:flex items-end justify-between z-40" style={{ opacity: subOp }}>
                <div className="flex items-center gap-5">
                  <span style={{ fontFamily: fm, fontSize: "8px", letterSpacing: "0.24em" }} className="uppercase text-white/30">
                    Interactive Developer — Digital Craftsman
                  </span>
                </div>
                <motion.div className="relative flex-shrink-0" style={{ width: "68px", height: "68px", rotate: circRot }}>
                  <svg viewBox="0 0 68 68" style={{ width: "100%", height: "100%" }}>
                    <defs>
                      <path id="ctp" d="M 34 34 m -24 0 a 24 24 0 1 1 48 0 a 24 24 0 1 1 -48 0" />
                    </defs>
                    <text style={{ fontFamily: fm, fontSize: "5.6px", letterSpacing: "2.5px", fill: "rgba(240,235,227,0.17)" }}>
                      <textPath href="#ctp">CREATIVE · TECHNOLOGIST · DEVELOPER ·</textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ color: "rgba(240,235,227,0.17)", fontSize: "10px" }}>✦</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div className="absolute right-10 bottom-9 flex flex-col items-center gap-2.5 z-40" style={{ opacity: scrollIndOp }}>
                <div className="w-px h-12 relative overflow-hidden" style={{ background: "rgba(240,235,227,0.1)" }}>
                  <motion.div
                    className="absolute left-0 right-0"
                    animate={{ top: ["-35%", "135%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ height: "35%", background: "rgba(240,235,227,0.4)" }}
                  />
                </div>
                <span style={{ fontFamily: fm, writingMode: "vertical-lr", fontSize: "6.5px", letterSpacing: "0.5em" }} className="uppercase text-white/20 mt-1">
                  Scroll
                </span>
              </motion.div>

            </div>
          </motion.div>
        </div>

      </div>
    </>
  )
}
