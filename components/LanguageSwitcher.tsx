"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const langs = [
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Français" },
];

export default function LanguageSwitcher({ variant = "header" }: { variant?: "header" | "mobile" }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch: render a stable default until mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? i18n.resolvedLanguage : "en") || "en";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [open]);

  const change = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2">
        {langs.map((l) => (
          <button
            key={l.code}
            onClick={() => change(l.code)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
              current.startsWith(l.code)
                ? "bg-white text-sky-600 border-white"
                : "text-white border-white/30 hover:bg-white/10"
            }`}
          >
            {l.full}
          </button>
        ))}
      </div>
    );
  }

  const activeLabel = langs.find((l) => current.startsWith(l.code))?.label || "EN";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {activeLabel}
        <svg className="w-3 h-3 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-navy-800 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                current.startsWith(l.code)
                  ? "bg-navy-700 text-white/90 font-semibold"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {l.full}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
