import { useState, useEffect } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Film, Music, X, Check } from "lucide-react";
import { getEvents, saveEvent, deleteEvent, getCategories, uploadCoverImage, uploadMedia } from "../lib/store";
import type { EventItem } from "../lib/types";
import RichTextEditor from "../components/RichTextEditor";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 80);
}

export default function Events({ onUpdate }: { onUpdate: () => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [editor, setEditor] = useState<{ event: EventItem | null; open: boolean }>({ event: null, open: false });
  const [preview, setPreview] = useState<EventItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const categories = getCategories();

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = events.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const addNew = () => {
    setEditor({
      event: {
        id: "",
        slug: "",
        title: "",
        excerpt: "",
        category: categories[0]?.name || "Uncategorized",
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        type: "video",
        mediaUrl: null,
        coverImage: null,
        published: false,
      },
      open: true,
    });
  };

  const handleSave = async (updated: EventItem) => {
    await saveEvent(updated);
    await load();
    setEditor({ event: null, open: false });
    onUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    await load();
    onUpdate();
  };

  if (editor.open && editor.event !== null) {
    return <EventEditor event={editor.event} categories={categories} onSave={handleSave} onCancel={() => setEditor({ event: null, open: false })} />;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Content</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Events</h1>
        </div>
        <button onClick={addNew} className="px-4 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Event</button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" />
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
          <div className="p-8 text-center"><Film className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">No events found</p></div>
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
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                          {event.type === "audio" ? <Music className="w-4 h-4 text-sky-600" /> : <Film className="w-4 h-4 text-sky-600" />}
                        </div>
                        <div className="min-w-0"><p className="text-sm font-bold text-[#1a1a1a] truncate max-w-[300px]">{event.title}</p><p className="text-[11px] text-gray-400 truncate max-w-[300px]">{event.excerpt.replace(/<[^>]*>/g, '')}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${event.type === 'audio' ? 'text-amber-600 bg-amber-50' : 'text-sky-600 bg-sky-50'}`}>{event.type === 'audio' ? 'Audio' : 'Video'}</span></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs text-gray-500">{event.category}</span></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-400">{event.date}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${event.published ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}>{event.published ? "Published" : "Draft"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setPreview(event)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditor({ event: { ...event }, open: true })} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(event.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-4"><span>{preview.date}</span></div>
              {preview.coverImage && (
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img src={preview.coverImage} alt={preview.title} className="w-full h-full object-cover" />
                </div>
              )}
              {preview.mediaUrl ? (
                preview.type === "audio" ? (
                  <audio controls src={preview.mediaUrl} className="w-full mb-4" />
                ) : (
                  <video controls src={preview.mediaUrl} className="w-full rounded-lg mb-4 bg-black" />
                )
              ) : (
                <p className="text-xs text-gray-400 italic mb-4">No media uploaded yet.</p>
              )}
              <div className="text-sm text-[#333333] leading-relaxed" dangerouslySetInnerHTML={{ __html: preview.excerpt }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EventEditor({
  event, categories, onSave, onCancel,
}: {
  event: EventItem;
  categories: { id: string; name: string }[];
  onSave: (event: EventItem) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EventItem>(event);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [justUploadedCover, setJustUploadedCover] = useState(false);
  const [justUploadedMedia, setJustUploadedMedia] = useState(false);

  const update = (fields: Partial<EventItem>) => {
    const next = { ...form, ...fields };
    if (fields.title !== undefined && !event.id) {
      next.slug = generateSlug(fields.title);
    }
    setForm(next);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setCoverProgress(0);
    setJustUploadedCover(false);
    setSaveError(null);
    try {
      const url = await uploadCoverImage(file, setCoverProgress);
      update({ coverImage: url });
      setJustUploadedCover(true);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaUploading(true);
    setMediaProgress(0);
    setJustUploadedMedia(false);
    setSaveError(null);
    try {
      const url = await uploadMedia(file, setMediaProgress);
      update({ mediaUrl: url });
      setJustUploadedMedia(true);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setMediaUploading(false);
    }
  };

  const handleSaveClick = async () => {
    if (!form.title.trim()) {
      setSaveError("Title is required.");
      return;
    }
    if (!form.mediaUrl) {
      setSaveError("Please upload an audio or video file.");
      return;
    }
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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 shrink-0 px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Content</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">{event.id ? "Edit" : "New"} Event</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-200 transition-all">Cancel</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 p-5 lg:p-6 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Title</label>
              <input value={form.title} onChange={(e) => update({ title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all" placeholder="Event title" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Type</label>
                <select value={form.type} onChange={(e) => update({ type: e.target.value as "audio" | "video", mediaUrl: null })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">{categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                {form.type === "audio" ? "Audio File" : "Video File"}
              </label>
              <input type="file" accept={form.type === "audio" ? "audio/*" : "video/*"} onChange={handleMediaUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100" />
              {mediaUploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{mediaProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 transition-all duration-150" style={{ width: `${mediaProgress}%` }} />
                  </div>
                </div>
              )}
              {justUploadedMedia && !mediaUploading && (
                <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Uploaded successfully</p>
              )}
              {form.mediaUrl && !mediaUploading && (
                form.type === "audio" ? (
                  <audio key={form.mediaUrl} controls autoPlay={justUploadedMedia} src={form.mediaUrl} className="w-full mt-3" />
                ) : (
                  <video key={form.mediaUrl} controls autoPlay={justUploadedMedia} muted={justUploadedMedia} src={form.mediaUrl} className="w-full max-h-64 rounded-lg mt-3 bg-black" />
                )
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Cover Image</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100" />
                </div>
                {form.coverImage && !coverUploading && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {coverUploading && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{coverProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 transition-all duration-150" style={{ width: `${coverProgress}%` }} />
                  </div>
                </div>
              )}
              {justUploadedCover && !coverUploading && (
                <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Uploaded successfully</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Slug</label>
              <input value={form.slug} disabled className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-500 font-mono" placeholder="Auto-generated from title" title="Auto-generated from title" />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
              <RichTextEditor
                content={form.excerpt}
                onChange={(html) => update({ excerpt: html })}
                placeholder="Brief description of this event"
                minHeight="120px"
              />
            </div>

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
    </div>
  );
}
