"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PracticeAreaModal({ title, details }: { title: string; details: string }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors mt-3"
      >
        {t("practiceAreas.readMore")} <ArrowRight className="w-3 h-3" />
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-8 sm:pt-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShow(false)} />
          <div className="relative bg-navy-800 rounded-2xl max-w-lg w-full shadow-2xl mx-4 border border-white/10">
            <div className="sticky top-0 bg-navy-800 rounded-t-2xl border-b border-white/10 px-6 md:px-8 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
              <button
                onClick={() => setShow(false)}
                className="w-8 h-8 rounded-full bg-navy-700 hover:bg-navy-600 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 md:px-8 py-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              <div className="space-y-4 text-white/90 leading-relaxed text-sm sm:text-base">
                <p>{details}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
