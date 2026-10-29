import { useState, useEffect } from "react";
import { MessageSquare, Search, Mail, Send, Eye } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";
import { useAuth } from "../AuthContext";
import { getContactMessages } from "../lib/store";
import { toast } from "sonner";

const API = "https://api.aimscapital.org/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AdminContactMessages({ onUpdate }: { onUpdate: () => void }) {
  const { admin } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!admin) return;
    setLoading(true);
    const data = await getContactMessages(admin.id);
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleReply = async () => {
    if (!selected || !replyText) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/contact/reply`, {
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

  const filtered = messages.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const unread = messages.filter((m) => !m.isRead).length;

  const stats = [
    { label: "Total Messages", value: messages.length },
    { label: "Unread", value: unread },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Inbox</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Contact Messages</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-lg lg:text-xl font-bold text-[#0F2B4A]">{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No messages</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelected(m); setReplyText(""); }}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selected?.id === m.id ? "bg-sky-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${!m.isRead ? "bg-[#0F2B4A]" : "bg-gray-100"}`}>
                      <Mail className={`w-4 h-4 ${!m.isRead ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-sm ${!m.isRead ? "font-bold text-[#1a1a1a]" : "text-[#333333]"}`}>{m.name}</span>
                        <span className="text-[10px] text-gray-400">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                      <p className="text-[11px] text-sky-600 font-medium mb-0.5">{m.subject}</p>
                      <p className={`text-xs truncate ${!m.isRead ? "font-medium text-[#1a1a1a]" : "text-gray-500"}`}>{m.body}</p>
                    </div>
                    {!m.isRead && <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-2" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {selected ? (
            <div>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0F2B4A] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{selected.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">{selected.name}</p>
                  <p className="text-[11px] text-gray-400">{selected.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-1 rounded-lg">{selected.subject}</span>
                <span className="text-[10px] text-gray-400 ml-2">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}</span>
              </div>
              <div className="text-sm text-[#333333] leading-relaxed whitespace-pre-wrap mb-4">
                {selected.body}
              </div>

              {selected.replied && (
                <div className="bg-green-50 rounded-xl p-3 mb-4 text-xs text-green-700 flex items-center gap-2">
                  <span>✓ Reply already sent</span>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-[#1a1a1a] mb-2 flex items-center gap-1.5"><Send className="w-3.5 h-3.5 text-sky-600" /> Send Reply</p>
                <RichTextEditor
                  content={replyText}
                  onChange={(html) => setReplyText(html)}
                  placeholder="Type your response..."
                  minHeight="200px"
                />
                <button onClick={handleReply} disabled={!replyText || sending}
                  className="w-full py-3 text-xs font-semibold text-white bg-[#0F2B4A] rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {sending ? "Sending..." : "Send Reply (Email + In-App)"}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] text-gray-400">
                <Eye className="w-3 h-3" />
                {selected.isRead ? "Read" : "Unread"}
                {selected.replied && <span className="ml-2 text-green-600 font-medium">Replied</span>}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select a message to reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}