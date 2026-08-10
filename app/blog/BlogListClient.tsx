"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://client2.wecollections.us";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string | null;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-navy-700 rounded-sm ${className || ""}`} />;
}

export default function BlogListClient() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}/api/posts?type=blog`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter((p: any) => p.published !== false)
            .map((p: any) => ({
              ...p,
              image: p.image ? (p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`) : null,
            }));
          setPosts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="pt-20">
      <section className="relative -mt-20 overflow-hidden flex items-center" style={{ minHeight: "40vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy-800/85" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px)" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-500/15 to-transparent" style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }} />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 w-full pt-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">{t("blog.title")}</h1>
            <p className="text-white/80 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
              {t("blog.subhead")}
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      {!loading && categories.length > 1 && (
        <div className="bg-navy-850 border-b border-white/10 sticky top-[4.5rem] z-30">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); }}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-navy-600 text-white shadow-sm"
                      : "bg-navy-800 text-white/70 hover:bg-navy-700 hover:text-white"
                  }`}
                >
                  {cat === "All" ? t("blog.allCategories") || "All" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="bg-navy-850 pt-12 lg:pt-16 pb-8 lg:pb-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] mb-4">{t("blog.featured")}</p>
          {loading ? (
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3"><Skeleton className="aspect-[16/9] lg:aspect-[16/10] w-full" /></div>
              <div className="lg:col-span-2 flex flex-col justify-center gap-3">
                <Skeleton className="h-3 w-24" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4 mt-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-20" /></div>
                <Skeleton className="h-3 w-28 mt-2" />
              </div>
            </div>
          ) : featured ? (
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                <div className="lg:col-span-3">
                  <div className="relative aspect-[16/9] lg:aspect-[16/10] bg-navy-800 rounded-sm overflow-hidden flex items-center justify-center">
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        priority
                        sizes="(min-width: 1024px) 700px, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{t("blog.featuredImage")}</span>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-3">{featured.category}</span>
                  <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-3 group-hover:text-white/80 transition-colors">{featured.title}</h2>
                  <p className="text-sm text-white/90 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: featured.excerpt }} />
                  <div className="flex items-center gap-4 text-xs text-white/70 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{featured.readTime}</span>
                  </div>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider group-hover:underline">{t("blog.readArticle")} &rarr;</span>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-white/60">{t("blog.noFeatured")}</p>
          )}
        </div>
      </section>

      <section className="bg-navy-850 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-10 lg:mb-12">{t("blog.moreInsights")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-navy-800 border border-white/10 rounded-sm overflow-hidden">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="p-5 lg:p-6 space-y-3">
                      <Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" />
                      <div className="flex gap-3"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-16" /></div>
                    </div>
                  </div>
                ))}
              </>
            ) : rest.length === 0 && !loading ? (
              <div className="col-span-full text-center py-12"><p className="text-sm text-white/60">{t("blog.noArticles")}</p></div>
            ) : (
              rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-navy-800 border border-white/10 rounded-sm hover:border-navy-400 transition-all duration-200">
                  <div className="relative aspect-[16/9] bg-navy-800 flex items-center justify-center overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{t("blog.articleImage")}</span>
                    )}
                  </div>
                  <div className="p-5 lg:p-6">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{post.category}</span>
                    <h3 className="text-sm lg:text-base font-bold text-white leading-snug mt-1.5 mb-2 group-hover:text-white/80 transition-colors">{post.title}</h3>
                    <p className="text-xs text-white/90 leading-relaxed mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    <div className="flex items-center gap-3 text-[10px] text-white/60">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
