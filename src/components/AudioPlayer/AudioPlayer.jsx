import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

// Use this FREE royalty-free ambient track (lofi/ambient, no copyright):
const AUDIO_URL = '/audio/ambient.mp3';
// OR place your own MP3 in /public/audio/ambient.mp3 and use '/audio/ambient.mp3'

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);
  const playingRef = useRef(false);
  const howlRef = useRef(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [AUDIO_URL],
      loop: true,
      volume: 0,
      autoplay: false,
      html5: true // Using HTML5 audio is better for larger files and auto-play policies
    });

    // Start on first scroll or click
    const startAudio = () => {
      if (!startedRef.current) {
        startedRef.current = true;
        howlRef.current.play();
        howlRef.current.fade(0, 0.12, 2000);
        setPlaying(true);
      }
    };
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('click', startAudio, { once: true });

    // Pause when tab hidden
    const handleVisibilityChange = () => {
      if (document.hidden) howlRef.current.pause();
      else if (playingRef.current) howlRef.current.play();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('click', startAudio);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  const toggle = () => {
    if (playing) {
      howlRef.current.fade(0.12, 0, 500);
      setPlaying(false);
    } else {
      howlRef.current.fade(0, 0.12, 500);
      howlRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      className={`fixed bottom-8 right-8 z-[200] w-[44px] h-[44px] rounded-full bg-[var(--bg-card)] border border-[var(--border-glass)] backdrop-blur-md flex items-center justify-center cursor-none text-[1.1rem] transition-colors duration-300 font-[family-name:var(--font-body)] ${playing ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
    >
      {playing ? '♫' : '♪'}
    </button>
  );
}
