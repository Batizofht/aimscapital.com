import { Metadata } from "next";
import ContactPageClient from "./ContactClient";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Contact | AIMS Capital",
  description: "Contact AIMS Capital Associates for legal, arbitration, and investment advisory services in Kigali, Rwanda. Schedule a consultation with our team.",
  keywords: ["contact AIMS Capital", "law firm Kigali", "legal consultation Rwanda", "corporate lawyer contact", "investment advisory inquiry"],
  alternates: { canonical: "/contact/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/contact/",
    title: "Contact | AIMS Capital",
    description: "Contact AIMS Capital for legal, arbitration, and investment advisory services in Kigali, Rwanda.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact AIMS Capital" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Contact | AIMS Capital", description: "Get in touch with AIMS Capital.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact/" },
      ]} />
      <ContactPageClient />
    </>
  );
}