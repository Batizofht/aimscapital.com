import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services | AIMS Capital",
  description: "Comprehensive legal and investment advisory services by AIMS Capital — licensed by Rwanda Capital Markets Authority since 2011.",
  keywords: ["legal services Rwanda", "investment advisory", "corporate law", "arbitration services", "AIMS Capital services"],
  alternates: { canonical: "/services/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/services/",
    title: "Services | AIMS Capital",
    description: "Comprehensive legal and investment advisory services by AIMS Capital, licensed by Rwanda Capital Markets Authority.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Services" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Services | AIMS Capital", description: "Legal and investment advisory services.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
