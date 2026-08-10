import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://aimscapital.rw";
  const apiBase = "https://client2.wecollections.us";

  // Static pages - ALL with trailing slashes to match trailingSlash: true config
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/about/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/practice-areas/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/publications/", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/events/", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/search/", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/team/", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/partnerships/", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/membership/", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/contact/", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/blog/", priority: 1.0, changeFrequency: "daily" as const },
  ];

  // Fetch dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiBase}/api/posts`, { cache: "force-cache" });
    if (res.ok) {
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : [];
      
      if (blogs.length > 0) {
        blogPosts = blogs
          .filter((blog: any) => blog.published !== false)
          .map((blog: any) => ({
            url: `${baseUrl}/blog/${blog.slug}/`,
            lastModified: blog.updatedAt || blog.date || new Date(),
            priority: 1.0,
            changeFrequency: "daily" as const,
          }));
      }
    }
  } catch {
    // Ignore errors, return static pages only
  }

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...blogPosts,
  ];
}