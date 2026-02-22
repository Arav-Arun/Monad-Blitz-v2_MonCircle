import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

// Google-style dark mode palette
export const DARK = {
  pageBg: "#131314",
  cardBg: "#1c1c1e",
  surfaceBg: "#242426",
  inputBg: "#2c2c2e",
  textPrimary: "#e8eaed",
  textSecondary: "#9aa0a6",
  textTertiary: "#5f6368",
  border: "#3c4043",
  borderStrong: "#5f6368",
  divider: "#3c4043",
  navBg: "rgba(19,19,20,0.95)",
  heroGradient:
    "linear-gradient(160deg, #1a1336 0%, #131314 45%, #0d0d20 100%)",
  promoBg: "rgba(110,84,255,0.1)",
  promoBorder: "rgba(110,84,255,0.25)",
} as const;

export const LIGHT = {
  pageBg: "#ffffff",
  cardBg: "#ffffff",
  surfaceBg: "#f4f4f5",
  inputBg: "#ffffff",
  textPrimary: "#09090b",
  textSecondary: "#52525b",
  textTertiary: "#a1a1aa",
  border: "#e4e4e7",
  borderStrong: "#d4d4d8",
  divider: "#f4f4f5",
  navBg: "rgba(255,255,255,0.95)",
  heroGradient:
    "linear-gradient(160deg, #F3F1FF 0%, #FAFAFA 45%, #F0F0FF 100%)",
  promoBg: "linear-gradient(135deg, #F3F1FF, #E9E5FF)",
  promoBorder: "#D5CCFF",
} as const;

export type ThemeColors = typeof DARK | typeof LIGHT;

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  c: ThemeColors; // shorthand for colors
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("monmart-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("monmart-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const c = theme === "dark" ? DARK : LIGHT;

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark: theme === "dark", c }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
