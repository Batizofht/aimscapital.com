"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Loader, Check, Send, X } from "lucide-react";
import { toast } from "sonner";

const subjectKeys = ["corporate", "projects", "litigation", "consulting", "infrastructure", "consultation", "other"] as const;

export default function ServicesClient() {
  const { t } = useTranslation();

  const services = [
    { key: "corporate", category: t("services.items.corporateTitle"), description: t("services.items.corporateDesc"), items: t("services.items.corporateList").split("|") },
    { key: "projects", category: t("services.items.projectsTitle"), description: t("services.items.projectsDesc"), items: t("services.items.projectsList").split("|") },
    { key: "litigation", category: t("services.items.litigationTitle"), description: t("services.items.litigationDesc"), items: t("services.items.litigationList").split("|") },
    { key: "consulting", category: t("services.items.consultingTitle"), description: t("services.items.consultingDesc"), items: t("services.items.consultingList").split("|") },
    { key: "infrastructure", category: t("services.items.infraTitle"), description: t("services.items.infraDesc"), items: t("services.items.infraList").split("|") },
    { key: "cabinet", category: t("services.items.cabinetTitle"), description: t("services.items.cabinetDesc"), items: t("services.items.cabinetList").split("|") },
    { key: "realEstate", category: t("services.items.realEstateTitle"), description: t("services.items.realEstateDesc"), items: t("services.items.realEstateList").split("|") },
    { key: "dueDiligence", category: t("services.items.dueDiligenceTitle"), description: t("services.items.dueDiligenceDesc"), items: t("services.items.dueDiligenceList").split("|") },
  ];

  const businessModel = t("services.spectrum.model").split("|");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name || !email || !message || !selectedService) {
      setFormError(t("contact.fillFields"));
      return;
    }
    const subjectLabelEn: Record<string, string> = { corporate: "Corporate Law", projects: "Projects", litigation: "Litigation", consulting: "Consulting", infrastructure: "Infrastructure", consultation: "Consultation", other: "Other", cabinet: "Cabinet Market Advisory", realEstate: "Real Estate", dueDiligence: "Due Diligence" };
    setSubmitting(true);
    try {
      const res = await fetch("https://client2.wecollections.us/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subjectLabelEn[selectedService] || selectedService,
          body: message,
        }),
      });
      const data = await res.json().catch(() => ({ error: t("contact.failed") }));
      if (!res.ok || data.error) {
        toast.error(data.error || t("contact.failed"));
        setFormError(data.error || t("contact.failed"));
      } else {
        setSubmitted(true);
        toast.success(t("contact.sentToast"));
      }
    } catch {
      setFormError(t("contact.connError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="relative -mt-20 overflow-hidden flex items-center" style={{ minHeight: "40vh" }}>
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-400/15 to-transparent" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-20">
          <div className="text-center">
            <div className="w-12 h-0.5 bg-navy-300 mx-auto mb-5" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("services.hero.title")}</h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">{t("services.hero.subhead")}</p>
          </div>
        </div>
      </section>

      {/* SERVICES + CONTACT */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column — Services List (3/5 width) */}
            <div className="lg:col-span-3">
              <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("services.spectrum.eyebrow")}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-8">{t("services.spectrum.title")}</h2>
              <div className="space-y-6">
                {services.map((s, i) => (
                  <div key={s.key}>
                    {i > 0 && <div className="w-full h-px bg-white/10 my-6" />}
                    <div
                      className={`flex items-start gap-5 p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedService === s.key ? "bg-navy-700 border border-navy-400" : "hover:bg-navy-800/50 border border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedService(s.key);
                        setSubmitted(false);
                        setFormError("");
                      }}
                    >
                      <span className="text-3xl lg:text-4xl font-bold text-navy-300 leading-none shrink-0 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <div className="pt-1">
                        <h3 className="text-base lg:text-lg font-bold text-white uppercase tracking-wider mb-2">{s.category}</h3>
                        <p className="text-sm text-navy-300 mb-2 leading-relaxed">{s.description}</p>
                        <p className="text-sm text-navy-100">{s.items.join(" — ")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Contact Form (2/5 width) */}
            <div className="lg:col-span-2" ref={formRef}>
              <div className="bg-navy-800 p-6 lg:p-8 rounded-xl border border-white/10 sticky top-28">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                      <Check className="w-7 h-7 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{t("contact.sentTitle")}</h3>
                    <p className="text-navy-300 text-sm max-w-xs mx-auto mb-6">{t("contact.sentBody")}</p>
                    <button
                      onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); setFormError(""); setSelectedService(null); }}
                      className="px-6 py-3 bg-navy-600 text-white text-sm font-semibold rounded-xl hover:bg-navy-500 transition-all"
                    >
                      {t("contact.sendAnother")}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-base font-bold text-white uppercase tracking-wider">
                        {selectedService ? `Contact re: ${services.find(s => s.key === selectedService)?.category || ""}` : t("contact.formTitle")}
                      </h3>
                      {selectedService && (
                        <button
                          onClick={() => { setSelectedService(null); setFormError(""); }}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-navy-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-navy-300 text-xs mb-5 leading-relaxed">
                      {selectedService
                        ? `Tell us more about your interest in ${services.find(s => s.key === selectedService)?.category || ""}.`
                        : "Click on any service above to inquire about it."}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {formError && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-400/30 rounded-lg text-xs text-red-300 font-medium">
                          {formError}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-navy-200 mb-1.5">{t("contact.fullName")}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent" placeholder={t("contact.namePlaceholder")} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-200 mb-1.5">{t("contact.emailField")}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent" placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-200 mb-1.5">{t("contact.message")}</label>
                        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none" placeholder={t("contact.messagePlaceholder")} />
                      </div>
                      <button type="submit" disabled={submitting || !selectedService}
                        className="w-full min-h-[46px] py-3 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                        {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? t("contact.sending") : t("contact.send")}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL SPECTRUM */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("services.spectrum.eyebrow")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-3">{t("services.spectrum.title")}</h2>
          <p className="text-white/70 text-sm mb-8 max-w-2xl">{t("services.spectrum.intro")}</p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {businessModel.map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 bg-navy-300 rounded-full shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
