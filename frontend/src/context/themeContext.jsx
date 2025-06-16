"use client";
import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeWrapper({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen" data-theme={theme}>
      {children}
    </div>
  );
}
