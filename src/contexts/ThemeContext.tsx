import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'compass-design-theme';

export type ThemeId = 'denim' | 'sapphire' | 'quartz' | 'indigo' | 'onyx';

export const THEME_IDS: ThemeId[] = [
  'denim',
  'sapphire',
  'quartz',
  'indigo',
  'onyx',
];

function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'denim';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && THEME_IDS.includes(stored as ThemeId)) return stored as ThemeId;
  return 'denim';
}

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme);
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (
        e.key === STORAGE_KEY &&
        e.newValue &&
        THEME_IDS.includes(e.newValue as ThemeId)
      ) {
        setThemeState(e.newValue as ThemeId);
        applyTheme(e.newValue as ThemeId);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
