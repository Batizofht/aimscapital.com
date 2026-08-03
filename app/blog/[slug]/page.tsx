import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "../../../lib/seo";
import { getPosts } from "../data";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(image: string | undefined): string | null {
  if (!image) return null;
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === resolved.slug);

  if (!post) return { title: `Not Found | ${SITE_NAME}` };

  const plainExcerpt = stripHtml(post.excerpt);
  const absoluteImageUrl = toAbsoluteUrl(post.image as any);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}/`;

  const ogImages = absoluteImageUrl
    ? [{ url: absoluteImageUrl, width: 1200, height: 630, alt: post.title }]
    : [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }];

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: plainExcerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url: canonicalUrl,
      title: post.title,
      description: plainExcerpt,
      images: ogImages,
      publishedTime: post.date,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainExcerpt,
      images: absoluteImageUrl ? [absoluteImageUrl] : [`${SITE_URL}/og-image.png`],
    },
    robots: {
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
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolved = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === resolved.slug);

  if (!post) return null;

  const plainExcerpt = stripHtml(post.excerpt);
  const absoluteImageUrl = toAbsoluteUrl(post.image as any);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}/`;

  const authorIsOrg = !post.author || post.author === SITE_NAME;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: plainExcerpt,
    image: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: [
      {
        "@type": authorIsOrg ? "Organization" : "Person",
        name: post.author || SITE_NAME,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: canonicalUrl,
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LegalService", "Organization"],
    name: SITE_NAME,
    url: SITE_URL,
    description: "Professional legal and investment advisory services in Rwanda.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Blog", url: `${SITE_URL}/blog/` },
          { name: post.title, url: canonicalUrl },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* Hidden SEO content for crawlers — visible content rendered client-side */}
      <div className="sr-only" aria-hidden="true">
        <h1>{post.title}</h1>
        <p>{plainExcerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <BlogDetailClient slug={post.slug} />
    </>
  );
}