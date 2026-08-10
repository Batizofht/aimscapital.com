"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";
import SearchDropdown from "./SearchDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavLinkItem {
  href: string;
  label: string; // i18n key
}

// Labels below are i18n keys, resolved with t() at render.
const navLinks: NavLinkItem[] = [
  { href: "/", label: "nav.home" },
  { href: "/contact", label: "nav.contactUs" },
  { href: "/team", label: "nav.team" },
  { href: "/practice-areas", label: "nav.practiceAreas" },
  { href: "/publications", label: "nav.publications" },
  { href: "/events", label: "nav.events" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sky-600">
      <div className="h-18 flex items-center justify-between gap-2 px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" onClick={() => setIsOpen(false)}>
          <img
            src="/secondlogo.png"
            alt="AIMS Capital Logo"
            className="h-13 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white hover:text-white/80 transition-colors font-medium whitespace-nowrap"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          <SearchDropdown />
          <Link
            href="/blog"
            className="text-sm text-white hover:text-white/80 transition-colors font-medium whitespace-nowrap"
          >
            {t("nav.blog")}
          </Link>
          <LanguageSwitcher />
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-navy-600 flex items-center justify-center hover:bg-navy-500 transition-all shrink-0"
              >
                <span className="text-xs lg:text-sm font-bold text-white">{user.name.charAt(0)}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-navy-800 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-white/70">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {t("nav.myDashboard")}
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/membership"
              className="p-2 lg:p-2.5 text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-all shrink-0"
              aria-label={t("nav.membership")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
          <Link
            href="/contact"
            aria-label={t("nav.contactUs")}
            className="flex items-center gap-2 p-2.5 min-[1340px]:px-5 min-[1340px]:py-2.5 text-base font-semibold text-navy-900 bg-white rounded-lg hover:bg-navy-100 transition-all whitespace-nowrap shrink-0"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden min-[1340px]:inline">{t("nav.contactUs")}</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-18 bottom-0 inset-x-0 z-[55] bg-sky-600 overflow-y-auto">
          <div className="flex flex-col py-4 px-6 min-h-[200px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3.5 text-white hover:bg-white/10 rounded-lg transition-colors text-base font-medium"
              >
                {t(link.label)}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-white/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).querySelector("input");
                  if (input?.value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder={t("nav.search")}
                  className="w-full px-4 py-3.5 pl-10 text-base text-white bg-white/10 rounded-lg border border-white/20 placeholder-white/50 outline-none focus:border-white/40"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-medium text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span>{t("nav.blog")}</span>
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-medium text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xs font-bold text-navy-900">{user.name.charAt(0)}</span>
                    </span>
                    <span>{t("nav.myDashboard")}</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-medium text-red-300 border-2 border-red-400/40 rounded-lg hover:bg-red-500/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t("nav.signOut")}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/membership"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-medium text-white border-2 border-white/40 rounded-lg hover:bg-white/10 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{t("nav.membership")}</span>
                </Link>
              )}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-navy-900 bg-white rounded-lg hover:bg-navy-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{t("nav.contactUs")}</span>
              </Link>
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-2">{t("common.language")}</p>
                <LanguageSwitcher variant="mobile" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
