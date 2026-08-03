"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedCounter({ value, suffix, prefix, className }: { value: number; suffix?: string; prefix?: string; className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fallbackTimer: NodeJS.Timeout;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          clearTimeout(fallbackTimer);
          const duration = 1500;
          const step = Math.ceil(value / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    fallbackTimer = setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setCount(value);
      }
    }, 3000);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [value]);

  // Default styling assumes this counter renders on a navy background (all current
  // callers pass an explicit className, so no caller depends on the previous
  // navy-on-white default).
  return (
    <div ref={ref} className={className || "text-3xl sm:text-4xl font-bold text-white mb-2"}>
      {prefix || ""}{count}{suffix || ""}
    </div>
  );
}
