"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function PartnershipsClient() {
  const { t } = useTranslation();

  const partners = [
    { name: "Pinsent Masons LLP", type: t("partnerships.types.intlLaw"), location: "Johannesburg / Global", description: t("partnerships.items.pinsentD"), logo: "/images/clients/pinsent.svg" },
    { name: "Planet Partnerships", type: t("partnerships.types.devPartner"), location: "Global", description: t("partnerships.items.planetD"), logo: null },
    { name: "Avia Group", type: t("partnerships.types.aviInvest"), location: "Vilnius, Lithuania", description: t("partnerships.items.aviaD"), logo: "/images/clients/avia.svg" },
    { name: "Nexus Group", type: t("partnerships.types.aviTech"), location: "Saudi Arabia", description: t("partnerships.items.nexusD"), logo: null },
    { name: "Zhong Tong Group", type: t("partnerships.types.greenTech"), location: "China", description: t("partnerships.items.zhongD"), logo: "/images/clients/zhongtong.png" },
    { name: "Metito", type: t("partnerships.types.waterTech"), location: "Dubai, UAE", description: t("partnerships.items.metitoD"), logo: "/images/clients/metito.png" },
    { name: "Tzamir Architects & Planners", type: t("partnerships.types.arch"), location: "Israel", description: t("partnerships.items.tzamirD"), logo: null },
    { name: "Horwath HTL", type: t("partnerships.types.consulting"), location: "Global", description: t("partnerships.items.horwathD"), logo: null },
    { name: "Times Group", type: t("partnerships.types.aviEvents"), location: "London, UK", description: t("partnerships.items.timesD"), logo: null },
    { name: "Rwanda Finance Limited", type: t("partnerships.types.finServ"), location: "Rwanda", description: t("partnerships.items.rflD"), logo: "/images/fina.png" },
    { name: "Debitura", type: t("partnerships.types.debt"), location: "Rwanda", description: t("partnerships.items.debituraD"), logo: null },
    { name: "Lex Africa Alliance", type: t("partnerships.types.legalNet"), location: "26 African Countries", description: t("partnerships.items.lexD"), logo: "/images/clients/lexafrica.png" },
    { name: "Kigali International Financial Centre (KIFC)", type: t("partnerships.types.finServ"), location: "Kigali, Rwanda", description: t("partnerships.items.kifcD"), logo: "/images/clients/kifc.png" },
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("partnerships.hero.title")}</h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">{t("partnerships.hero.subhead")}</p>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-navy-850 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("partnerships.section.title")}</h2>
          </div>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {partners.map((p, i) => (
              <div key={p.name} className="group grid sm:grid-cols-[3.5rem_5rem_1fr] gap-x-8 gap-y-2 py-7 lg:py-8 transition-colors hover:bg-navy-800/40 -mx-4 px-4">
                <div className="text-white/60 text-lg font-bold tabular-nums pt-0.5 group-hover:text-white/70 transition-colors">{String(i + 1).padStart(2, "0")}</div>
                <div className="w-20 h-20 rounded-xl bg-white/80 border border-white/20 flex items-center justify-center overflow-hidden p-2 shrink-0">
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-navy-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{p.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="text-white font-bold text-lg">{p.name}</h3>
                    <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">{p.type}</span>
                  </div>
                  <p className="text-[11px] text-white/60 uppercase tracking-wider mt-0.5">{p.location}</p>
                  <p className="text-white/90 text-sm leading-relaxed mt-3 max-w-3xl">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/85" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider mb-4">{t("partnerships.cta.title")}</h2>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8">{t("partnerships.cta.subhead")}</p>
          <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-4 text-base font-semibold text-navy-900 bg-white rounded-lg hover:bg-navy-100 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t("partnerships.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}
