"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Scale, Target, Award, Globe, BookOpen, Building2 } from "lucide-react";

export default function AboutClient() {
  const { t } = useTranslation();

  const milestones = [
    { year: "2011", title: t("about.milestones.m2011t"), desc: t("about.milestones.m2011d") },
    { year: "2013", title: t("about.milestones.m2013t"), desc: t("about.milestones.m2013d") },
    { year: "2014", title: t("about.milestones.m2014t"), desc: t("about.milestones.m2014d") },
    { year: "2017", title: t("about.milestones.m2017t"), desc: t("about.milestones.m2017d") },
    { year: t("about.milestones.y2018"), title: t("about.milestones.m2018t"), desc: t("about.milestones.m2018d") },
    { year: "2020", title: t("about.milestones.m2020t"), desc: t("about.milestones.m2020d") },
    { year: "2023", title: t("about.milestones.m2023t"), desc: t("about.milestones.m2023d") },
    { year: t("about.milestones.y2024"), title: t("about.milestones.m2024t"), desc: t("about.milestones.m2024d") },
  ];

  const partners = [
    { name: "Pinsent Masons LLP", flag: t("about.partners.globalAssoc") },
    { name: "Kigali International Airport", flag: t("about.partners.gateway") },
    { name: "CIArb (London)", flag: t("about.partners.institutional") },
    { name: "Lex Africa Alliance", flag: t("about.partners.member") },
    { name: "East African Law Society", flag: t("about.partners.member") },
    { name: "Association of European Attorneys", flag: t("about.partners.member") },
  ];

  const facts: [string, string][] = [
    [t("about.story.facts.founded"), "2011"],
    [t("about.story.facts.incorporated"), "2013"],
    [t("about.story.facts.founder"), "Counsel Alloys Mutabingwa, FCIArb"],
    [t("about.story.facts.hq"), t("about.story.facts.hqValue")],
    [t("about.story.facts.usEntity"), t("about.story.facts.usValue")],
    [t("about.story.facts.projects"), "40+"],
    [t("about.story.facts.regulator"), t("about.story.facts.regulatorValue")],
    [t("about.story.facts.licensed"), t("about.story.facts.licensedValue")],
    [t("about.story.facts.climate"), t("about.story.facts.climateValue")],
    [t("about.story.facts.kifc"), t("about.story.facts.kifcValue")],
  ];

  const notableClients = ["AIMS Capital", "World Bank", "AfDB (African Development Bank)", "Rwanda Govt.", "Qatar Airways", "KCB Bank", "Rwandair", "WASAC", "REG", "Kigali Water Ltd", "Metito", "Avia Group", "Nexus Group", "Zhong Tong"];

  const keyEngagements = [
    { icon: Building2, title: t("about.key.ewsaTitle"), desc: t("about.key.ewsaDesc") },
    { icon: Award, title: t("about.key.waterTitle"), desc: t("about.key.waterDesc") },
    { icon: BookOpen, title: t("about.key.landTitle"), desc: t("about.key.landDesc") },
    { icon: Scale, title: t("about.key.cdmTitle"), desc: t("about.key.cdmDesc") },
  ];

  const storyParas = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11"];

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
            <div className="w-12 h-0.5 bg-navy-400 mx-auto mb-5" />
            <p className="text-navy-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.hero.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("about.hero.title")}</h1>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-navy-900 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 lg:mb-14">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.story.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("about.story.title")}</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-4 text-navy-100 leading-relaxed text-sm sm:text-base">
              {storyParas.map((p) => <p key={p}>{t(`about.story.${p}`)}</p>)}
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
              <div className="bg-navy-800 p-6 lg:p-8 rounded-xl border border-white/10">
                <h3 className="text-lg lg:text-xl font-bold text-white uppercase tracking-wider mb-6">{t("about.story.keyFacts")}</h3>
                <div className="space-y-4">
                  {facts.map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                      <span className="text-navy-200 font-medium text-sm">{label}</span>
                      <span className="text-white font-bold text-sm text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-navy-850 p-6 lg:p-8 rounded-xl border border-white/10">
                <h3 className="text-white font-bold uppercase tracking-wider mb-4 text-base lg:text-lg">{t("about.story.notableClients")}</h3>
                <div className="flex flex-wrap gap-2">
                  {notableClients.map((client) => (
                    <span key={client} className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full">{client}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS & ACTIVITIES */}
      <section className="bg-navy-850 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 lg:mb-14">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.impact.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("about.impact.title")}</h2>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block relative max-w-5xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
            <div className="space-y-0">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={i} className="relative" style={{ minHeight: "130px" }}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-navy-400 bg-navy-900 z-10 flex items-center justify-center" style={{ top: "28px" }}>
                      <div className="w-2 h-2 rounded-full bg-navy-400" />
                    </div>
                    <div className={`flex items-start ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                      <div className="w-1/2 flex justify-center">
                        <div className={`w-full max-w-md ${isLeft ? "pr-10 text-right" : "pl-10 text-left"}`}>
                          <div className="bg-navy-800 border border-white/10 rounded-xl p-5 hover:border-navy-400 transition-colors">
                            <div className={`flex items-start gap-3 ${isLeft ? "flex-row-reverse" : ""}`}>
                              <div className="w-9 h-9 rounded-lg bg-navy-600 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-white text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-navy-200 font-bold text-xs tracking-wider uppercase">{m.year}</span>
                                <h3 className="text-white font-bold text-sm lg:text-base mt-0.5">{m.title}</h3>
                                <p className="text-navy-100 text-xs sm:text-sm leading-relaxed mt-1">{m.desc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2" />
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="flex justify-center relative z-10" style={{ marginTop: "-1px" }}>
                        <svg className="w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden relative max-w-xl mx-auto">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-white/10" />
            <div className="space-y-0">
              {milestones.map((m, i) => (
                <div key={i} className="relative" style={{ minHeight: "110px" }}>
                  <div className="absolute left-[13px] top-3 w-3 h-3 rounded-full border-2 border-navy-400 bg-navy-900 z-10" />
                  <div className="pl-12 pt-0">
                    <div className="bg-navy-800 border border-white/10 rounded-xl p-4 hover:border-navy-400 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-navy-600 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-navy-200 font-bold text-xs tracking-wider uppercase">{m.year}</span>
                          <h3 className="text-white font-bold text-sm mt-0.5">{m.title}</h3>
                          <p className="text-navy-100 text-xs leading-relaxed mt-1">{m.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="flex justify-center pl-12 relative z-10">
                      <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISION, MISSION, VALUES */}
      <section className="bg-navy-900 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-14 lg:mb-16">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.vmv.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("about.vmv.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-navy-800 border border-white/10 p-6 lg:p-8 rounded-xl text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                <Target className="w-5 h-5 text-navy-200" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-navy-200">{t("about.vmv.vision")}</h3>
              <p className="text-white/85 leading-relaxed text-sm sm:text-base">{t("about.vmv.visionText")}</p>
            </div>
            <div className="bg-navy-800 border border-white/10 p-6 lg:p-8 rounded-xl text-white">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                <Globe className="w-5 h-5 text-navy-200" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-navy-200">{t("about.vmv.mission")}</h3>
              <p className="text-white/85 leading-relaxed text-sm sm:text-base">{t("about.vmv.missionText")}</p>
            </div>
          </div>
          <div>
            <h3 className="text-center text-sm text-navy-300 font-bold uppercase tracking-[0.2em] mb-6">{t("about.vmv.values")}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {t("about.vmv.valuesList").split("|").map((v) => (
                <span key={v} className="px-4 md:px-6 py-3 border border-white/15 rounded-lg text-navy-100 text-sm font-medium bg-navy-800 hover:border-navy-400 hover:bg-navy-700 transition-colors cursor-default">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KEY ENGAGEMENTS */}
      <section className="bg-navy-900 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-14 lg:mb-16">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.key.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("about.key.title")}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 hidden lg:block" />
            {keyEngagements.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative lg:pl-20 pb-12 last:pb-0">
                  <div className="hidden lg:flex absolute left-2.5 top-1 w-7 h-7 rounded-full bg-navy-900 border-2 border-white/15 items-center justify-center">
                    <span className="text-[10px] font-bold text-navy-200">0{i + 1}</span>
                  </div>
                  <div className="bg-navy-800 rounded-xl border border-white/10 p-6 lg:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-navy-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                        <p className="text-navy-100 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10">
            <Link href="/projects" className="text-navy-200 font-semibold hover:text-white transition-colors text-sm">{t("about.key.viewAll")} &rarr;</Link>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-navy-850 py-16 lg:py-24 overflow-hidden border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 lg:mb-14">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("about.partners.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("about.partners.title")}</h2>
          </div>
          <div className="divide-y divide-white/10 border-t border-white/10 max-w-3xl">
            {partners.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-5">
                <span className="text-white font-semibold text-sm sm:text-base">{p.name}</span>
                <span className="text-[11px] text-navy-200 font-semibold uppercase tracking-wider shrink-0">{p.flag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
