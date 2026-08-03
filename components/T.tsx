"use client";

import { useTranslation } from "react-i18next";

// Tiny client-side translator for use inside server components.
// Renders the translation for `k` (with optional interpolation values).
export default function T({ k, values }: { k: string; values?: Record<string, string> }) {
  const { t } = useTranslation();
  return <>{t(k, values)}</>;
}
