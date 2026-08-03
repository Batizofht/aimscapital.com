import { Metadata } from "next";
import TeamClient from "./TeamClient";

export const metadata: Metadata = {
  title: "Our Team | AIMS Capital",
  description: "Meet the leadership team at AIMS Capital — experienced attorneys, arbitrators, and investment advisors serving clients across Rwanda and East Africa.",
  keywords: ["AIMS Capital team", "Rwanda attorneys", "corporate lawyers Kigali", "arbitrators Rwanda", "investment advisors"],
  alternates: { canonical: "/team/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/team/",
    title: "Our Team | AIMS Capital",
    description: "Meet the leadership team at AIMS Capital — experienced attorneys, arbitrators, and investment advisors.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Team" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Our Team | AIMS Capital", description: "Leadership team of attorneys and investment advisors.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function TeamPage() {
  return <TeamClient />;
}
