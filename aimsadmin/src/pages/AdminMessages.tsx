import { useState, useEffect, useRef } from "react";
import { MessageSquare, Search, Send, Mail, Loader } from "lucide-react";
import { getMessages, replyToConversation } from "../lib/store";
import type { Message } from "../lib/types";
import { toast } from "sonner";

const staffName = "AIMS Capital Support";
const staffNames = [staffName, "AIMS Capital"];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AdminMessages({ onUpdate, defaultEmail }: { onUpdate: () => void; defaultEmail?: string }) {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const isInitialLoad = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<string | null>(null);

  // Keep selectedIdRef in sync with selected
  useEffect(() => { selectedIdRef.current = selected?.id ?? null; }, [selected?.id]);

  // Auto-scroll to bottom when conversation is selected or new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.id, selected?.messages?.length]);

  const load = async (): Promise<Message[]> => {
    if (isInitialLoad.current) {
      setLoading(true);
    }

    const data = await getMessages();
    setConversations(data);

    if (isInitialLoad.current) {
      setLoading(false);
      isInitialLoad.current = false;
    }

    // Restore selected conversation by ref — survives race conditions with polling
    if (selectedIdRef.current) {
      const match = data.find((c) => c.id === selectedIdRef.current);
      if (match) setSelected(match);
    }

    return data;
  };

  useEffect(() => {
    load();
    // Poll every second — no flicker since skeleton only shows on isInitialLoad
    intervalRef.current = setInterval(load, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (defaultEmail && conversations.length > 0 && !selected) {
      const match = conversations.find((c) => c.customerEmail === defaultEmail);
      if (match) setSelected(match);
    }
  }, [defaultEmail, conversations]);

  const filtered = conversations.filter(
    (c) =>
      c.with.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    try {
      await replyToConversation(selected.id, staffName, reply.trim());
      setReply("");
      await load();
    } catch {
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const unreadCount = conversations.filter((c) => c.unread).length;

  return (
    <div className="p-4 md:p-8 h-screen flex flex-col">
      <div className="mb-6 shrink-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Communication</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">
          Messages{" "}
          {unreadCount > 0 && (
            <span className="text-xs font-normal text-gray-400">({unreadCount} unread)</span>
          )}
        </h1>
      </div>

      <div className="flex-1 flex gap-0 min-h-0 bg-white rounded-xl border border-gray-100">
        {/* Sidebar */}
        <div className={`${selected ? "hidden lg:block" : "block"} w-full lg:w-80 border-r border-gray-100 flex flex-col shrink-0 lg:max-w-[320px]`}>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              // Skeleton shown only on initial page load
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No conversations</p>
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selected?.id === conv.id ? "bg-sky-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        conv.unread ? "bg-[#0F2B4A]" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${conv.unread ? "text-white" : "text-gray-500"}`}
                      >
                        {conv.with.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs truncate ${
                            conv.unread ? "font-bold text-[#1a1a1a]" : "text-gray-600"
                          }`}
                        >
                          {conv.with}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">{conv.date}</span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          conv.unread ? "font-semibold text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {conv.lastMessage.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#0F2B4A] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{selected.with.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1a1a1a]">{selected.with}</p>
                  <p className="text-[10px] text-gray-400">{selected.email}</p>
                </div>
                <a
                  href={`mailto:${selected.email}`}
                  className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {!selected.messages || selected.messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400">No messages yet</p>
                  </div>
                ) : (
                  selected.messages.map((msg, i) => {
                    const isStaff = staffNames.includes(msg.from);
                    const text = msg.text;
                    const subjectMatch = text.match(/^📌\s+(.+?)\n\n/s);
                    const body = subjectMatch ? text.slice(subjectMatch[0].length) : text;
                    const subject = subjectMatch ? subjectMatch[1] : null;
                    return (
                      <div key={i} className={`flex ${isStaff ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] ${isStaff ? "items-end" : "items-start"} flex flex-col`}
                        >
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isStaff
                                ? "bg-[#0F2B4A] text-white rounded-br-md"
                                : "bg-gray-100 text-gray-800 rounded-bl-md"
                            }`}
                          >
                            {subject && <p className="font-semibold mb-1 opacity-90">{subject}</p>}
                            <div dangerouslySetInnerHTML={{ __html: body || text }} />
                          </div>
                          <p
                            className={`text-[10px] text-gray-400 mt-1 ${
                              isStaff ? "text-right" : "text-left"
                            }`}
                          >
                            <span className="font-medium">{isStaff ? "You" : selected.with}</span>{" "}
                            · {msg.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-5 py-3.5 border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendReply())
                    }
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!reply.trim() || sending}
                    className="px-4 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {sending ? (
                      <Loader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}{" "}
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}