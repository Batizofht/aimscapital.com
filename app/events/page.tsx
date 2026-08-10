import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events | AIMS Capital - Audio & Video",
  description:
    "Audio and video coverage of AIMS Capital events, interviews and briefings — arbitration, finance, infrastructure and investment advisory in Africa.",
  keywords: [
    "AIMS Capital events",
    "legal events Rwanda",
    "investment advisory videos",
    "arbitration interviews Africa",
  ],
  alternates: { canonical: "/events/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/events/",
    title: "Events | AIMS Capital",
    description: "Audio and video coverage of AIMS Capital events, interviews and briefings.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Events" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | AIMS Capital",
    description: "Audio and video coverage of AIMS Capital events.",
    images: ["/twitter-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function EventsPage() {
  return <EventsClient />;
}
