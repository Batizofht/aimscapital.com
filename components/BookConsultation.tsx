"use client";

import { useState, useMemo } from "react";
import { Calendar, Video, Phone, Building, Monitor, X, ChevronLeft, ChevronRight, Check, Clock, Loader } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

export default function BookConsultation() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // apiName stays English (canonical value sent to the backend); label/desc are translated.
  const platforms = [
    { id: "zoom", label: t("consultation.platforms.zoom"), icon: Video, desc: t("consultation.platforms.videoDesc"), apiName: "Zoom" },
    { id: "google-meet", label: t("consultation.platforms.googleMeet"), icon: Monitor, desc: t("consultation.platforms.videoDesc"), apiName: "Google Meet" },
    { id: "teams", label: t("consultation.platforms.teams"), icon: Monitor, desc: t("consultation.platforms.videoDesc"), apiName: "Microsoft Teams" },
    { id: "in-person", label: t("consultation.platforms.inPerson"), icon: Building, desc: t("consultation.platforms.officeDesc"), apiName: "In-Person" },
    { id: "phone", label: t("consultation.platforms.phone"), icon: Phone, desc: t("consultation.platforms.phoneDesc"), apiName: "Phone Call" },
  ];

  const MONTHS = t("consultation.months", { returnObjects: true }) as string[];
  const DAYS = t("consultation.days", { returnObjects: true }) as string[];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"platform" | "date" | "details">("platform");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = useMemo(() => new Date(calendarYear, calendarMonth + 1, 0).getDate(), [calendarMonth, calendarYear]);
  const firstDayOfMonth = useMemo(() => new Date(calendarYear, calendarMonth, 1).getDay(), [calendarMonth, calendarYear]);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const isPast = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateValue = (day: number) => `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("platform");
      setName("");
      setEmail("");
      setPhone("");
      setSelectedPlatform("");
      setSelectedDate("");
      setSelectedTime("");
      setSubmitted(false);
    }, 200);
  };

  const handleSubmit = async () => {
    if (!name || !email || !selectedPlatform || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    const p = platforms.find((x) => x.id === selectedPlatform);
    try {
      const res = await fetch("https://client2.wecollections.us/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedDate,
          time: selectedTime,
          platform: p?.apiName || "Zoom",
          notes: "",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      toast.success(t("consultation.submittedToast"));
    } catch {
      toast.error(t("chat.connError"));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPlatformData = platforms.find((p) => p.id === selectedPlatform);

  return (
    <>
      <button onClick={() => { setOpen(true); if (user) { setName(user.name); setEmail(user.email); } }}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2.5 px-3.5 py-3 sm:px-5 bg-navy-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_4px_20px_rgba(6,15,28,0.5)] hover:bg-navy-600 hover:shadow-[0_6px_24px_rgba(6,15,28,0.6)] transition-all duration-200">
        <Calendar className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">{t("consultation.button")}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-navy-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/10">
            <div className="px-8 pt-8 pb-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{t("consultation.title")}</h3>
                  <p className="text-xs text-white/70 mt-1">{t("consultation.subtitle")}</p>
                </div>
                <button onClick={handleClose} className="p-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
              </div>
              {!submitted && (
                <div className="flex items-center gap-0 mb-6">
                  {["platform", "date", "details"].map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all ${step === s ? "bg-navy-500 text-white" : ["platform", "date", "details"].indexOf(step) > i ? "bg-navy-700 text-white/80" : "bg-navy-800 text-white/60"}`}>
                        {["platform", "date", "details"].indexOf(step) > i ? <Check className="w-3 h-3" /> : i + 1}
                      </div>
                      {i < 2 && <div className={`flex-1 h-px mx-2 ${["platform", "date", "details"].indexOf(step) > i ? "bg-navy-500" : "bg-white/10"}`} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-8 pb-8 max-h-[65vh] overflow-y-auto">
              {!submitted && (
                <>
                  {step === "platform" && (
                    <div>
                      <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold mb-4">{t("consultation.stepMethod")}</p>
                      <div className="space-y-3">
                        {platforms.map((p) => {
                          const Icon = p.icon;
                          const active = selectedPlatform === p.id;
                          return (
                            <button key={p.id} onClick={() => { setSelectedPlatform(p.id); setStep("date"); }}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${active ? "border-navy-400 bg-navy-800" : "border-white/10 bg-navy-850 hover:border-navy-500 hover:bg-navy-800"}`}>
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${active ? "bg-navy-500" : "bg-navy-700"}`}>
                                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-white/80"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm font-bold block ${active ? "text-white/90" : "text-white"}`}>{p.label}</span>
                                <span className="text-xs text-white/70">{p.desc}</span>
                              </div>
                              {active && <Check className="w-4 h-4 text-white/80 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === "date" && (
                    <div>
                      <button onClick={() => setStep("platform")} className="text-[11px] text-white/80 font-semibold uppercase tracking-wider mb-4 hover:underline flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> {t("consultation.back")}
                      </button>
                      <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold mb-4">{t("consultation.stepDate")}</p>
                      <div className="border border-white/10 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-5">
                          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                          <span className="text-sm font-bold text-white">{MONTHS[calendarMonth]} {calendarYear}</span>
                          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {DAYS.map((d) => <span key={d} className="text-[10px] font-bold text-white/70 uppercase tracking-wider py-1">{d}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {calendarDays.map((day, i) => {
                            if (day === null) return <div key={`e-${i}`} />;
                            const past = isPast(day);
                            const selected = selectedDate === formatDateValue(day);
                            return (
                              <button key={day} disabled={past} onClick={() => { setSelectedDate(formatDateValue(day)); setSelectedTime(""); }}
                                className={`text-sm py-2.5 rounded-lg transition-all ${selected ? "bg-navy-500 text-white font-semibold shadow-sm" : past ? "text-white/30 cursor-not-allowed" : "text-white/90 hover:bg-white/10"}`}>
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {selectedDate && (
                        <div className="mt-4">
                          <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold mb-3">{t("consultation.stepTime")}</p>
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map((t) => (
                              <button key={t} onClick={() => setSelectedTime(t)}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${selectedTime === t ? "bg-navy-500 text-white border-navy-500" : "bg-navy-850 text-white/80 border-white/10 hover:border-navy-400 hover:bg-navy-800"}`}>
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-white/70 mt-4 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {t("consultation.confirmNote")}</p>
                      <button onClick={() => selectedDate && selectedTime && setStep("details")} disabled={!selectedDate || !selectedTime}
                        className="w-full mt-4 py-3.5 text-sm font-semibold text-white bg-navy-500 rounded-xl hover:bg-navy-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed">{t("consultation.continue")}</button>
                    </div>
                  )}

                  {step === "details" && (
                    <div>
                      <button onClick={() => setStep("date")} className="text-[11px] text-white/80 font-semibold uppercase tracking-wider mb-4 hover:underline flex items-center gap-1">
                        <ChevronLeft className="w-3 h-3" /> {t("consultation.back")}
                      </button>
                      <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold mb-4">{t("consultation.stepInfo")}</p>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1.5">{t("consultation.fullName")}</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white bg-navy-850 focus:bg-navy-800 transition-colors placeholder-navy-400" placeholder={t("consultation.namePlaceholder")} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1.5">{t("consultation.email")}</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white bg-navy-850 focus:bg-navy-800 transition-colors placeholder-navy-400" placeholder="your@email.com" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-1.5">{t("consultation.phone")}</label>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white bg-navy-850 focus:bg-navy-800 transition-colors placeholder-navy-400" placeholder={t("consultation.phonePlaceholder")} />
                        </div>
                      </div>

                      <div className="bg-navy-800 border border-white/10 rounded-xl p-4 mb-6">
                        <p className="text-[11px] text-white/80 font-bold uppercase tracking-wider mb-3">{t("consultation.summary")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-white/70">{t("consultation.platform")}</span><span className="font-medium text-white">{selectedPlatformData?.label}</span></div>
                          {selectedDate && <div className="flex justify-between"><span className="text-white/70">{t("consultation.date")}</span><span className="font-medium text-white">{selectedDate}</span></div>}
                          {selectedTime && <div className="flex justify-between"><span className="text-white/70">{t("consultation.time")}</span><span className="font-medium text-white">{selectedTime}</span></div>}
                        </div>
                      </div>

                      <button onClick={handleSubmit} disabled={!name || !email || submitting}
                        className="w-full py-3.5 text-sm font-semibold text-white bg-navy-500 rounded-xl hover:bg-navy-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {submitting && <Loader className="w-4 h-4 animate-spin" />}
                        {submitting ? t("consultation.submitting") : t("consultation.submit")}
                      </button>
                    </div>
                  )}
                </>
              )}

              {submitted && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-5"><Check className="w-7 h-7 text-white/80" /></div>
                  <h4 className="text-lg font-bold text-white mb-2">{t("consultation.submittedTitle")}</h4>
                  <p className="text-sm text-white/70 mb-6 max-w-xs mx-auto leading-relaxed">{t("consultation.submittedBody", { name })}</p>
                  <div className="bg-navy-800 border border-white/10 rounded-xl p-4 text-left mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-white/70">{t("consultation.platform")}</span><span className="font-medium text-white">{selectedPlatformData?.label}</span></div>
                      <div className="flex justify-between"><span className="text-white/70">{t("consultation.date")}</span><span className="font-medium text-white">{selectedDate}</span></div>
                      <div className="flex justify-between"><span className="text-white/70">{t("consultation.time")}</span><span className="font-medium text-white">{selectedTime}</span></div>
                      <div className="flex justify-between"><span className="text-white/70">{t("consultation.email")}</span><span className="font-medium text-white">{email}</span></div>
                    </div>
                  </div>
                  <button onClick={handleClose} className="px-10 py-3 text-sm font-semibold text-white bg-navy-500 rounded-xl hover:bg-navy-400 transition-all">{t("consultation.done")}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
