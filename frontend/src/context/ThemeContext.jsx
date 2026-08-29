"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themesList = [
  { id: "light", name: "ChatGPT Light", isDark: false },
  { id: "dark", name: "ChatGPT Dark", isDark: true },
  { id: "midnight-slate", name: "Midnight Slate", isDark: true },
  { id: "emerald-light", name: "Emerald Breeze (Light)", isDark: false },
  { id: "emerald-dark", name: "Emerald Breeze (Dark)", isDark: true },
  { id: "purple-light", name: "Amethyst Purple (Light)", isDark: false },
  { id: "purple-dark", name: "Amethyst Purple (Dark)", isDark: true },
  { id: "cyberpunk", name: "Cyberpunk Neon", isDark: true },
];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark"); // Default to dark like chatgpt's standard setup

  useEffect(() => {
    // Read theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themesList.some(t => t.id === savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.documentElement.style.colorScheme = themesList.find(t => t.id === savedTheme)?.isDark ? "dark" : "light";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  const setTheme = (newTheme) => {
    if (themesList.some(t => t.id === newTheme)) {
      setThemeState(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.style.colorScheme = themesList.find(t => t.id === newTheme)?.isDark ? "dark" : "light";
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: themesList }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
