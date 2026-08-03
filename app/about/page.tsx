import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | AIMS Capital - Attorneys, Arbitrators & Investment Advisors",
  description: "Learn about AIMS Capital Associates — a corporate law firm established in 2011, licensed by Rwanda Capital Markets Authority with 22+ years of legal and investment advisory experience.",
  keywords: ["AIMS Capital history", "Rwanda law firm", "corporate legal team", "investment advisors Kigali", "Alloys Mutabingwa"],
  alternates: { canonical: "/about/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/about/",
    title: "About | AIMS Capital - Attorneys, Arbitrators & Investment Advisors",
    description: "Learn about AIMS Capital Associates — a corporate law firm established in 2011, licensed by Rwanda Capital Markets Authority.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About AIMS Capital" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "About | AIMS Capital", description: "Learn about AIMS Capital Associates.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return <AboutClient />;
}
