import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const headingRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Text scramble effect
  function scrambleText(element, finalText, duration = 1500) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let frame = 0;
    const totalFrames = Math.ceil(duration / 16);
    const interval = setInterval(() => {
      element.textContent = finalText.split('').map((char, idx) => {
        if (char === ' ') return ' ';
        if (frame / totalFrames > idx / finalText.length) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      frame++;
      if (frame >= totalFrames) {
        element.textContent = finalText;
        clearInterval(interval);
      }
    }, 16);
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 80%',
        onEnter: () => {
          scrambleText(headingRef.current, "Let's build something.");
        },
        once: true
      });
    } else {
      headingRef.current.textContent = "Let's build something.";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <section id="contact">
      {/* Giant heading with text scramble */}
      <h2
        ref={headingRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          fontWeight: 800,
          lineHeight: 0.9,
          marginBottom: '1.5rem'
        }}
      >
        Let's build something.
      </h2>

      {/* Sub-content */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: 480, margin: '1.5rem 0' }}>
        Have a project in mind? Want to hire a developer who thinks deeply about UX and code equally?
        Let's talk.
      </p>

      {/* Email link */}
      <a
        href="mailto:priyanshu@email.com"
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: 'var(--accent-cyan)',
          display: 'inline-block',
          marginBottom: '2.5rem',
          textDecoration: 'none',
          transition: 'color 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
        onMouseLeave={(e) => e.target.style.color = 'var(--accent-cyan)'}
      >
        priyanshu@email.com
      </a>

      {/* Social row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
        <a
          href="https://github.com/YOUR_HANDLE"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          GitHub →
        </a>
        <a
          href="https://linkedin.com/in/YOUR_HANDLE"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--accent-indigo)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
        >
          LinkedIn →
        </a>
      </div>

      {/* Contact form */}
      <form
        style={{ maxWidth: 520, marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Your name"
          className="contact-input"
          required
        />
        <input
          type="email"
          placeholder="Your email"
          className="contact-input"
          required
        />
        <textarea
          placeholder="Your message"
          className="contact-input"
          rows={5}
          required
        />
        <button type="submit" className="contact-submit">
          {formSubmitted ? 'Sent!' : 'Send message →'}
        </button>
      </form>
    </section>
  );
}
