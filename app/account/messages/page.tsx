"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface Conversation {
  id: number;
  with: string;
  email: string;
  customerEmail: string;
  lastMessage: string;
  date: string;
  unread: boolean;
  messages: { from: string; text: string; time: string }[];
}

const staffName = "AIMS Capital Support";
const staffNames = [staffName, "AIMS Capital"];

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AccountMessagesPage() {
  const { user } = useAuth();
  const [all, setAll] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true); // only true on very first load
  const [sending, setSending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitialLoad = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when conversation is selected or new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.id, selected?.messages?.length]);

  const load = async (): Promise<Conversation[]> => {
    if (isInitialLoad.current) setLoading(true);

    const res = await fetch(`https://api.aimscapital.org/api/messages?email=${encodeURIComponent(user?.email || "")}`);
    if (!res.ok) {
      if (isInitialLoad.current) { setLoading(false); isInitialLoad.current = false; }
      return [];
    }
    const data: Conversation[] = await res.json();

    const mine = data.filter((c) => c.customerEmail === user?.email);

    setAll(mine);
    setSelected((prev) => {
      if (!prev) return prev;
      const fresh = mine.find((c) => c.id === prev.id);
      return fresh ?? prev;
    });

    if (isInitialLoad.current) { setLoading(false); isInitialLoad.current = false; }

    return mine;
  };

  useEffect(() => {
    load();
    // Poll every second — skeleton won't re-appear since isInitialLoad flips to false after first fetch
    intervalRef.current = setInterval(load, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [user]);

  const handleSend = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const time = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const res = await fetch("https://api.aimscapital.org/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selected.id,
        from: user?.name,
        text: reply.trim(),
        time,
      }),
    });
    if (!res.ok) { setSending(false); return; }
    setReply("");
    const mine = await load();
    const updated = mine.find((c) => c.id === selected.id);
    if (updated) setSelected(updated);
    setSending(false);
  };

  const conversations = all;

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex">
      {/* Sidebar */}
      <div
        className={`w-full lg:w-80 border-r border-gray-100 bg-white flex flex-col ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-[#1a1a1a]">Messages</h2>
          <p className="text-[11px] text-gray-400">
            {conversations.filter((c) => c.unread).length} unread
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            // Skeleton only on first page load
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 hover:bg-sky-50 transition-colors ${
                  selected?.id === c.id ? "bg-sky-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      c.unread ? "bg-[#0F2B4A]" : "bg-sky-50"
                    }`}
                  >
                    <User className={`w-4 h-4 ${c.unread ? "text-white" : "text-sky-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm ${
                          c.unread ? "font-bold text-[#1a1a1a]" : "font-medium text-[#333333]"
                        }`}
                      >
                        {c.with}
                      </span>
                      <span className="text-[10px] text-gray-400">{c.date}</span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        c.unread ? "font-semibold text-[#1a1a1a]" : "text-gray-500"
                      }`}
                    >
                      {c.lastMessage.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                  {c.unread && (
                    <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-2" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className={`flex-1 flex flex-col bg-white ${selected ? "flex" : "hidden lg:flex"}`}>
        {selected ? (
          <>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden p-1 text-gray-400 hover:text-[#1a1a1a]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[#0F2B4A] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{selected.with.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a]">{selected.with}</h3>
                <p className="text-[10px] text-gray-400">{selected.email}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selected.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === (user?.name || "You") ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.from === (user?.name || "You")
                        ? "bg-[#0F2B4A] text-white rounded-tr-sm"
                        : "bg-gray-50 text-[#333333] rounded-tl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.from === (user?.name || "You") ? "text-white/50" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                />
                <button
                  onClick={handleSend}
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
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}