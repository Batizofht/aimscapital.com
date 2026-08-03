"use client";

import { Scale, Plane, PieChart, HardHat, FileText, Heart, Building2, Landmark, PenTool, BookOpen, Receipt, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import PracticeAreaModal from "./PracticeAreaModal";

export default function PracticeAreasClient() {
  const { t } = useTranslation();

  const items = [
    { icon: Scale, title: t("practiceAreas.items.arbT"), desc: t("practiceAreas.items.arbD"), details: t("practiceAreas.items.arbX") },
    { icon: Plane, title: t("practiceAreas.items.aviT"), desc: t("practiceAreas.items.aviD"), details: t("practiceAreas.items.aviX") },
    { icon: PieChart, title: t("practiceAreas.items.finT"), desc: t("practiceAreas.items.finD"), details: t("practiceAreas.items.finX") },
    { icon: HardHat, title: t("practiceAreas.items.consT"), desc: t("practiceAreas.items.consD"), details: t("practiceAreas.items.consX") },
    { icon: FileText, title: t("practiceAreas.items.contT"), desc: t("practiceAreas.items.contD") },
    { icon: Heart, title: t("practiceAreas.items.healthT"), desc: t("practiceAreas.items.healthD") },
    { icon: Building2, title: t("practiceAreas.items.insT"), desc: t("practiceAreas.items.insD") },
    { icon: Landmark, title: t("practiceAreas.items.landT"), desc: t("practiceAreas.items.landD"), details: t("practiceAreas.items.landX") },
    { icon: PenTool, title: t("practiceAreas.items.repT"), desc: t("practiceAreas.items.repD") },
    { icon: BookOpen, title: t("practiceAreas.items.consultT"), desc: t("practiceAreas.items.consultD") },
    { icon: Receipt, title: t("practiceAreas.items.taxT"), desc: t("practiceAreas.items.taxD") },
    { icon: Cpu, title: t("practiceAreas.items.techT"), desc: t("practiceAreas.items.techD") },
  ];

  return (
    <div className="pt-20">
      {/* HERO */}
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
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("practiceAreas.hero.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("practiceAreas.hero.title")}</h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">{t("practiceAreas.hero.subhead")}</p>
          </div>
        </div>
      </section>

      {/* ROSTER */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6">
          <div className="divide-y divide-white/10 border-t border-white/10">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="grid sm:grid-cols-[80px_1fr] lg:grid-cols-[100px_1fr] gap-4 sm:gap-6 py-6 lg:py-8">
                  <div className="flex sm:flex-col items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-navy-200" />
                    </div>
                    <span className="text-xs font-bold text-navy-300 tracking-wider leading-none mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-navy-100 text-sm leading-relaxed">{item.desc}</p>
                    {item.details && <PracticeAreaModal title={item.title} details={item.details} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
