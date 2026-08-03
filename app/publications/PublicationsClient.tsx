"use client";

import { useState, useEffect } from "react";
import { File, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = "https://client2.wecollections.us";
const PER_PAGE = 10;

interface Document {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  fileUrl: string | null;
  category: string;
}

export default function PublicationsClient() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/posts?type=document`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDocs(
            data.map((p: any) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt,
              date: p.date,
              fileUrl: p.fileUrl ? (p.fileUrl.startsWith("http") ? p.fileUrl : `${API_URL}${p.fileUrl}`) : null,
              category: p.category,
            }))
          );
        }
      })
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(docs.map((d) => d.category).filter(Boolean)))];

  const filteredDocs = activeCategory === "All" ? docs : docs.filter((d) => d.category === activeCategory);

  const totalPages = Math.ceil(filteredDocs.length / PER_PAGE);
  const paginated = filteredDocs.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const groupedByYear: Record<string, Document[]> = {};
  paginated.forEach((d) => {
    const year = d.date ? d.date.split(/[, ]/).pop() || "Unknown" : "Unknown";
    if (!groupedByYear[year]) groupedByYear[year] = [];
    groupedByYear[year].push(d);
  });
  const years = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="pt-20">
      <section className="bg-navy-900 py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto px-4 md:px-6">
          <div className="mb-3">
            <p className="text-navy-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">{t("publications.eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider">{t("publications.title")}</h1>
          </div>
          <p className="text-navy-300 text-sm sm:text-base">
            {t("publications.subhead")}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      {!loading && categories.length > 1 && (
        <div className="bg-navy-850 border-b border-white/10 sticky top-[4.5rem] z-30">
          <div className="max-w-[800px] mx-auto px-4 md:px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-navy-600 text-white shadow-sm"
                      : "bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white"
                  }`}
                >
                  {cat === "All" ? t("publications.allCategories") || "All" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="bg-navy-900 py-16 lg:py-20 min-h-[50vh]">
        <div className="max-w-[700px] mx-auto px-4 md:px-6">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-5 bg-navy-700 rounded w-24 mb-4" />
                  <div className="space-y-3">
                    <div className="h-16 bg-navy-800 rounded-xl border border-white/10 p-4">
                      <div className="h-3 bg-navy-700 rounded w-3/4 mb-2" />
                      <div className="h-2 bg-navy-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <File className="w-12 h-12 text-navy-500 mx-auto mb-4" />
              <p className="text-navy-400 text-sm">{t("publications.none")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-10">
                {years.map((year) => (
                  <div key={year}>
                    <h2 className="text-lg font-bold text-white mb-4">{year}</h2>
                    <div className="space-y-2">
                      {groupedByYear[year].map((doc) => {
                        const href = doc.fileUrl || "#";
                        return (
                          <a
                            key={doc.id}
                            href={href}
                            target={doc.fileUrl ? "_blank" : undefined}
                            rel={doc.fileUrl ? "noopener noreferrer" : undefined}
                            className="block bg-navy-800 border border-white/10 rounded-xl p-5 hover:border-navy-400 transition-colors group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                <File className="w-4 h-4 text-amber-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-white group-hover:text-navy-200 transition-colors">{doc.title}</h3>
                                {doc.excerpt && (
                                  <p className="text-xs text-navy-300 mt-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: doc.excerpt }} />
                                )}
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-navy-400">
                                  <span>{doc.date}</span>
                                  <span className="text-[10px] uppercase tracking-wider text-navy-400">|</span>
                                  <span className="text-xs text-navy-400">{doc.category}</span>
                                  {doc.fileUrl && (
                                    <span className="flex items-center gap-1 text-navy-200 font-medium ml-auto">
                                      <ExternalLink className="w-3 h-3" />{t("publications.openPdf")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-navy-100 border border-white/15 rounded-lg hover:bg-navy-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t("publications.previous")}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm font-bold rounded-lg transition-all ${
                        p === page
                          ? "bg-navy-600 text-white shadow-sm"
                          : "text-navy-100 hover:bg-navy-800 border border-white/15"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-navy-100 border border-white/15 rounded-lg hover:bg-navy-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("publications.next")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
