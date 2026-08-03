"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

// Wraps the app so every client component can use useTranslation().
// Works with static export — i18next runs entirely in the browser.
export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
