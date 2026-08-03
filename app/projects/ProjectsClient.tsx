"use client";

import { useState } from "react";
import { Building, MapPin, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";

const categories = ["All", "Infrastructure", "Finance", "Aviation", "Water"];

export default function ProjectsPageClient() {
  const { t } = useTranslation();
  const [active, setActive] = useState("All");

  // category stays a stable English key for filtering; display label is translated.
  const projects = [
    { key: "water", category: "Water", value: "$63M", image: "/areas/bugesera.jpg" },
    { key: "land", category: "Infrastructure", value: null, image: "/areas/NationalLandUseMasterPlan.png" },
    { key: "cdm", category: "Finance", value: "$610M", image: "/areas/conservation_cdm.png" },
    { key: "ewsa", category: "Infrastructure", value: null, image: "/areas/ewsa_reg.png" },
    { key: "fin", category: "Finance", value: null, image: "/areas/sustainablefinance.png" },
    { key: "waste", category: "Infrastructure", value: null, image: "/areas/waste.png" },
    { key: "avi", category: "Aviation", value: null, image: "/areas/sol.png" },
    { key: "house", category: "Infrastructure", value: null, image: "/areas/bugesera.jpg" },
    { key: "zhong", category: "Infrastructure", value: null, image: "/images/clients/zhongtongSer.png" },
  ].map((p) => ({
    ...p,
    title: t(`projects.items.${p.key}T`),
    description: t(`projects.items.${p.key}D`),
    location: t(`projects.items.${p.key}L`),
    client: t(`projects.items.${p.key}C`),
  }));

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div className="pt-20">
      {/* ─── HERO ─── */}
      <section className="relative -mt-20 overflow-hidden flex items-center" style={{ minHeight: "40vh" }}>
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/85" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px)" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-400/15 to-transparent" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-20">
          <div className="text-center">
            <div className="w-12 h-0.5 bg-navy-300 mx-auto mb-5" />
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("projects.hero.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
              {t("projects.hero.title")}
            </h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
              {t("projects.hero.subhead")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── FILTER ─── */}
      <section className="bg-navy-850 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active === cat
                    ? "text-white bg-navy-600"
                    : "text-navy-100 bg-navy-800 hover:bg-navy-700"
                }`}
              >
                {t(`projects.cat.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="divide-y divide-white/10 border-t border-white/10">
            {filtered.map((project, i) => (
              <div key={project.title} className="grid sm:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 py-8 lg:py-10">
                <div className="aspect-[4/3] bg-navy-800 rounded-sm overflow-hidden flex items-center justify-center">
                  {project.image ? (
                   <>{project.key=="avi" || project.key=="ewsa" ? <> <img src={project.image} alt={project.title} className="w-full h-full " /></> :<> <img src={project.image} alt={project.title} className="w-full h-full object-cover" /></>}</>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-navy-300">
                      <Plane className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-navy-300 uppercase tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="w-6 h-px bg-navy-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-200">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-navy-100 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-navy-300">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3 h-3" />
                      {project.client}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                    {project.value && (
                      <span className="font-semibold text-navy-200">
                        {project.value}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
