"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, FileText, Calendar, Clock, File, ExternalLink, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://client2.wecollections.us";

interface ResultItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string | null;
  type: "blog" | "document";
  fileUrl: string | null;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"articles" | "documents">("articles");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (q: string, type: "articles" | "documents") => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const apiType = type === "articles" ? "blog" : "document";
    try {
      const res = await fetch(`${API_URL}/api/posts?type=${apiType}&search=${encodeURIComponent(q)}&published=true`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(
          data.map((p: any) => ({
            ...p,
            image: p.image ? (p.image.startsWith("http") ? p.image : `${API_URL}${p.image}`) : null,
            fileUrl: p.fileUrl ? (p.fileUrl.startsWith("http") ? p.fileUrl : `${API_URL}${p.fileUrl}`) : null,
            type: p.type || apiType,
          }))
        );
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setQuery(q);
    if (q.trim()) {
      performSearch(q, activeTab);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim()) {
        const params = new URLSearchParams(window.location.search);
        params.set("q", val);
        window.history.replaceState(null, "", `/search?${params}`);
        performSearch(val, activeTab);
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams(window.location.search);
      params.set("q", query);
      window.history.replaceState(null, "", `/search?${params}`);
      performSearch(query, activeTab);
    }
  };

  const switchTab = (tab: "articles" | "documents") => {
    setActiveTab(tab);
    if (query.trim()) {
      performSearch(query, tab);
    }
  };

  const resultLink = (item: ResultItem) => {
    if (item.type === "document" && item.fileUrl) {
      return item.fileUrl;
    }
    if (item.type === "document") {
      return "#";
    }
    return `/blog/${item.slug}`;
  };

  const isExternal = (item: ResultItem) => item.type === "document" && !!item.fileUrl;

  return (
    <div className="pt-20">
      <section className="bg-navy-900 py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <p className="text-navy-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("search.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider mb-4">{t("search.title")}</h1>
          </div>
          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-300" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t("search.placeholder")}
              className="w-full pl-12 pr-4 py-4 text-base bg-navy-800 text-white border border-white/10 rounded-xl outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-700 transition-all"
            />
          </form>
        </div>
      </section>

      <section className="bg-navy-850 py-8 lg:py-12 min-h-[40vh]">
        <div className="max-w-[800px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 bg-navy-800 rounded-xl p-1 border border-white/10 mb-8">
            <button
              onClick={() => switchTab("articles")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "articles"
                  ? "bg-navy-600 text-white shadow-sm"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />{t("search.tabArticles")}
            </button>
            <button
              onClick={() => switchTab("documents")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "documents"
                  ? "bg-navy-600 text-white shadow-sm"
                  : "text-navy-300 hover:text-white"
              }`}
            >
              <File className="w-4 h-4" />{t("search.tabDocuments")}
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-navy-800 border border-white/10 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-navy-700 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-navy-700 rounded w-full mb-2" />
                  <div className="h-3 bg-navy-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : !searched ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-navy-500 mx-auto mb-4" />
              <p className="text-navy-400 text-sm">{t("search.prompt")}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-navy-500 mx-auto mb-4" />
              <p className="text-navy-300 font-medium mb-1">{t("search.noResults")}</p>
              <p className="text-navy-400 text-sm">{t("search.tryDifferent")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((item) => {
                const href = resultLink(item);
                const external = isExternal(item);
                const cardContent = (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center shrink-0">
                      {item.type === "document" ? (
                        <File className="w-5 h-5 text-amber-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-navy-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.type === "document"
                            ? "text-amber-600 bg-amber-50"
                            : "text-navy-200 bg-navy-700"
                        }`}>
                          {item.type === "document" ? t("search.pdf") : t("search.article")}
                        </span>
                        <span className="text-[10px] text-navy-400">{item.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-navy-200 transition-colors">{item.title}</h3>
                      <p className="text-xs text-navy-100 leading-relaxed line-clamp-2" dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-navy-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.readTime}</span>
                        {external && (
                          <span className="flex items-center gap-1 text-navy-200 font-medium">
                            <ExternalLink className="w-3 h-3" />{t("search.openPdf")}
                          </span>
                        )}
                        {item.type === "document" && !item.fileUrl && (
                          <span className="text-[10px] text-navy-400 italic">{t("search.noPdf")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
                if (href === "#") {
                  return (
                    <div key={item.id} className="block bg-navy-800 border border-white/10 rounded-xl p-6 hover:border-navy-400 transition-colors group">
                      {cardContent}
                    </div>
                  );
                }
                return (
                  <Link key={item.id} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="block bg-navy-800 border border-white/10 rounded-xl p-6 hover:border-navy-400 transition-colors group">
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
