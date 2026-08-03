import { Metadata } from "next";
import ProjectsPageClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects | AIMS Capital",
  description: "Major advisory engagements and infrastructure projects delivered by AIMS Capital across Rwanda and East Africa — including PPPs, land use, finance, and aviation.",
  keywords: ["AIMS Capital projects", "infrastructure Rwanda", "PPP advisory", "CDM projects", "Bugesera water", "land use master plan"],
  alternates: { canonical: "/projects/" },
  openGraph: {
    type: "website",
    siteName: "AIMS Capital",
    url: "/projects/",
    title: "Projects | AIMS Capital",
    description: "Major advisory engagements and infrastructure projects across Rwanda and East Africa.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIMS Capital Projects" }],
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Projects | AIMS Capital", description: "Major advisory engagements and infrastructure projects.", images: ["/twitter-image.png"] },
  robots: { index: true, follow: true },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}