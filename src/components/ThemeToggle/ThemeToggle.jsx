import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default is dark as requested
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`fixed bottom-8 right-[88px] z-[200] w-[44px] h-[44px] rounded-full backdrop-blur-md flex items-center justify-center cursor-none text-[1.1rem] transition-all duration-300 font-[family-name:var(--font-body)] hover:text-[var(--text-primary)] ${theme === 'light' ? 'bg-[rgba(0,0,0,0.25)] border-2 border-[#e5e7eb]' : 'bg-[var(--bg-card)] border border-[var(--border-glass)]'} ${theme === 'light' ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  );
}
