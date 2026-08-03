


 import { useState, useEffect } from "react";
import { Plus, Search, Eye, Pencil, Trash2, FileText, X, Check, Calendar, Clock } from "lucide-react";
import { getPosts, savePost, deletePost, getCategories, uploadCoverImage, uploadFile } from "../lib/store";
import type { BlogPost } from "../lib/types";
import RichTextEditor from "../components/RichTextEditor";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 80);
}

export default function Blogs({ onUpdate }: { onUpdate: () => void }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [editor, setEditor] = useState<{ post: BlogPost | null; open: boolean }>({ post: null, open: false });
  const [preview, setPreview] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const categories = getCategories();

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const addNew = () => {
    setEditor({
      post: {
        id: "",
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        category: categories[0]?.name || "Uncategorized",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        author: "Alloys Mutabingwa, FCIArb",
        readTime: "3 min read",
        image: null,
        published: false,
        type: "blog",
        fileUrl: null,
      },
      open: true,
    });
  };

  const handleSave = async (updated: BlogPost) => {
    await savePost(updated);
    await load();
    setEditor({ post: null, open: false });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    await load();
    onUpdate();
  };

  if (editor.open && editor.post !== null) {
    return <BlogEditor post={editor.post} categories={categories} onSave={handleSave} onCancel={() => setEditor({ post: null, open: false })} />;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Content</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Publications</h1>
        </div>
        <button onClick={addNew} className="px-4 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Publication</button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search publications..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-72" />
                </div>
                <Skeleton className="h-4 w-20 hidden md:block" />
                <Skeleton className="h-4 w-16 hidden sm:block" />
                <Skeleton className="h-6 w-16" />
                <div className="flex gap-1">
                  <Skeleton className="w-7 h-7 rounded-lg" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                  <Skeleton className="w-7 h-7 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center"><FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No publications found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-sky-600" /></div>
                        <div className="min-w-0"><p className="text-sm font-bold text-[#1a1a1a] truncate max-w-[300px]">{post.title}</p><p className="text-[11px] text-gray-400 truncate max-w-[300px]">{post.excerpt.replace(/<[^>]*>/g, '')}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${post.type === 'document' ? 'text-amber-600 bg-amber-50' : 'text-sky-600 bg-sky-50'}`}>{post.type === 'document' ? 'PDF' : 'Blog'}</span></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs text-gray-500">{post.category}</span></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-400">{post.date}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${post.published ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}>{post.published ? "Published" : "Draft"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setPreview(post)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditor({ post: { ...post }, open: true })} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={() => setPreview(null)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-[#1a1a1a]">Preview</h2>
              <button onClick={() => setPreview(null)} className="p-1 text-gray-400 hover:text-[#1a1a1a]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{preview.category}</span>
              <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-2">{preview.title}</h1>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-4"><span>{preview.author}</span><span>{preview.date}</span><span>{preview.readTime}</span></div>
              <div className="text-xs text-gray-500 italic mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: preview.excerpt }} />
              <style>{`
                .preview-content p { margin: 1em 0; }
                .preview-content h1 { margin: 0.67em 0; font-size: 1.5em; font-weight: bold; }
                .preview-content h2 { margin: 0.83em 0; font-size: 1.3em; font-weight: bold; }
                .preview-content h3 { margin: 1em 0; font-size: 1.15em; font-weight: bold; }
                .preview-content ul, .preview-content ol { margin: 1em 0; padding-left: 2em; }
                .preview-content ul { list-style: disc; }
                .preview-content ol { list-style: decimal; }
                .preview-content li { margin: 0.25em 0; }
                .preview-content blockquote { margin: 1em 0; padding-left: 1.5em; border-left: 4px solid #ccc; color: #555; font-style: italic; }
                .preview-content pre { margin: 1em 0; background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; }
                .preview-content img { display: block; margin: 1em auto; max-width: 100%; height: auto; }
              `}</style>
              <div className="preview-content text-sm" style={{ color: '#333', lineHeight: '1.75' }} dangerouslySetInnerHTML={{ __html: preview.content }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogEditor({
  post, categories, onSave, onCancel,
}: {
  post: BlogPost;
  categories: { id: string; name: string }[];
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BlogPost>(post);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const update = (fields: Partial<BlogPost>) => {
    const next = { ...form, ...fields };
    if (fields.title !== undefined && !post.id) {
      next.slug = generateSlug(fields.title);
    }
    setForm(next);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCoverImage(file);
      update({ image: url });
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploading(true);
    try {
      const url = await uploadFile(file);
      update({ fileUrl: url });
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const handleSaveClick = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(form);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const renderHtml = (html: string) => {
    return <div className="text-sm text-[#333333] leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 shrink-0 px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Content</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">{post.id ? "Edit" : "New"} Publication</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-sky-600 border border-gray-200 rounded-xl hover:border-sky-200 transition-all flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {showPreview ? "Editor" : "Preview"}</button>
          <button onClick={onCancel} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-200 transition-all">Cancel</button>
        </div>
      </div>

      {showPreview ? (
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{form.category || "Uncategorized"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight mt-2 mb-4">{form.title || "Untitled"}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-8 pb-8 border-b border-gray-100">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{form.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{form.readTime}</span>
              <span className="text-[#333333] font-medium">By {form.author}</span>
            </div>
            <div className="aspect-[16/9] rounded-sm overflow-hidden mb-10 bg-sky-50 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">Article Image</span>
              )}
            </div>
            {renderHtml(form.content)}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 p-5 lg:p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Title</label>
                <input value={form.title} onChange={(e) => update({ title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" placeholder="Publication title" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Cover Image</label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100" />
                  </div>
                  {form.image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
              </div>
              {form.type === "document" && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Document File (PDF)</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input type="file" accept=".pdf" onChange={handleFileUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                    </div>
                    {form.fileUrl && (
                      <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:underline shrink-0 mt-2">View File</a>
                    )}
                  </div>
                  {fileUploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Type</label>
                  <select value={form.type} onChange={(e) => update({ type: e.target.value as "blog" | "document" })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
                    <option value="blog">Blog</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">{categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Author</label>
                  <input value={form.author} onChange={(e) => update({ author: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Slug</label>
                <input value={form.slug} disabled className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-500 font-mono" placeholder="Auto-generated from title" title="Auto-generated from title" />
              </div>
              {form.type !== "document" && (
                <>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Excerpt</label>
                    <RichTextEditor
                      content={form.excerpt}
                      onChange={(html) => update({ excerpt: html })}
                      placeholder="Brief summary"
                      minHeight="80px"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Read Time</label>
                    <input value={form.readTime} onChange={(e) => update({ readTime: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" placeholder="e.g. 5 min read" />
                  </div>
                </>
              )}
              {form.type !== "document" && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Content</label>
                  <RichTextEditor
                    content={form.content}
                    onChange={(html) => update({ content: html })}
                    placeholder="Write your content here..."
                    maxHeight="500px"
                  />
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                  <span className="text-sm text-gray-500">Published</span>
                </label>
                <button onClick={handleSaveClick} disabled={saving} className="px-5 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5 disabled:opacity-50"><Check className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}</button>
              </div>
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {saveError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
