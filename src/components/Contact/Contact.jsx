import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const headingRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Text scramble effect
function scrambleText(element, finalText, duration = 1500) {
  if (!element) return;

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

  let frame = 0;
  const totalFrames = Math.ceil(duration / 16);

  const interval = setInterval(() => {
    // Stop immediately if the element no longer exists
    if (!element || !element.isConnected) {
      clearInterval(interval);
      return;
    }

    element.textContent = finalText
      .split('')
      .map((char, idx) => {
        if (char === ' ') return ' ';
        if (frame / totalFrames > idx / finalText.length) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    frame++;

    if (frame >= totalFrames) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 16);

  return interval;
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
    <section id="contact" className="px-4 py-20 sm:px-10 lg:px-16 lg:py-28 2xl:px-24 2xl:py-36">
      <div className="mx-auto max-w-[1600px]">
        {/* Giant heading */}
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,6vw,7rem)] font-extrabold leading-[0.9] mb-6"
        >
          Let's build something.
        </h2>

        <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-[480px] my-6">
          Have a project in mind? Want to hire a developer who thinks deeply about UX and code equally?
          Let's talk.
        </p>

        <a
          href="mailto:priyanshu@email.com"
          className="text-[clamp(0.9rem,2vw,1.5rem)] text-[#ef4423] inline-block mb-10 no-underline transition-colors duration-300 hover:text-[#ff6644]"
        >
          priyanshu@email.com
        </a>

        <div className="flex gap-6 mb-12">
          <a
            href="https://github.com/YOUR_HANDLE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-primary)] no-underline text-sm transition-colors duration-300 hover:text-[#ef4423]"
          >
            GitHub →
          </a>
          <a
            href="https://linkedin.com/in/YOUR_HANDLE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-primary)] no-underline text-sm transition-colors duration-300 hover:text-[#ef4423]"
          >
            LinkedIn →
          </a>
        </div>

        <form
          className="w-full max-w-[520px] mt-10 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input type="text" placeholder="Your name" className="contact-input" required />
          <input type="email" placeholder="Your email" className="contact-input" required />
          <textarea placeholder="Your message" className="contact-input" rows={5} required />
          <button type="submit" className="contact-submit">
            {formSubmitted ? 'Sent!' : 'Send message →'}
          </button>
        </form>
      </div>
    </section>
  );
}
