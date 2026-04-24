"use client";

import React, { createContext, useEffect, useState } from "react";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

export const DashboardThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
});

export default function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read theme after page load (hydration fix)
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme");

    if (saved) {
      setDarkMode(saved === "dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemDark);
    }

    setMounted(true);
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;

    const dashboardContainer = document.querySelector("[data-theme-dashboard]");
    if (!dashboardContainer) return;

    if (darkMode) {
      dashboardContainer.classList.add("dark");
      localStorage.setItem("dashboard-theme", "dark");
    } else {
      dashboardContainer.classList.remove("dark");
      localStorage.setItem("dashboard-theme", "light");
    }
  }, [darkMode, mounted]);

  // System preference live updates
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <DashboardThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
}
