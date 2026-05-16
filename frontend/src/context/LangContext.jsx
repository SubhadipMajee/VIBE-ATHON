import React, { createContext, useContext, useState } from 'react';
import translations from '../data/translations';

const LangCtx = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
