"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const socialLinks = [
  { href: "https://x.com/ACA_Attorneys", label: "Twitter / X", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { href: "https://www.instagram.com/aims.attorneys/", label: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { href: "https://www.facebook.com/people/AIMS-Attorneys/61592019836974/", label: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  // { href: "https://linkedin.com/company/aimscapital", label: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy-850 border-t border-white/10">
      <div className="pt-20 pb-12 px-6 lg:px-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Branding */}
          <div>
            <img src="/secondlogo.png" alt="AIMS Capital" className="h-20 w-auto mb-5" />
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              {t("footer.licensed")}
            </p>
            {/* Social Media */}
            <div className="mt-6">
              <p className="text-[11px] font-bold text-white/80 uppercase tracking-[0.2em] mb-3">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center hover:bg-navy-600 hover:border-navy-400 transition-all"
                    aria-label={s.label}
                  >
                    <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d={s.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-[0.2em] mb-6">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              {[
                ["/", "nav.home"],
                ["/about", "nav.aboutUs"],
                ["/practice-areas", "nav.practiceAreas"],
                ["/team", "footer.ourTeam"],
                ["/publications", "nav.publications"],
                ["/events", "nav.events"],
                ["/blog", "nav.blog"],
                ["/partnerships", "nav.globalPartnerships"],
                ["/contact", "nav.contact"],
              ].map(([href, key]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 text-sm hover:text-white transition-colors duration-200"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-[0.2em] mb-6">{t("footer.practiceAreas")}</h3>
            <ul className="space-y-3">
              {[
                "footer.pa.arbitration",
                "footer.pa.finance",
                "footer.pa.construction",
                "footer.pa.contract",
                "footer.pa.land",
              ].map((key) => (
                <li key={key}>
                  <Link href="/practice-areas" className="text-white/70 text-sm hover:text-white transition-colors duration-200">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — last column */}
          <div>
            <h3 className="text-[11px] font-bold text-white/80 uppercase tracking-[0.2em] mb-6">{t("footer.contact")}</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/70 mt-0.5 shrink-0" />
                <p className="text-white/90 text-sm leading-relaxed">
                  KG 5 Ave, Plot 2<br />
                  Gasabo District, Kigali, Rwanda
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/70 shrink-0" />
                <a href="tel:+250788309268" className="text-white text-sm font-medium hover:text-white/80 transition-colors">
                  +250 788 309 268
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/70 shrink-0" />
                <a href="mailto:attorneys@aimscapital.org" className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                  attorneys@aimscapital.org
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 px-6 lg:px-[100px]">
          <p className="text-white/70 text-sm">{t("footer.rights")}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <Link href="/terms" className="text-white/70 text-sm hover:text-white transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
