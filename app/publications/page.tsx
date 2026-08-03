import type { Metadata } from "next";
import PublicationsClient from "./PublicationsClient";

export const metadata: Metadata = {
  title: "Publications | AIMS Capital - Legal & Investment Documents",
  description:
    "Browse PDF publications, reports and documents from AIMS Capital — covering arbitration, finance, infrastructure, aviation, and cross-border investment advisory in Africa.",
  keywords: [
    "AIMS Capital publications",
    "legal documents Rwanda",
    "investment reports Africa",
    "corporate law PDFs",
    "infrastructure reports",
  ],
  alternates: { canonical: "/publications/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/publications/",
    title: "Publications | AIMS Capital - Legal & Investment Documents",
    description:
      "Browse PDF publications, reports and documents from AIMS Capital covering arbitration, finance, infrastructure, aviation, and investment advisory.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Publications" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Publications | AIMS Capital",
    description: "PDF publications and documents from AIMS Capital.",
    images: ["/twitter-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function PublicationsPage() {
  return <PublicationsClient />;
}
