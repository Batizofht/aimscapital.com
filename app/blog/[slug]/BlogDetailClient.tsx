"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { SITE_URL, SITE_NAME } from "../../../lib/seo";

const API_URL = "https://client2.wecollections.us";

interface BlogPost {
  tags: string[];
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(image: string | undefined | null): string | null {
  if (!image) return null;
  return image.startsWith("http") ? image : `${API_URL}${image}`;
}

function PostSkeleton() {
  return (
    <div className="pt-20 animate-pulse">
      <article className="bg-navy-850 py-16 lg:py-24">
        <div className="max-w-[760px] mx-auto px-4 md:px-6">
          <div className="h-4 bg-navy-700 rounded w-32 mb-8" />
          <div className="h-6 bg-navy-700 rounded w-24 mb-4" />
          <div className="h-10 bg-navy-700 rounded w-full mb-5" />
          <div className="h-8 bg-navy-700 rounded w-1/2 mb-10" />
          <div className="aspect-[16/9] bg-navy-700 rounded-lg mb-10" />
          <div className="space-y-3">
            <div className="h-4 bg-navy-700 rounded w-full" />
            <div className="h-4 bg-navy-700 rounded w-5/6" />
            <div className="h-4 bg-navy-700 rounded w-4/6" />
          </div>
        </div>
      </article>
    </div>
  );
}

interface Props {
  slug: string;
}

export default function BlogDetailClient({ slug }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/posts/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          if (!cancelled) setPost(null);
          return;
        }
        const data: BlogPost = await res.json();
        if (data.image && !data.image.startsWith("http")) {
          data.image = `${API_URL}${data.image}`;
        }
        if (!cancelled) setPost(data);
      } catch {
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPost();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetch(`${API_URL}/api/posts?published=true`)
        .then((r) => r.json())
        .then((all: BlogPost[]) => {
          const filtered = all
            .filter((p: BlogPost) => p.slug !== slug && p.published !== false && p.type !== "document")
            .slice(0, 3)
            .map((p: BlogPost) => ({
              ...p,
              image: p.image ? (p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`) : null,
            }));
          setRelated(filtered);
        })
        .catch(() => {});
    }
  }, [post, slug]);

  if (loading) return <PostSkeleton />;
  if (!post) return null;

  const absoluteImageUrl = toAbsoluteUrl(post.image);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}/`;

  return (
    <div className="pt-20">
      <article className="bg-navy-850 py-16 lg:py-24">
        <div className="max-w-[760px] mx-auto px-4 md:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-white/60 mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-white/80 font-semibold uppercase tracking-wider hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" aria-hidden="true" />
              Back to Blog
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span aria-current="page" className="truncate max-w-[200px] text-white/60">
              {post.title}
            </span>
          </nav>

          <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.18em] mb-4">
            <span className="bg-navy-800 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-[1.18] tracking-tight mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-white/60 mb-10 pb-8 border-b border-white/10">
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
              {post.date}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
              {post.readTime}
            </span>
            {post.author && (
              <span className="text-white/70 font-medium">
                By{" "}
                <a
                  href={`/blog?author=${encodeURIComponent(post.author)}`}
                  rel="author"
                  className="hover:text-white transition-colors"
                >
                  {post.author}
                </a>
              </span>
            )}
          </div>

          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-navy-800 mb-10 shadow-sm">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 768px) 760px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  Article Image
                </span>
              </div>
            )}
          </div>

          <div
            className="text-base text-white/90 italic leading-relaxed mb-10 pl-5 border-l-[3px] border-navy-400"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />

          <div
            className="
              prose prose-sm sm:prose-base prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
              prose-p:text-white/90 prose-p:leading-[1.8]
              prose-a:text-white/80 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-blockquote:border-l-navy-400 prose-blockquote:text-white/70 prose-blockquote:not-italic
              prose-ul:text-white/90 prose-ol:text-white/90
              prose-pre:bg-navy-800 prose-pre:border prose-pre:border-white/10
              prose-img:rounded-lg
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-[11px] font-medium text-white/80 bg-navy-800 hover:bg-navy-700 px-3 py-1 rounded-full transition-colors"
                  rel="tag"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-label="Related articles"
          className="bg-navy-850 border-t border-white/10 py-16 lg:py-24"
        >
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10 lg:mb-12">
              Related Insights
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {related.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}/`}
                  className="group flex flex-col bg-navy-800 rounded-lg border border-white/10 hover:border-navy-400 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-navy-800 overflow-hidden">
                    {relatedPost.image ? (
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                          Article Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5 lg:p-6">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-sm lg:text-[0.9375rem] font-bold text-white leading-snug mb-2 group-hover:text-white/80 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {stripHtml(relatedPost.excerpt)}
                    </p>
                    <time dateTime={relatedPost.date} className="text-[10px] text-white/60 mt-auto">
                      {relatedPost.date}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
