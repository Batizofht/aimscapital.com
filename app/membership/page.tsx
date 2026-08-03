import { Metadata } from "next";
import MembershipPageClient from "./MembershipClient";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Membership | AIMS Capital",
  description: "Register or log in to your AIMS Capital account to manage appointments, service requests, and communications.",
  keywords: ["AIMS Capital login", "client portal Rwanda", "legal account access", "AIMS Capital membership"],
  alternates: { canonical: "/membership/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/membership/",
    title: "Membership | AIMS Capital",
    description: "Register or log in to your AIMS Capital account.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Membership" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Membership | AIMS Capital", description: "Client account access.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function MembershipPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Membership", url: "/membership/" },
      ]} />
      <MembershipPageClient />
    </>
  );
}