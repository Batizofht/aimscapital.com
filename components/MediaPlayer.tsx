"use client";

import { useEffect, useRef } from "react";
import type Plyr from "plyr";
import "plyr/dist/plyr.css";

const videoControls = ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"];
const audioControls = ["play", "progress", "current-time", "duration", "mute", "volume"];

export default function MediaPlayer({
  type,
  src,
  poster,
  autoPlay,
}: {
  type: "audio" | "video";
  src: string;
  poster?: string | null;
  autoPlay?: boolean;
}) {
  const ref = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;

    // Plyr touches `document` at module load, which breaks Next.js's
    // server-side prerender — load it lazily, client-side only.
    import("plyr").then(({ default: PlyrCtor }) => {
      if (cancelled || !ref.current) return;
      playerRef.current = new PlyrCtor(ref.current, {
        controls: type === "audio" ? audioControls : videoControls,
        autoplay: !!autoPlay,
        muted: type === "video" && !!autoPlay,
        clickToPlay: true,
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, type]);

  if (type === "audio") {
    return (
      <audio ref={ref} controls>
        <source src={src} />
      </audio>
    );
  }

  return (
    <video ref={ref} className="w-full rounded-lg bg-black" controls playsInline poster={poster || undefined}>
      <source src={src} />
    </video>
  );
}
