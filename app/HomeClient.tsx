"use client";


import Link from "next/link";
import { useTranslation } from "react-i18next";
import VideoHero from "../components/VideoHero";
import AnimatedCounter from "../components/AnimatedCounter";
import LatestNews from "../components/LatestNews";

export default function HomeClient() {
  const { t } = useTranslation();

  const engagements = [
    { client: "AIMS Capital", title: t("home.engagements.cdmTitle"), desc: t("home.engagements.cdmDesc"), img: "/areas/conservation_cdm.png" },
    { client: "Rwanda Govt. / World Bank", title: t("home.engagements.landTitle"), desc: t("home.engagements.landDesc"), img: "/areas/NationalLandUseMasterPlan.png" },
    { client: "Rwanda Govt. / World Bank", title: t("home.engagements.ewsaTitle"), desc: t("home.engagements.ewsaDesc"), img: "/areas/ewsa_reg.png" },
    { client: "African Development Bank", title: t("home.engagements.wasteTitle"), desc: t("home.engagements.wasteDesc"), img: "/areas/waste.png" },
    { client: "AIMS Capital / GBRW / Garnet", title: t("home.engagements.financeTitle"), desc: t("home.engagements.financeDesc"), img: "/areas/sustainablefinance.png" },
    { client: "Metito / EAIF / AfDB", title: t("home.engagements.waterTitle"), desc: t("home.engagements.waterDesc"), img: "/areas/bugesera.jpg" },
    { client: t("projects.items.aviC"), title: t("projects.items.aviT"), desc: t("projects.items.aviD"), img: "/areas/sol.png" },
    { client: t("projects.items.houseC"), title: t("projects.items.houseT"), desc: t("projects.items.houseD"), img: "/areas/bugesera.jpg" },
    { client: t("projects.items.zhongC"), title: t("projects.items.zhongT"), desc: t("projects.items.zhongD"), img: "/images/clients/zhongtongSer.png" },
  ];

  const practice: [string, string][] = [
    ["Securities and Investment Advisory", "Strategic investment and securities advisory for investors, governments and development institutions, backed by regulatory and transaction due diligence."],
    ["Corporate Transactions", "Advising clients on corporate structuring, governance and compliance across Rwanda and international markets."],
    ["Mergers and Acquisitions", "Legal, financial and regulatory due diligence for investments, mergers, acquisitions and project financing."],
    ["Restructuring", "Corporate restructuring, insolvency proceedings, receivership administration, creditor representation, and turnaround strategy for distressed businesses and financial institutions."],
    ["Real Estate", "Legal and advisory services for real estate transactions, property development and investment structuring."],
    ["Arbitration & Litigation", "Commercial litigation and alternative dispute resolution with 22+ years of bar experience in Rwanda and Tanzania."],
  ];

  const clients = [
    { name: "UNDP", src: "/images/clients/undp.png" },
    { name: "World Bank", src: "/images/clients/worldbank.svg" },
    { name: "AfDB", src: "/images/clients/afdb.svg" },
    { name: "Rwanda Govt.", src: "/images/clients/rwanda.svg" },
    { name: "Qatar Airways", src: "/images/clients/qatar.svg" },
    { name: "KCB Bank", src: "/images/clients/kcb.jpg" },
    { name: "Pinsent Masons", src: "/images/clients/pinsent.svg" },
    { name: "Metito", src: "/images/clients/metito.png" },
    { name: "Avia Group", src: "/images/clients/avia.svg" },
    { name: "Zhong Tong", src: "/images/clients/zhongtong.png" },
    { name: "Mantis Akagera Game Lodge", src: "/mantis.png" },
  ];

  const badges = [
    { name: "Rwanda, Tanganyika and East African Bar Association", img: "/images/clients/eals.png" },
    { name: "CMA Licensed", img: "/images/clients/rwanda.svg" },
    { name: "CIArb Accredited Member", img: "/images/clients/ciarb.svg" },
    { name: "KIAC — Kigali International Arbitration Centre", img: "/images/clients/kiac.png" },
    { name: "CIETAC Panel Member", img: "/CIETAC.png" },
    { name: "KIFC Provider", img: "/images/clients/kifc.png" },
    { name: "Lex Africa Member", img: "/images/clients/lexafrica.png" },
  ];

  return (
    <div>
      <VideoHero />

      {/* ─── CREDENTIALS ─── */}
      <section className="bg-navy-850 relative overflow-hidden">
        {/* Separator: navy accent line + centered diamond dividing the hero from the stats band */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-navy-300/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-navy-300 ring-4 ring-navy-800" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-navy-500/10 to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-x divide-white/10 md:divide-y-0">
            <div className="group px-4 py-10 lg:py-14 text-center transition-colors hover:bg-white/[0.03]">
              <AnimatedCounter value={15} suffix="+" className="text-4xl sm:text-5xl font-extrabold text-white/90 mb-3 tracking-tight" />
              <div className="text-[11px] sm:text-xs text-white/60 uppercase tracking-[0.15em] leading-relaxed max-w-[160px] mx-auto">{t("home.stats.years")}</div>
            </div>
            <div className="group px-4 py-10 lg:py-14 text-center transition-colors hover:bg-white/[0.03]">
              <AnimatedCounter value={40} suffix="+" className="text-4xl sm:text-5xl font-extrabold text-white/90 mb-3 tracking-tight" />
              <div className="text-[11px] sm:text-xs text-white/60 uppercase tracking-[0.15em] leading-relaxed max-w-[160px] mx-auto">{t("home.stats.projects")}</div>
            </div>
            <div className="group px-4 py-10 lg:py-14 text-center transition-colors hover:bg-white/[0.03]">
              <AnimatedCounter value={610} prefix="$" suffix="M" className="text-4xl sm:text-5xl font-extrabold text-white/90 mb-3 tracking-tight" />
              <div className="text-[11px] sm:text-xs text-white/60 uppercase tracking-[0.15em] leading-relaxed max-w-[160px] mx-auto">{t("home.stats.value")}</div>
            </div>
            <div className="group px-4 py-10 lg:py-14 text-center transition-colors hover:bg-white/[0.03]">
              <div className="text-4xl sm:text-5xl font-extrabold text-white/90 mb-3 tracking-tight">{t("home.stats.soleValue")}</div>
              <div className="text-[11px] sm:text-xs text-white/60 uppercase tracking-[0.15em] leading-relaxed max-w-[160px] mx-auto">{t("home.stats.soleLabel")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="bg-navy-850 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-6 leading-tight">{t("home.about.eyebrow")}</h2>
              <div className="space-y-4 text-white/90 leading-relaxed text-sm sm:text-base text-justify">
                <p>{t("home.about.p1")}</p>
                <p>{t("home.about.p2")}</p>
                <p>{t("home.about.p3")}</p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 mt-6 text-white/80 font-semibold hover:text-white transition-colors text-sm">
                {t("home.about.readMore")} &rarr;
              </Link>
            </div>
            <div className="space-y-6">
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-white/10">
                <img src="/areas/bugesera.jpg" alt="AIMS Capital" className="w-full h-full object-cover" />
              </div>
              <div className="bg-navy-800 p-6 lg:p-8 border border-white/10 rounded-xl">
                <div className="space-y-6">
                  <div>
                    <div className="text-base sm:text-lg text-white font-bold uppercase tracking-wider mb-2">{t("home.about.vision")}</div>
                    <p className="text-white leading-relaxed text-sm sm:text-base">{t("home.about.visionText")}</p>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg text-white font-bold uppercase tracking-wider mb-2">{t("home.about.mission")}</div>
                    <p className="text-white leading-relaxed text-sm sm:text-base">{t("home.about.missionText")}</p>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg text-white font-bold uppercase tracking-wider mb-2">{t("home.about.values")}</div>
                    <p className="text-white text-sm sm:text-base">{t("home.about.valuesText")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NOTABLE ENGAGEMENTS ─── */}
      <section id="engagements" className="bg-navy-850 py-16 lg:py-24 border-t border-white/5 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("home.engagements.eyebrow")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((item) => (
              <div key={item.title} className="bg-navy-800 border-2 border-white/10 p-6 lg:p-8 rounded-xl text-center hover:border-navy-400 hover:-translate-y-1 transition-all duration-200">
                <img src={item.img} alt={item.title} className="w-20 h-20 rounded-full object-cover mx-auto mb-5 ring-4 ring-white/10" />
                <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mb-2">{item.client}</p>
                <h3 className="text-base lg:text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST NEWS ─── */}
      <section className="bg-navy-850 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">Latest Blog</h2>
          </div>
          <LatestNews />
        </div>
      </section>

      {/* ─── PRACTICE AREAS ─── */}
      <section className="bg-navy-850 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("home.practice.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {practice.map(([title, desc], i) => (
              <div key={title} className="bg-navy-800 p-6 flex flex-col">
                <div className="text-xs text-white/70 font-bold uppercase tracking-wider mb-3">0{i + 1}</div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/practice-areas" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-500 transition-all">
              {t("home.practice.viewAll")} {" "}&rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CLIENTS ─── */}
      <section className="bg-navy-850 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-10 lg:mb-12">{t("home.clients.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {clients.map(({ name, src }) => (
              <div key={name} className="group">
                <div className="aspect-[4/3] bg-white/[0.3] border border-white/10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-navy-400 hover:-translate-y-1 p-4">
                  <img src={src} alt={name} className="max-w-full max-h-[65%] object-contain rounded-xl" loading="lazy" />
                </div>
                {name === "Mantis Akagera Game Lodge" && (
                  <p className="text-[10px] text-white/50 uppercase tracking-wider mt-2 text-center font-semibold">Mantis Akagera Game Lodge</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 pt-10 border-t border-white/10">
            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-6">{t("home.clients.recognition")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge) => (
                <div key={badge.name} className="bg-navy-800 border-2 border-white/10 rounded-lg px-4 py-3 flex items-center gap-2 hover:border-navy-400 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
                    <img src={badge.img} alt={badge.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/partnerships" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-500 transition-all">
              {t("home.clients.viewMore")} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-navy-850 py-16 lg:py-20 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white uppercase tracking-wider mb-4 leading-tight">{t("home.cta.title")}</h2>
          <p className="text-white/80 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">{t("home.cta.subhead")}</p>
          <Link href="/contact?subject=consultation" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-navy-900 bg-white rounded-lg hover:bg-navy-100 transition-all">
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}
