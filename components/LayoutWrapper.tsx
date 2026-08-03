"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BookConsultation from "./BookConsultation";
import ChatWidget from "./ChatWidget";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccount = pathname.startsWith("/account");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAccount) return <>{children}</>;

  return (
    <div className="site-dark">
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Book Consultation — kept entirely separate from the chat widget */}
      <BookConsultation />

      {/* Chat widget (message-icon button) — AI "Online Support" + "Meet Us" tabs */}
      <ChatWidget />

      {/* Go to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-navy-700 hover:bg-navy-600 shadow-lg flex items-center justify-center transition-all hover:-translate-y-1"
          aria-label="Go to top"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}