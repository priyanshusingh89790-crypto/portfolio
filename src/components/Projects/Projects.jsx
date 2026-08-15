import React, { useRef, useState, useEffect, Suspense } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import projectData from "../../utils/projectcontent";

// ── Icons ─────────────────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const ArrowRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ── WebGL 3D Components ───────────────────────────────────────────────────

const CarouselItem = ({ project, index, total }) => {
  const texture = useTexture(project.image);
  // Ensure texture displays sharply and correctly
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Dimensions for the massive curved screen
  const radius = 6.5;
  const height = 7;
  const sliceAngle = Math.PI / 3.2; // roughly 56 degrees

  // Center the slice so that at 0 rotation, it faces the +Z axis (camera)
  const thetaStart = -sliceAngle / 2;
  const anglePosition = index * ((Math.PI * 2) / total);

  return (
    <group rotation-y={anglePosition}>
      <mesh>
        <cylinderGeometry
          args={[radius, radius, height, 64, 1, true, thetaStart, sliceAngle]}
        />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle border outline for the curve */}
      <mesh>
        <cylinderGeometry
          args={[
            radius + 0.01,
            radius + 0.01,
            height + 0.02,
            64,
            1,
            true,
            thetaStart,
            sliceAngle,
          ]}
        />
        <meshBasicMaterial
          color={project.color}
          wireframe
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const WebGLCarousel = ({ springIndex, total }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;

    // Map the continuous spring index to rotation
    const currentIdx = springIndex.get();
    const targetRotation = currentIdx * ((Math.PI * 2) / total);

    // Rotate the entire group to bring the active index to the front (+Z axis)
    groupRef.current.rotation.y = -targetRotation;

    // Physical camera pullback effect during transitions
    const fraction = currentIdx % 1;
    const dist = Math.abs(fraction > 0.5 ? fraction - 1 : fraction);
    // Push the group back on Z axis smoothly when between integer indices
    groupRef.current.position.z = Math.sin(dist * Math.PI) * -2;

    // Subtle floaty hover motion based on time
    groupRef.current.position.y = Math.sin(performance.now() / 1000) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {projectData.map((project, i) => (
        <CarouselItem
          key={project.id}
          project={project}
          index={i}
          total={total}
        />
      ))}
    </group>
  );
};

// ── DOM UI Overlay ────────────────────────────────────────────────────────
const DOMOverlay = ({ springIndex }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsub = springIndex.on("change", (v) => {
      // Snap to closest integer for UI display
      setActiveIdx(Math.round(v) % projectData.length);
    });
    return () => unsub();
  }, [springIndex]);

  const project = projectData[activeIdx];

  if (!project) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 md:p-20 pb-20 z-10">
      {/* Dark gradient behind text for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 30, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto max-w-2xl"
        >
          <div className="flex gap-2 mb-5">
            <span className="text-[10px] font-bold px-3 py-1.5 bg-[#ef4423] text-white rounded uppercase tracking-[0.2em] shadow-lg">
              Featured
            </span>
            <span className="text-[10px] font-bold px-3 py-1.5 bg-white/10 text-white rounded uppercase tracking-[0.2em] backdrop-blur-md border border-white/10">
              {project.tech.slice(0, 2).join(", ")}
            </span>
          </div>

          <h3
            className="text-[clamp(2rem,6vw,7rem)] leading-[0.85] font-black uppercase tracking-tighter"
            style={{
              fontFamily: "var(--font-display)",
              color: "white",
              textShadow: "0 10px 30px rgba(0,0,0,0.8)",
            }}
          >
            {project.title.split("|")[0]}
          </h3>

          <p className="mt-6 text-white/80 text-sm md:text-lg leading-relaxed max-w-lg drop-shadow-md font-light">
            {project.description}
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Launch Experience <ArrowRight />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
export default function Projects() {
  const containerRef = useRef(null);

  // Drive progress via scroll over a 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = projectData.length;

  // Map 0-1 to 0-(total-1)
  const virtualIndex = useTransform(scrollYProgress, [0, 1], [0, total - 1]);

  // Cinematic heavy easing for physical momentum
  const springIndex = useSpring(virtualIndex, {
    stiffness: 30,
    damping: 15,
    mass: 1.5,
  });

  // Navigation Logic
  const handleNav = (direction) => {
    if (!containerRef.current) return;
    const currentIdx = Math.round(springIndex.get());
    let nextIdx = currentIdx + direction;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= total) nextIdx = total - 1;

    // Calculate scroll position for target index
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const targetScroll =
      window.scrollY + rect.top + (nextIdx / (total - 1)) * scrollableHeight;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const [activeInt, setActiveInt] = useState(0);
  useEffect(() => {
    const unsub = springIndex.on("change", (v) => setActiveInt(Math.round(v)));
    return () => unsub();
  }, [springIndex]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full h-[400vh] bg-[#020202]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 bg-[#020202]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-indigo)]/20 via-black to-black/80 opacity-50" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />
        </div>

        {/* WebGL Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.5} />
            <Suspense fallback={null}>
              <WebGLCarousel springIndex={springIndex} total={total} />
            </Suspense>
          </Canvas>
        </div>

        {/* DOM Editorial Text Overlay */}
        <DOMOverlay springIndex={springIndex} />

        {/* Navigation Arrows — move to bottom-center on mobile */}
        <div className="
          absolute z-50 pointer-events-auto
          bottom-6 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4
          md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-5
        ">
          {/* Previous - top */}
          <button
            onClick={() => handleNav(-1)}
            disabled={activeInt === 0}
            aria-label="Previous project"
            className="
      group
      flex
      items-center
      justify-center
      w-14
      h-14
      rounded-full
      border
      border-white/20
      bg-black/10
      backdrop-blur-md
      transition-all
      duration-300
      hover:border-white/70
      hover:bg-white/10
      hover:scale-110
      disabled:opacity-20
      disabled:hover:scale-100
      disabled:hover:border-white/20
    "
          >
            <div
              className="
        w-0
        h-0
        border-t-[7px]
        border-b-[7px]
        border-r-[11px]
        border-t-transparent
        border-b-transparent
        border-r-white
        opacity-70
        transition-all
        duration-300
        group-hover:opacity-100
        group-hover:-translate-x-1
        rotate-90
      "
            />
          </button>

          {/* Small vertical line */}
          <div className="h-12 w-px bg-white/20" />

          {/* Next - bottom */}
          <button
            onClick={() => handleNav(1)}
            disabled={activeInt === total - 1}
            aria-label="Next project"
            className="
      group
      flex
      items-center
      justify-center
      w-14
      h-14
      rounded-full
      border
      border-white/20
      bg-black/10
      backdrop-blur-md
      transition-all
      duration-300
      hover:border-white/70
      hover:bg-white/10
      hover:scale-110
      disabled:opacity-20
      disabled:hover:scale-100
      disabled:hover:border-white/20
    "
          >
            <div
              className="
        w-0
        h-0
        border-t-[7px]
        border-b-[7px]
        border-l-[11px]
        border-t-transparent
        border-b-transparent
        border-l-white
        opacity-70
        transition-all
        duration-300
        group-hover:opacity-100
        group-hover:translate-x-1
                rotate-90

      "
            />
          </button>
        </div>

        {/* Vertical Progress */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-3 z-50 mix-blend-difference text-white">
          <span className="text-[10px] font-mono tracking-widest">
            {String(activeInt + 1).padStart(2, "0")}
          </span>
          <div className="w-[1px] h-12 bg-white/20 relative">
            <motion.div
              className="absolute top-0 left-0 w-full bg-white origin-top"
              style={{
                scaleY: useTransform(virtualIndex, [0, total - 1], [0, 1]),
              }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-white/40">
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
