"use client";

import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const linkedInIcon = (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  image?: string;
  email?: string;
  linkedin?: string;
}

export default function TeamClient() {
  const { t } = useTranslation();

  const allMembers: TeamMember[] = [
    { name: "Counsel Alloys Mutabingwa, FCIArb", title: t("team.people.mutaTitle"), bio: t("team.people.mutaBio"), expertise: ["intlArb", "corpLaw", "ppp", "regional"], image: "/images/team/mutabingwa.png", email: "amutabingwa@aimscapital.org", linkedin: "https://www.linkedin.com/in/alloys-mutabingwa-09b735260/" },
    { name: "Scovia Basaliza Gahongayire", title: t("team.people.scoviaTitle"), bio: t("team.people.scoviaBio"), expertise: ["investAdv", "tradeLaw", "projMgmt", "orgDev"], email: "sgahongayire@aimscapital.org", linkedin: "https://www.linkedin.com/in/scovia-basaliza-09b735260/" },
    { name: "Counsel Olivier Munyabuhoro", title: t("team.people.olivierTitle"), bio: t("team.people.olivierBio"), expertise: ["commLit", "disputeRes", "corpLaw", "trialAdv"], email: "omunyabuhoro@aimscapital.org", linkedin: "https://www.linkedin.com/in/olivier-munyabuhoro-09b735260/" },
    { name: "Eng. James Sano", title: t("team.people.sanoTitle"), bio: t("team.people.sanoBio"), expertise: ["water", "ppp", "envCompliance", "infraDev"], email: "jsano@aimscapital.org", linkedin: "https://www.linkedin.com/in/james-sano-09b735260/" },
    { name: "Dorothy Batamuliza", title: t("team.people.dorothyTitle"), bio: t("team.people.dorothyBio"), expertise: ["execAdmin", "clientCoord", "opsMgmt"], image: "/doroth.jpg", email: "dbatamuliza@aimscapital.org", linkedin: "https://www.linkedin.com/in/dorothy-batamuliza-09b735260/" },
    { name: "Scholastique Mutimanama", title: t("team.people.scholastiqueTitle"), bio: t("team.people.scholastiqueBio"), expertise: ["legalTech", "digital", "process", "knowledge"], image: "/images/team/scholastique.jpeg", email: "smutimanama@aimscapital.org", linkedin: "https://www.linkedin.com/in/scholastique-mutimanama-09b735260/" },
    { name: "Jean Claude Ishimwe Kagame", title: t("team.people.ishimweTitle"), bio: t("team.people.ishimweBio"), expertise: ["intlArb", "legalEd", "adr", "research"], image: "/images/team/ishimwejean.jpeg", email: "jcishimwe@aimscapital.org" },
    { name: "Dr. Viva Nsengimana", title: t("team.people.vivaTitle"), bio: t("team.people.vivaBio"), expertise: ["investAdv", "crossBorder", "regCompliance", "corpStruct"], image: "/images/team/VICENT.jpeg", email: "vnsengimana@aimscapital.org" },
    { name: "Dr. Gatabazi Emmanuel", title: t("team.people.gatabaziTitle"), bio: t("team.people.gatabaziBio"), expertise: ["corpLaw", "ma", "commTrans", "corpGov"], image: "/images/team/KATABAZI.jpg", email: "egatabazi@aimscapital.org", linkedin: "https://rw.linkedin.com/in/emmanuel-thomas-gatabazi-9bb52669" },
    { name: "Counsel Steven Twahirwa", title: t("team.people.twahirwaTitle"), bio: t("team.people.twahirwaBio"), expertise: ["disputeRes", "corpLaw", "arbitration", "mediation"], email: "stwahirwa@aimscapital.org" },
    { name: "Mr. David Ross", title: t("team.people.rossTitle"), bio: t("team.people.rossBio"), expertise: ["intlBiz", "investAdv", "marketEntry", "bizDev"], image: "/images/team/ROSS.jpeg", email: "dross@aimscapital.org" },
    { name: "Pierre NZABAHIMANA", title: t("team.people.pierreTitle"), bio: t("team.people.pierreBio"), expertise: ["legalEd", "research", "adr", "intlArb"], image: "/images/team/pieri.jpeg", linkedin: "https://www.linkedin.com/in/pierre-nzabahimana-398423333/" },
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("team.hero.title")}</h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">{t("team.hero.subhead")}</p>
          </div>
        </div>
      </section>

      {/* TEAM MEMBERS */}
      <section className="bg-navy-850 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-10 lg:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">Team Members</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allMembers.map((member) => (
              <div key={member.name} className="group bg-navy-800 rounded-xl overflow-hidden border border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Photo */}
                <div className="aspect-[4/5] bg-navy-950 overflow-hidden relative">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{member.name.charAt(0)}</span>
                      </div>
                      <span className="text-white/30 text-[10px] uppercase tracking-widest">Photo Coming</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-navy-950/70 to-transparent" />
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide leading-tight mb-1">{member.name}</h3>
                  <p className="text-white/80 text-xs font-semibold mb-3">{member.title}</p>
                  <p className="text-white/70 text-xs leading-relaxed mb-3 line-clamp-3">{member.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertise.slice(0, 2).map((area) => (
                      <span key={area} className="bg-navy-700 text-white/80 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded">
                        {t(`team.expertise.${area}`)}
                      </span>
                    ))}
                  </div>
                  {(member.email || member.linkedin) && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                      {/* {member.email && (
                        <a href={`mailto:${member.email}`} className="text-white/60 hover:text-white/80 transition-colors" title={member.email}>
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white/80 transition-colors" title="LinkedIn">
                          {linkedInIcon}
                        </a>
                      )} */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
