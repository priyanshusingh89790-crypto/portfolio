import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef   = useRef(null);
  const logoRef     = useRef(null);
  const progressRef = useRef(null);  // the track div
  const barRef      = useRef(null);  // the fill bar
  const counterRef  = useRef(null);
  const topPanelRef = useRef(null);
  const btmPanelRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      loaderRef.current.style.display = 'none';
      if (onComplete) onComplete();
      return;
    }

    const tl = gsap.timeline();

    // 1. Progress bar grows center → left & right via scaleX
    tl.to(barRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: function () {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(this.progress() * 100) + '%';
        }
      },
    });

    // 2. Small pause at 100%
    tl.to({}, { duration: 0.15 });

    // 3. Logo + progress fade out
    tl.to([logoRef.current, progressRef.current, counterRef.current], {
      opacity: 0,
      y: -6,
      duration: 0.3,
      ease: 'power2.in',
    });

    // 4. The two panels split: top shoots up, bottom shoots down
    //    They start overlapping the full screen (each is 50vh tall)
    //    and fly out simultaneously
    tl.to(topPanelRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut',
    }, '-=0.05');

    tl.to(btmPanelRef.current, {
      yPercent: 100,
      duration: 0.7,
      ease: 'power4.inOut',
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = 'none';
        if (onComplete) onComplete();
      },
    }, '<'); // same time as top panel

  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* Top panel — white, covers top half */}
      <div
        ref={topPanelRef}
        className="absolute left-0 right-0 top-0 h-1/2 bg-white"
        style={{ transformOrigin: 'top center' }}
      />

      {/* Bottom panel — white, covers bottom half */}
      <div
        ref={btmPanelRef}
        className="absolute left-0 right-0 bottom-0 h-1/2 bg-white"
        style={{ transformOrigin: 'bottom center' }}
      />

      {/* Content sits on top of panels, centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={logoRef}
          className="font-[family-name:var(--font-display)] text-[4rem] font-extrabold text-[#ef4423] mb-8 select-none"
        >
          PS
        </div>

        {/* Progress track */}
        <div
          ref={progressRef}
          className="w-screen h-[2px] bg-zinc-100 overflow-hidden mb-4"
        >
          {/* Fill bar — grows from center outward via scaleX */}
          <div
            ref={barRef}
            className="h-full w-full bg-zinc-100"
            style={{ transform: 'scaleX(0)', transformOrigin: 'center' }}
          />
        </div>

        <div
          ref={counterRef}
          className="text-black/30 text-sm font-[family-name:var(--font-body)] select-none"
        >
          0%
        </div>
      </div>
    </div>
  );
}
