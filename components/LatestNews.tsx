"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://client2.wecollections.us";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string | null;
}

export default function LatestNews() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/posts?type=blog`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter((p: any) => p.published !== false)
            .slice(0, 3)
            .map((p: any) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              category: p.category,
              date: p.date,
              image: p.image ? (p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`) : null,
            }));
          setPosts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-navy-800 border border-white/10 rounded-xl p-6 lg:p-8 animate-pulse">
            <div className="h-3 w-20 bg-navy-700 rounded mb-4" />
            <div className="h-5 w-full bg-navy-700 rounded mb-2" />
            <div className="h-5 w-3/4 bg-navy-700 rounded mb-3" />
            <div className="h-4 w-full bg-navy-700 rounded mb-1" />
            <div className="h-4 w-2/3 bg-navy-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-navy-300">{t("home.news.none")}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group bg-navy-800 border border-white/10 rounded-xl p-6 lg:p-8 hover:border-navy-400 hover:-translate-y-1 transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold text-navy-200 uppercase tracking-[0.15em]">{post.date}</span>
            {post.category && (
              <>
                <span className="w-4 h-px bg-navy-600" />
                <span className="text-[10px] font-bold text-navy-300 uppercase tracking-wider">{post.category}</span>
              </>
            )}
          </div>
          <h3 className="text-base lg:text-lg font-bold text-white mb-2 leading-snug group-hover:text-navy-200 transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-navy-200 text-sm leading-relaxed mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] text-navy-300">
              <Calendar className="w-3 h-3" />{post.date}
            </span>
            <span className="text-xs font-semibold text-navy-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              {t("home.news.read")} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
