import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

const AUDIO_URL = '/audio/ambient.mp3';

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [theme, setTheme] = useState('dark');
  const startedRef = useRef(false);
  const playingRef = useRef(false);
  const howlRef = useRef(null);
  const ensureStartedRef = useRef(() => {});

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Two independent gates. Real playback only starts once BOTH are true:
    //   1) the loader has finished (your UX requirement)
    //   2) the browser has registered a genuine user gesture (its requirement,
    //      not yours — it will silently refuse sound without one)
    // Storing them on `window` means whichever gate fires first (even before
    // this component mounts) isn't lost — we check both every time either fires.
    if (typeof window.__loaderComplete === 'undefined') window.__loaderComplete = false;
    if (typeof window.__hasUserGesture === 'undefined') window.__hasUserGesture = false;

    howlRef.current = new Howl({
      src: [AUDIO_URL],
      loop: true,
      volume: 0.01,
      autoplay: false,
      html5: true,
      preload: 'auto',
      onerror: (id, error) => console.error('Howl load error:', error),
      onplayerror: (id, error) => {
        // This fires when the browser blocks the play() call itself.
        // Un-mark the gesture gate so the next real interaction retries.
        console.warn('Howl play blocked, will retry on next interaction:', error);
        startedRef.current = false;
      },
    });

    // The ONE place that's allowed to start playback for the first time.
    // startedRef is set synchronously as the very first line, so if two
    // handlers both call this within the same click event (e.g. the
    // window 'click' listener below AND the button's own onClick), the
    // second call just no-ops instead of double-triggering play/pause.
    const ensureStarted = () => {
      if (startedRef.current) return;
      if (!window.__loaderComplete || !window.__hasUserGesture) return;
      startedRef.current = true;

      const start = () => {
        try {
          const soundId = howlRef.current.play();
          howlRef.current.fade(0.01, 0.25, 800, soundId);
          setPlaying(true);
        } catch (e) {
          console.error('Error starting audio:', e);
          startedRef.current = false;
        }
      };

      if (howlRef.current.state() === 'loaded') {
        start();
      } else {
        howlRef.current.once('load', start);
      }
    };
    ensureStartedRef.current = ensureStarted;

    const onLoaderComplete = () => {
      window.__loaderComplete = true;
      ensureStarted();
    };

    const onInteraction = () => {
      window.__hasUserGesture = true;
      ensureStarted();
    };

    // If the loader event already fired before this component mounted,
    // this still catches it instead of waiting forever.
    if (window.__loaderComplete) ensureStarted();

    window.addEventListener('loaderComplete', onLoaderComplete);
    // click/touchstart/keydown reliably count as a "user gesture" for
    // autoplay purposes; scroll does not in most browsers, so it's
    // intentionally left out here.
    window.addEventListener('click', onInteraction);
    window.addEventListener('touchstart', onInteraction);
    window.addEventListener('keydown', onInteraction);

    const handleVisibilityChange = () => {
      if (!howlRef.current) return;
      if (document.hidden) howlRef.current.pause();
      else if (playingRef.current) howlRef.current.play();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('loaderComplete', onLoaderComplete);
      window.removeEventListener('click', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('keydown', onInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (howlRef.current) howlRef.current.unload();
    };
  }, []);

  const toggle = () => {
    if (!howlRef.current) return;

    // Clicking the button obviously counts as a real user gesture.
    window.__hasUserGesture = true;

    // If ambient audio hasn't started yet at all, this click IS the
    // start trigger — go through the single guarded starter and stop,
    // rather than also running the mute/unmute branch below on the
    // same click (that combination was the "turns off, click again to
    // play" bug).
    if (!startedRef.current) {
      ensureStartedRef.current();
      return;
    }

    if (playing) {
      howlRef.current.fade(0.25, 0.01, 500);
      setTimeout(() => howlRef.current.pause(), 500);
      setPlaying(false);
    } else {
      howlRef.current.play();
      howlRef.current.fade(0.01, 0.25, 500);
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      className={`fixed bottom-8 right-8 z-[200] w-[44px] h-[44px] rounded-full backdrop-blur-md flex items-center justify-center cursor-none text-[1.1rem] transition-all duration-300 font-[family-name:var(--font-body)] ${theme === 'light' ? 'bg-[rgba(0,0,0,0.25)] border-2 border-[#e5e7eb]' : 'bg-[var(--bg-card)] border border-[var(--border-glass)]'} ${playing ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
    >
      {playing ? '♫' : '♪'}
    </button>
  );
}