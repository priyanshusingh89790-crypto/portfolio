import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

// Use this FREE royalty-free ambient track (lofi/ambient, no copyright):
const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
// OR place your own MP3 in /public/audio/ambient.mp3 and use '/audio/ambient.mp3'

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const howlRef = useRef(null);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [AUDIO_URL],
      loop: true,
      volume: 0,
      autoplay: false
    });

    // Start on first scroll or click
    const startAudio = () => {
      if (!started) {
        howlRef.current.play();
        howlRef.current.fade(0, 0.12, 2000);
        setPlaying(true);
        setStarted(true);
      }
    };
    window.addEventListener('scroll', startAudio, { once: true });
    window.addEventListener('click', startAudio, { once: true });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) howlRef.current.pause();
      else if (playing) howlRef.current.play();
    });

    return () => howlRef.current.unload();
  }, [started, playing]);

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
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 200,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        color: playing ? 'var(--accent-cyan)' : 'var(--text-muted)',
        fontSize: '1.1rem',
        transition: 'color 0.3s',
        fontFamily: 'var(--font-body)'
      }}
    >
      {playing ? '♫' : '♪'}
    </button>
  );
}
