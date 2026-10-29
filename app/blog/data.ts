const API_URL = "https://api.aimscapital.org";

export interface BlogPost {
  tags: any;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string | null;
  published?: boolean;
  updatedAt?: string;
  fileUrl?: string | null;
  type?: string;
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts?published=true`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data
          .filter((p: BlogPost) => p.published !== false && p.type !== 'document')
          .map((p: BlogPost) => ({
            ...p,
            image: p.image ? (p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`) : null
          }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch posts:", e);
  }
  return [];
}