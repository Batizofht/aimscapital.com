import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "AIMS Capital - Attorneys . Arbitrators . Investment Advisors",
  description:
    "A corporate law firm licensed by Rwanda Capital Markets Authority. Legal and investment advisory services since 2011.",
  keywords: ["law firm Rwanda", "investment advisory Kigali", "arbitration East Africa", "corporate legal services", "AIMS Capital"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/",
    title: "AIMS Capital - Attorneys . Arbitrators . Investment Advisors",
    description: "A corporate law firm licensed by Rwanda Capital Markets Authority. Legal and investment advisory services since 2011.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMS Capital - Attorneys . Arbitrators . Investment Advisors",
    description: "A corporate law firm licensed by Rwanda Capital Markets Authority. Legal and investment advisory services since 2011.",
    images: ["/twitter-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <HomeClient />;
}
