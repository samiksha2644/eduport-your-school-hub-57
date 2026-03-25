import React, { createContext, useContext, useState, useCallback } from "react";
import { translations, Language, TranslationKeys } from "@/i18n/translations";

interface LanguageContextType {
  lang: Language;
  t: TranslationKeys;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "mr" : "en"));
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
  }, []);

  const t = translations[lang] as TranslationKeys;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
