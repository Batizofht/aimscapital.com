"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

// Single client-side i18next instance for the whole site.
// Works with `output: "export"` (static site) because all translation happens in the browser.
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "fr"],
      interpolation: { escapeValue: false }, // React already escapes
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "aims_lang",
        caches: ["localStorage"],
      },
      react: { useSuspense: false },
    });
}

export default i18n;
