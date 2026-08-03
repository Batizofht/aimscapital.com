import React, { useState, useEffect } from "react";
import { Calendar, Video, Phone, Monitor, Building, Search, Mail, Send, Eye } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";
import { toast } from "sonner";

const API = "https://client2.wecollections.us/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-amber-50 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-sky-50 text-sky-600 border-sky-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-400 border-red-200" },
};

const platformIcons: Record<string, any> = {
  Zoom: Video, "Google Meet": Monitor, "Microsoft Teams": Monitor, "In-Person": Building, "Phone Call": Phone,
};

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  platform: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
}

export default function AdminConsultations({ onUpdate }: { onUpdate: () => void }) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API}/consultations`);
    const data = await res.json();
    setConsultations(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleReply = async () => {
    if (!selected || !replyText) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/consultations/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, message: replyText }),
      });
      const data = await res.json().catch(() => ({ error: "Unexpected server response" }));
      if (!res.ok || data.error) { toast.error(data.error || "Failed to send reply"); return; }
      toast.success("Reply sent to " + selected.email);
      setReplyText("");
      await load();
      onUpdate();
    } catch {
      toast.error("Cannot reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const filtered = consultations.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const pending = consultations.filter((c) => c.status === "pending").length;

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Inbox</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Consultation Bookings</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-lg lg:text-xl font-bold text-[#0F2B4A]">{consultations.length}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-lg lg:text-xl font-bold text-amber-600">{pending}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Pending Reply</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No bookings</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {filtered.map((c) => {
                const Icon = platformIcons[c.platform] || Video;
                const st = statusStyles[c.status];
                return (
                  <button key={c.id} onClick={() => { setSelected(c); setReplyText(""); }}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selected?.id === c.id ? "bg-sky-50" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.status === "pending" ? "bg-amber-50" : "bg-sky-50"}`}>
                        <Icon className={`w-4 h-4 ${c.status === "pending" ? "text-amber-600" : "text-sky-600"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-bold text-[#1a1a1a]">{c.name}</span>
                          <span className="text-[10px] text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                        <p className="text-[11px] text-gray-500">{c.email}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          <span>{c.date}</span>
                          <span>·</span>
                          <span>{c.time}</span>
                          <span>·</span>
                          <span>{c.platform}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border shrink-0 ${st.className}`}>{st.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {selected ? (
            <div>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected.status === "pending" ? "bg-amber-50" : "bg-sky-50"}`}>
                  {React.createElement(platformIcons[selected.platform] || Video, { className: `w-5 h-5 ${selected.status === "pending" ? "text-amber-600" : "text-sky-600"}` })}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">{selected.name}</p>
                  <p className="text-[11px] text-gray-400">{selected.email}</p>
                  {selected.phone && <p className="text-[11px] text-gray-400">{selected.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">Date</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{selected.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">Time</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{selected.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] text-gray-400">Platform</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{selected.platform}</p>
                </div>
              </div>

              {selected.adminReply && (
                <div className="bg-sky-50 rounded-xl p-4 mb-4">
                  <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-2 flex items-center justify-between">Sent Reply <button onClick={() => setReplyText(selected.adminReply || "")} className="text-[10px] font-bold text-sky-600 hover:underline">Edit & Resend</button></p>
                  <div className="text-xs text-[#333]" dangerouslySetInnerHTML={{ __html: selected.adminReply }} />
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-[#1a1a1a] mb-2 flex items-center gap-1.5"><Send className="w-3.5 h-3.5 text-sky-600" /> Reply with requirements</p>
                <RichTextEditor
                  content={replyText}
                  onChange={(html) => setReplyText(html)}
                  placeholder="Include meeting link, payment details, documents needed, etc..."
                  minHeight="200px"
                />
                <button onClick={handleReply} disabled={!replyText || sending}
                  className="w-full py-3 text-xs font-semibold text-white bg-[#0F2B4A] rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {sending ? "Sending..." : "Send Reply & Confirm"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-4 border-t border-gray-100">
                <Eye className="w-3 h-3" />
                {selected.status}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <Mail className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select a booking to reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}