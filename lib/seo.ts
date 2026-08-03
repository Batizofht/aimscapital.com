import type { Metadata } from "next";

export const SITE_URL = "https://aimscapital.rw";
export const SITE_NAME = "AIMS Capital";
export const DEFAULT_OG_IMAGE = "/og-image.png";

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  type = "website",
}: PageSeoInput): Metadata {
  let canonical = path.startsWith("/") ? path : `/${path}`;
  if (canonical !== "/" && !canonical.endsWith("/")) {
    canonical = `${canonical}/`;
  }
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: `${title} | ${SITE_NAME}` }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 600, alt: `${title} | ${SITE_NAME}` }],
      creator: "@aimscapital",
      site: "@aimscapital",
    },
  };
}