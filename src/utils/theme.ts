/**
 * مدیریت حالت شب و روز (Dark Mode / Light Mode) برای گالری لوستر اکبر صالحی
 */

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'salehi_theme';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // بررسی تنظیمات سیستم‌عامل کاربر
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (err) {
    console.warn('Could not access localStorage for theme:', err);
  }
  return 'light';
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  window.dispatchEvent(new CustomEvent('app-theme-changed', { detail: { theme } }));
}

export function toggleTheme(): ThemeMode {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme(): void {
  const theme = getInitialTheme();
  applyTheme(theme);
}
