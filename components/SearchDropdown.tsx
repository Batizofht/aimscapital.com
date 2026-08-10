"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, FileText, File, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://client2.wecollections.us";

interface Suggestion {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  type: "blog" | "document";
  fileUrl: string | null;
}

export default function SearchDropdown() {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts?search=${encodeURIComponent(q)}&published=true`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(
          data.slice(0, 5).map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            type: p.type || "blog",
            fileUrl: p.fileUrl ? (p.fileUrl.startsWith("http") ? p.fileUrl : `${API_URL}${p.fileUrl}`) : null,
          }))
        );
      }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const resultLink = (item: Suggestion) => {
    if (item.type === "document" && item.fileUrl) return item.fileUrl;
    if (item.type === "document") return "#";
    return `/blog/${item.slug}`;
  };

  const isExternal = (item: Suggestion) => item.type === "document" && !!item.fileUrl;
  const isClickable = (item: Suggestion) => item.type !== "document" || !!item.fileUrl;

  const handleSuggestionClick = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => query.trim() && setOpen(true)}
            placeholder={t("search.shortPlaceholder")}
            className="w-40 lg:w-48 pl-9 pr-3 py-1.5 text-sm bg-white/15 text-white placeholder-white/50 rounded-lg border border-white/20 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
          />
        </div>
      </form>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-navy-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 text-white/80 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              {suggestions.map((item) => {
                const href = resultLink(item);
                const external = isExternal(item);
                const clickable = isClickable(item);
                const cardContent = (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                      {item.type === "document" ? (
                        <File className="w-4 h-4 text-amber-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-white/80" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-white/70 truncate" dangerouslySetInnerHTML={{ __html: item.excerpt || (item.type === "document" ? t("search.pdfDocument") : t("search.article")) }} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                      item.type === "document" ? "text-amber-400 bg-amber-500/10" : "text-white/80 bg-navy-700"
                    }`}>
                      {item.type === "document" ? t("search.pdf") : t("search.article")}
                    </span>
                  </>
                );
                if (!clickable) {
                  return (
                    <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
                      {cardContent}
                    </div>
                  );
                }
                return (
                  <Link key={item.id} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} onClick={handleSuggestionClick} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/10 last:border-0">
                    {cardContent}
                  </Link>
                );
              })}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleSuggestionClick}
                className="block px-4 py-3 text-center text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors border-t border-white/10"
              >
                {t("search.viewAll")} &rarr;
              </Link>
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-white/70">{t("search.noResultsFor")} &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-white/70">{t("search.startTyping")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
