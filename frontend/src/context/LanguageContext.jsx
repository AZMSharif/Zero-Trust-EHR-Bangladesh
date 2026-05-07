import React, { createContext, useContext, useState, useCallback } from "react";
import dictionary from "../i18n/dictionary";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("ehr-lang") || "en");

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "bn" : "en";
      localStorage.setItem("ehr-lang", next);
      return next;
    });
  }, []);

  // Translation helper — returns the translated string for the given key
  const t = useCallback(
    (key) => {
      const entry = dictionary[key];
      if (!entry) return key; // Fallback: return the key itself
      return entry[lang] || entry.en || key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
