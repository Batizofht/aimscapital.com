"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, ChevronDown, Loader, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const subjectKeys = ["corporate", "projects", "litigation", "consulting", "infrastructure", "consultation", "other"] as const;

export default function ContactPageClient() {
  const { t } = useTranslation();
  const subjects = subjectKeys.map((k) => ({ value: k, label: t(`contact.subjects.${k}`) }));
  const [subject, setSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("subject");
    if (s) {
      const match = subjectKeys.find((k) => k === s.toLowerCase() || (k === "corporate" && s.toLowerCase() === "corporate law"));
      if (match) setSubject(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subjectOpen && subjectRef.current) {
      const rect = subjectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 240);
    }
  }, [subjectOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name || !email || !subject || !message) {
      setFormError(t("contact.fillFields"));
      return;
    }
    // Always submit the canonical English subject label to the backend.
    const subjectLabelEn: Record<string, string> = { corporate: "Corporate Law", projects: "Projects", litigation: "Litigation", consulting: "Consulting", infrastructure: "Infrastructure", consultation: "Consultation", other: "Other" };
    setSubmitting(true);
    try {
      const res = await fetch("https://client2.wecollections.us/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject === "other" && customSubject ? customSubject : (subjectLabelEn[subject] || subject),
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
      {/* ─── HERO ─── */}
      <section className="relative -mt-20 overflow-hidden flex items-center" style={{ minHeight: "40vh" }}>
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-400/15 to-transparent" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-20">
          <div className="text-center">
            <div className="w-12 h-0.5 bg-navy-400 mx-auto mb-5" />
            <p className="text-navy-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("contact.hero.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
              {t("contact.hero.title")}
            </h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
              {t("contact.hero.subhead")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{t("contact.addressLabel")}</h3>
                <div className="flex items-start gap-3 text-navy-100">
                  <MapPin className="w-5 h-5 text-navy-300 mt-0.5 shrink-0" />
                  <div>
                    <p>KG 5 Ave, Plot 2<br />Kacyiru (near KBC)<br />Gasabo District, Kigali, Rwanda</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{t("contact.phoneLabel")}</h3>
                <a href="tel:+250788309268" className="flex items-center gap-3 text-navy-100 font-bold hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-navy-300" />
                  +250 788 309 268
                </a>
              </div>

              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{t("contact.emailLabel")}</h3>
                <a href="mailto:attorneys@aimscapital.org" className="flex items-center gap-3 text-navy-200 font-bold hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-navy-300" />
                  attorneys@aimscapital.org
                </a>
              </div>

              <div className="pt-4 lg:pt-6 border-t border-white/10">
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">{t("contact.hoursLabel")}</h3>
                <p className="text-navy-100">{t("contact.hoursValue")}</p>
              </div>
            </div>

            {/* Form / Success State */}
            <div className="bg-navy-800 p-5 md:p-8 rounded-xl border border-white/10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                    <Check className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t("contact.sentTitle")}</h3>
                  <p className="text-navy-300 text-sm max-w-xs mx-auto mb-6">{t("contact.sentBody")}</p>
                  <button
                    onClick={() => { setSubmitted(false); setName(""); setEmail(""); setSubject(""); setMessage(""); setCustomSubject(""); setFormError(""); }}
                    className="px-6 py-3 bg-navy-600 text-white text-sm font-semibold rounded-xl hover:bg-navy-500 transition-all"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">{t("contact.formTitle")}</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {formError && (
                      <div className="px-4 py-2 bg-red-500/10 border border-red-400/30 rounded-lg text-xs text-red-300 font-medium">
                        {formError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-navy-200 mb-2">{t("contact.fullName")}</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent" placeholder={t("contact.namePlaceholder")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-200 mb-2">{t("contact.emailField")}</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-200 mb-2">{t("contact.subject")}</label>
                      <div className="relative" ref={subjectRef}>
                        <button
                          type="button"
                          onClick={() => setSubjectOpen(!subjectOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 border border-white/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent bg-navy-850 text-sm text-left"
                        >
                          <span className={subject ? "text-white" : "text-navy-400"}>
                            {subject ? t(`contact.subjects.${subject}`) : t("contact.selectSubject")}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-navy-300 transition-transform duration-200 ${subjectOpen ? "rotate-180" : ""}`} />
                        </button>
                        {subjectOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setSubjectOpen(false)} />
                            <div className={`absolute z-20 left-0 right-0 bg-navy-800 border border-white/10 rounded-lg shadow-lg overflow-hidden ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
                              {subjects.map((s) => (
                                <button
                                  key={s.value}
                                  type="button"
                                  onClick={() => {
                                    setSubject(s.value);
                                    setSubjectOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                    subject === s.value
                                      ? "bg-navy-600 text-white font-medium"
                                      : "text-navy-100 hover:bg-white/5"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className={`overflow-hidden transition-all duration-200 ${subject === "other" ? "max-h-20 mt-3" : "max-h-0"}`}>
                        <input
                          type="text" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)}
                          className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent"
                          placeholder={t("contact.subjectOther")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-200 mb-2">{t("contact.message")}</label>
                      <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-white/15 bg-navy-850 text-white placeholder-navy-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent resize-none" placeholder={t("contact.messagePlaceholder")} />
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full min-h-[46px] py-3 text-sm font-semibold text-white bg-navy-600 rounded-lg hover:bg-navy-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                      {submitting && <Loader className="w-4 h-4 animate-spin" />}
                      {submitting ? t("contact.sending") : t("contact.send")}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section className="bg-navy-900 py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-navy-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("contact.locationEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">{t("contact.findUs")}</h2>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <iframe
              src="https://maps.google.com/maps?q=KG%205%20Ave%2C%20Kacyiru%2C%20Kigali%2C%20Rwanda&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AIMS Capital Office Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
