"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] px-4 pb-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-navy-850 border border-white/15 rounded-xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-navy-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
          </div>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            We use cookies to improve your experience on our site.{" "}
            {/* <Link href="/privacy" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors">
              Learn more
            </Link> */}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={decline}
            className="px-4 py-2 text-xs font-semibold text-white/70 border border-white/20 rounded-lg hover:bg-white/10 transition-all"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 text-xs font-semibold text-navy-900 bg-navy-100 rounded-lg hover:bg-white transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
