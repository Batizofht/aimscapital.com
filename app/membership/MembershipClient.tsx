"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { User, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function MembershipPageClient() {
  const { user, loading, login, register } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"beneficial" | "professional">("beneficial");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-navy-850 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-400 mx-auto"></div>
          <p className="text-white/70 mt-4 text-sm">{t("membership.loading")}</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    if (typeof window !== "undefined") {
      window.location.replace("/account");
    }
    return (
      <div className="pt-20 min-h-screen bg-navy-850 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-400 mx-auto"></div>
          <p className="text-white/70 mt-4 text-sm">{t("membership.redirecting")}</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError(t("membership.fillFields")); return; }
    setBtnLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        toast.success(t("membership.welcome"));
        window.location.replace("/account");
      } else {
        toast.error(result.error || t("membership.loginFailed"));
        setError(result.error || t("membership.loginFailed"));
      }
    } catch {
      const msg = t("membership.genericError");
      toast.error(msg);
      setError(msg);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError(t("membership.fillFields")); return; }
    setBtnLoading(true);
    try {
      const err = await register(name, email, password, type);
      if (err) {
        toast.error(err);
        setError(err);
      } else {
        toast.success(t("membership.createdToast"));
        window.location.replace("/account");
      }
    } catch {
      const msg = t("membership.genericError");
      toast.error(msg);
      setError(msg);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-navy-850 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-navy-800 rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-navy-600 flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              {tab === "login" ? t("membership.signInTitle") : t("membership.createTitle")}
            </h1>
            <p className="text-sm text-white/70 mt-1">
              {tab === "login" ? t("membership.signInSub") : t("membership.createSub")}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-navy-850 rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tab === tabKey ? "bg-navy-600 text-white shadow-sm" : "text-white/70 hover:text-white"
                }`}
              >
                {tabKey === "login" ? t("membership.tabSignIn") : t("membership.tabRegister")}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1.5">{t("membership.fullName")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white placeholder-navy-400 bg-navy-850 focus:bg-navy-800 transition-colors"
                    placeholder={t("membership.namePlaceholder")}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">{t("membership.emailLabel")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white placeholder-navy-400 bg-navy-850 focus:bg-navy-800 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">{t("membership.passwordLabel")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent text-sm text-white placeholder-navy-400 bg-navy-850 focus:bg-navy-800 transition-colors"
                  placeholder="password"
                />
              </div>
            </div>

            {tab === "register" && (
              <div>
                <label className="block text-xs font-medium text-white/80 mb-2">{t("membership.membershipType")}</label>
                <div className="flex gap-3">
                  {([
                    { value: "beneficial" as const, label: t("membership.beneficial"), desc: t("membership.beneficialDesc") },
                    { value: "professional" as const, label: t("membership.professional"), desc: t("membership.professionalDesc") },
                  ]).map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
                        type === opt.value
                          ? "border-navy-400 bg-navy-700"
                          : "border-white/10 hover:border-navy-500"
                      }`}
                    >
                      <span className={`text-sm font-bold block ${type === opt.value ? "text-white/90" : "text-white"}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-white/70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full py-3.5 text-sm font-semibold text-white bg-navy-600 rounded-xl hover:bg-navy-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {btnLoading ? t("membership.pleaseWait") : tab === "login" ? t("membership.signIn") : t("membership.createAccount")}
              {!btnLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {tab === "login" && (
            <p className="text-xs text-white/60 text-center mt-6">
              {t("membership.footerNote")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
