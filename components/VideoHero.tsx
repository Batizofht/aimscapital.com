"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const heroPractices = [
  { key: "arbTitle", descKey: "arbDesc" },
  { key: "finTitle", descKey: "finDesc" },
  { key: "consTitle", descKey: "consDesc" },
  { key: "contTitle", descKey: "contDesc" },
  { key: "landTitle", descKey: "landDesc" },
];

const videos = ["/videos/sec.MOV", "/videos/thi.MOV","/videos/fir.mp4",];

export default function VideoHero() {
  const { t } = useTranslation();
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitioning = useRef(false);

  const transitionTo = useCallback((index: number) => {
    if (transitioning.current || index === current) return;
    transitioning.current = true;
    setFading(true);

    const nextVideo = videoRefs[1].current;
    if (nextVideo) {
      nextVideo.src = videos[index];
      nextVideo.play();
    }

    setTimeout(() => {
      setFading(false);
      setCurrent(index);
      const currentVideo = videoRefs[0].current;
      if (currentVideo) {
        currentVideo.src = videos[index];
        currentVideo.play();
      }
      const oldVideo = videoRefs[1].current;
      if (oldVideo) {
        oldVideo.pause();
        oldVideo.src = "";
      }
      transitioning.current = false;
    }, 800);
  }, [current]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const nxt = (prev + 1) % videos.length;
        transitionTo(nxt);
        return prev;
      });
    }, 7000);
  }, [transitionTo]);

  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, startTimer]);

  const [heroPracticeIdx, setHeroPracticeIdx] = useState(0);

  const togglePause = () => {
    if (paused) {
      const v = videoRefs[0].current;
      if (v) v.play();
      setPaused(false);
    } else {
      const v = videoRefs[0].current;
      if (v) v.pause();
      const v2 = videoRefs[1].current;
      if (v2) v2.pause();
      setPaused(true);
    }
  };

  const goTo = (index: number) => {
    if (index === current) return;
    transitionTo(index);
    setPaused(false);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        ref={videoRefs[0]}
        src={videos[0]}
        autoPlay
        muted
        loop={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <video
        ref={videoRefs[1]}
        muted
        loop={false}
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ${
          fading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Layered overlay — gradient for depth + readability, not a flat wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F2B4A]/80 via-[#0F2B4A]/70 to-[#0F2B4A]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2B4A]/70 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-24 text-center">
        <img
          src="/secondlogo.png"
          alt="AIMS Capital"
          className="w-72 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[34rem] h-auto max-w-[88vw] mb-5"
        />
        {/* <p className="text-white/70 text-xs sm:text-sm italic tracking-wide mb-7 max-w-sm sm:max-w-md mx-auto">
          {t("hero.eyebrow")}
        </p> */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-navy-900 bg-white rounded-lg hover:bg-navy-100 transition-all shadow-lg"
        >
          {t("nav.aboutUs")}
        </Link>
      </div>

      {/* Practice Areas — right-aligned carousel — commented out, was overlapping/hiding the logo
      <div className="absolute bottom-44 right-6 hidden lg:block w-[340px] xl:w-[400px]">
        <div className="flex flex-col gap-3">
          {heroPractices.slice(heroPracticeIdx, heroPracticeIdx + 2).map((p) => (
            <div key={p.key} className="bg-navy-800/80 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-navy-700/80 hover:border-navy-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-900/50 transition-all duration-200 cursor-default">
              <div className="text-xs text-white font-bold uppercase tracking-wider mb-1">
                {t(`home.practice.${p.key}`)}
              </div>
              <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
                {t(`home.practice.${p.descKey}`)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            onClick={() => setHeroPracticeIdx(Math.max(0, heroPracticeIdx - 1))}
            disabled={heroPracticeIdx === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-white/80 hover:bg-white/15 hover:border-white/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous practice"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => setHeroPracticeIdx(Math.min(heroPractices.length - 2, heroPracticeIdx + 1))}
            disabled={heroPracticeIdx >= heroPractices.length - 2}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/30 text-white/80 hover:bg-white/15 hover:border-white/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next practice"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      */}

      <div className="absolute bottom-10 md:bottom-10 sm:bottom-8 left-4 sm:left-8 flex items-center gap-3 sm:gap-4">
        <button
          onClick={togglePause}
          className="w-9 h-9 sm:w-10 sm:h-10 xl:w-12 xl:h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 border border-white/30"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-5 xl:h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-5 xl:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current 
                  ? "bg-white w-4 sm:w-6 h-1.5 sm:h-2" 
                  : "bg-white/40 hover:bg-white/60 w-1.5 sm:w-2 h-1.5 sm:h-2"
              }`}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
