import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import I18nProvider from "@/lib/i18n/I18nProvider";
import { Toaster } from "sonner";
import CookieBanner from "@/components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aimscapital.rw"),
  title: "AIMS Capital - Attorneys. Arbitrators. Investment Advisors.",
  description: "Professional legal and investment advisory services in Rwanda.",
  icons: [{ rel: "icon", url: "/fav.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
      >
        <I18nProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster position="top-right" richColors closeButton />
            <CookieBanner />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
