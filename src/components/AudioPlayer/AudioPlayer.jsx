import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

// Use this FREE royalty-free ambient track (lofi/ambient, no copyright):
const AUDIO_URL = '/audio/ambient.mp3';
// OR place your own MP3 in /public/audio/ambient.mp3 and use '/audio/ambient.mp3'

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [loaderDone, setLoaderDone] = useState(false);
  const startedRef = useRef(false);
  const playingRef = useRef(false);
  const howlRef = useRef(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(newTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Initialize Howl with error handling
    howlRef.current = new Howl({
      src: [AUDIO_URL],
      loop: true,
      volume: 0.01,
      autoplay: false,
      html5: true,
      preload: 'auto',
      onload: () => {
        console.log('Audio loaded successfully, state:', howlRef.current.state());
      },
      onerror: (id, error) => {
        console.error('Howl error:', error);
      }
    });

    // Function to play audio and mark as started
    const playAudio = () => {
      console.log('playAudio called, startedRef:', startedRef.current);
      if (startedRef.current) {
        console.log('Audio already started, skipping');
        return;
      }

      startedRef.current = true;
      const audioState = howlRef.current.state();
      console.log('Current audio state:', audioState);

      if (audioState === 'loaded') {
        try {
          console.log('Audio is loaded, playing now...');
          const soundId = howlRef.current.play();
          console.log('Play sound ID:', soundId);
          howlRef.current.fade(0.01, 0.25, 800, soundId);
          setPlaying(true);
          console.log('Audio playing successfully');
        } catch (e) {
          console.error('Error playing audio:', e);
        }
      } else if (audioState === 'loading') {
        console.log('Audio still loading, waiting...');
        howlRef.current.once('load', () => {
          try {
            console.log('Audio loaded after wait, playing now...');
            const soundId = howlRef.current.play();
            console.log('Play sound ID:', soundId);
            howlRef.current.fade(0.01, 0.12, 2000, soundId);
            setPlaying(true);
            console.log('Audio playing successfully (after load)');
          } catch (e) {
            console.error('Error playing audio after load:', e);
          }
        });
      } else {
        console.log('Unknown audio state:', audioState, 'attempting play anyway');
        try {
          const soundId = howlRef.current.play();
          console.log('Play attempt sound ID:', soundId);
          howlRef.current.fade(0.01, 0.12, 2000, soundId);
          setPlaying(true);
          console.log('Audio playing from unknown state');
        } catch (e) {
          console.error('Error playing from unknown state:', e);
        }
      }
    };

    // Start on first user interaction (required for browser autoplay policies)
    const handleInteraction = () => {
      console.log('User interaction detected (after loader complete)');
      playAudio();
    };

    // Also listen for loader complete event - ONLY set up interaction listeners after this
    const handleLoaderComplete = () => {
      console.log('Loader complete event received - attempting auto-play');
      setLoaderDone(true);
      
      // Try to play immediately
      playAudio();
      
      // Also add interaction listeners for future toggles
      window.addEventListener('scroll', handleInteraction, { once: true });
      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
      window.addEventListener('keydown', handleInteraction, { once: true });
    };

    // ONLY listen for loader complete, don't add other listeners yet
    window.addEventListener('loaderComplete', handleLoaderComplete, { once: true });

    // Pause when tab hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (howlRef.current) howlRef.current.pause();
      } else if (playingRef.current && howlRef.current) {
        howlRef.current.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('loaderComplete', handleLoaderComplete);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  const toggle = () => {
    if (playing) {
      howlRef.current.fade(0.12, 0.01, 500);
      setTimeout(() => howlRef.current.pause(), 500);
      setPlaying(false);
    } else {
      howlRef.current.play();
      howlRef.current.fade(0.01, 0.12, 500);
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
