import { Metadata } from "next";
import PartnershipsClient from "./PartnershipsClient";

export const metadata: Metadata = {
  title: "Partnerships | AIMS Capital",
  description: "Strategic partnerships and alliances of AIMS Capital with global organizations across law, finance, infrastructure, and development sectors in Africa.",
  keywords: ["AIMS Capital partnerships", "legal network Rwanda", "corporate alliances East Africa", "law firm partnerships"],
  alternates: { canonical: "/partnerships/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/partnerships/",
    title: "Partnerships | AIMS Capital",
    description: "Strategic partnerships and alliances with global organizations across law, finance, and development sectors.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Partnerships" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Partnerships | AIMS Capital", description: "Global strategic partnerships.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function PartnershipsPage() {
  return <PartnershipsClient />;
}
