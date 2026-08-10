"use client";

import { useState, useEffect } from "react";
import { Film, Music, Calendar, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaPlayer from "@/components/MediaPlayer";

const API_URL = "https://client2.wecollections.us";

interface EventItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  type: "audio" | "video";
  mediaUrl: string | null;
  coverImage: string | null;
}

export default function EventsClient() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [active, setActive] = useState<EventItem | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/events?published=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(
            data.map((e: any) => ({
              id: e.id,
              title: e.title,
              excerpt: e.excerpt,
              date: e.date,
              category: e.category,
              type: e.type,
              mediaUrl: e.mediaUrl ? (e.mediaUrl.startsWith("http") ? e.mediaUrl : `${API_URL}${e.mediaUrl}`) : null,
              coverImage: e.coverImage ? (e.coverImage.startsWith("http") ? e.coverImage : `${API_URL}${e.coverImage}`) : null,
            }))
          );
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? events : events.filter((e) => e.category === activeCategory);

  return (
    <div className="pt-18">
      {!loading && categories.length > 1 && (
        <div className="bg-navy-850 border-b border-white/10 sticky top-[4.5rem] z-30">
          <div className="max-w-[900px] mx-auto px-4 md:px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-navy-600 text-white shadow-sm"
                      : "bg-navy-800 text-white/70 hover:bg-navy-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="bg-navy-850 py-16 lg:py-20 min-h-[50vh]">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-navy-800 rounded-xl border border-white/10 h-40" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Film className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/60 text-sm">{t("events.none")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {filtered.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setActive(event)}
                  className="text-left bg-navy-800 border border-white/10 rounded-xl overflow-hidden hover:border-navy-400 transition-colors"
                >
                  <div className="relative aspect-video bg-navy-700">
                    {event.coverImage ? (
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {event.type === "audio" ? <Music className="w-10 h-10 text-white/60" /> : <Film className="w-10 h-10 text-white/60" />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        {event.type === "audio" ? <Music className="w-6 h-6 text-navy-900" /> : <Film className="w-6 h-6 text-navy-900" />}
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-navy-900/80 text-white/90">
                      {event.type === "audio" ? "Audio" : "Video"}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">{event.category}</p>
                    <h3 className="text-sm font-bold text-white leading-snug">{event.title}</h3>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/60">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL — shows only the player + event info, no thumbnail */}
      {active && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-2xl bg-navy-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-navy-800 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div className="min-w-0">
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">{active.category}</p>
                <h2 className="text-base font-bold text-white truncate">{active.title}</h2>
              </div>
              <button onClick={() => setActive(null)} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {active.mediaUrl ? (
                <MediaPlayer type={active.type} src={active.mediaUrl} autoPlay />
              ) : (
                <p className="text-xs text-white/60 italic">Media unavailable.</p>
              )}
              <div className="flex items-center gap-1.5 mt-4 text-[11px] text-white/60">
                <Calendar className="w-3 h-3" />
                {active.date}
              </div>
              {active.excerpt && (
                <div
                  className="text-white/90 text-sm leading-relaxed mt-4"
                  dangerouslySetInnerHTML={{ __html: active.excerpt }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
