import { Metadata } from "next";
import PracticeAreasClient from "./PracticeAreasClient";

export const metadata: Metadata = {
  title: "Practice Areas | AIMS Capital",
  description: "12 specialised practice areas and full-spectrum legal and investment advisory services at AIMS Capital: arbitration, aviation, finance, infrastructure, contract management, health, insolvency, land, legal representation, consultancy, tax, and technology — licensed by Rwanda Capital Markets Authority since 2011.",
  keywords: ["legal practice areas Rwanda", "arbitration Rwanda", "corporate law services", "investment advisory", "PPP law", "AIMS Capital services", "legal services Rwanda"],
  alternates: { canonical: "/practice-areas/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/practice-areas/",
    title: "Practice Areas | AIMS Capital",
    description: "12 specialised practice areas: arbitration, aviation, finance, infrastructure, contract management, and more.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Practice Areas" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Practice Areas | AIMS Capital", description: "12 specialised practice areas from AIMS Capital.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function PracticeAreasPage() {
  return <PracticeAreasClient />;
}
