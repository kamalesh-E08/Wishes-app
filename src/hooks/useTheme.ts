import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check nova-theme first, fallback to theme
      const saved = localStorage.getItem('nova-theme') || localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      
      // System preference fallback
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('nova-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nova-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? 'dark' : 'light';

  return { theme, toggle: toggleTheme, toggleTheme, isDark };
}
