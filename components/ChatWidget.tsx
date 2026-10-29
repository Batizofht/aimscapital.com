"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/AuthContext";

const API_URL = "https://api.aimscapital.org";
const WHATSAPP = "https://wa.me/250788309268";

type Tab = "support" | "meet";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    setTimeout(() => ctx.close(), 600);
  } catch {
    // Web Audio not supported — silently skip
  }
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside pl-5 space-y-1 my-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list item
    if (/^[-*•]\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*•]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-outside pl-5 space-y-1 my-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{formatInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Heading (## or #)
    if (/^#{1,3}\s/.test(trimmed)) {
      const text = trimmed.replace(/^#{1,3}\s/, "");
      elements.push(
        <p key={`h-${i}`} className="font-semibold text-white mt-2 mb-0.5">{formatInline(text)}</p>
      );
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed">{formatInline(trimmed)}</p>
    );
    i++;
  }

  return elements;
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export default function ChatWidget() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const SUGGESTIONS = [t("chat.s1"), t("chat.s2"), t("chat.s3")];
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("support");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: t("chat.greeting") }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open, tab]);

  // Play sound when a new assistant message arrives
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        playNotificationSound();
      }
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setInput("");
      setSending(true);

      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next.slice(1) }),
        });
        const data = await res.json().catch(() => null);
        const reply = data?.reply || t("chat.errorReply");
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: t("chat.connError") }]);
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [messages, sending, t]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating message-icon button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg items-center justify-center transition-all hover:scale-110 ${open ? "hidden sm:flex" : "flex"}`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[60] sm:w-96 sm:max-w-md sm:h-[600px] sm:max-h-[calc(100vh-7rem)] bg-navy-900 sm:rounded-2xl sm:shadow-2xl sm:border sm:border-white/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-800 to-sky-600 px-5 py-4 shrink-0 flex items-center justify-between gap-3" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{t("chat.headerTitle")}</h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  {t("chat.online")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors shrink-0"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 shrink-0">
            <button
              onClick={() => setTab("support")}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === "support" ? "text-white border-b-2 border-navy-300" : "text-white/70 hover:text-white"}`}
            >
              {t("chat.tabSupport")}
            </button>
            <button
              onClick={() => setTab("meet")}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === "meet" ? "text-white border-b-2 border-navy-300" : "text-white/70 hover:text-white"}`}
            >
              {t("chat.tabMeet")}
            </button>
          </div>

          {/* Support Tab */}
          {tab === "support" && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-navy-950">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-sky-600 text-white rounded-br-md leading-relaxed"
                          : "bg-navy-800 text-white border border-white/10 rounded-bl-md"
                      }`}
                    >
                      {m.role === "user" ? (
                        <span className="leading-relaxed whitespace-pre-wrap">{m.content}</span>
                      ) : (
                        <div className="space-y-1.5 text-sm">
                          {renderMarkdown(m.content)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-navy-800 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-navy-300 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && !sending && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-[11px] font-medium text-white/80 bg-navy-800 border border-white/15 rounded-full px-3 py-1.5 hover:bg-navy-700 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 shrink-0 bg-navy-900" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    rows={1}
                    placeholder={t("chat.inputPlaceholder")}
                    className="flex-1 resize-none max-h-24 px-3.5 py-2.5 text-sm text-white placeholder-navy-300 bg-navy-800 border border-white/15 rounded-xl outline-none focus:border-navy-300 focus:ring-2 focus:ring-navy-700 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="w-10 h-10 shrink-0 rounded-xl bg-sky-600 text-white flex items-center justify-center hover:bg-sky-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Send"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-white/60 text-center mt-2">{t("chat.disclaimer")}</p>
              </form>
            </>
          )}

          {/* Meet Us Tab */}
          {tab === "meet" && (
            <div className="flex-1 overflow-y-auto p-5 bg-navy-950">
              <p className="text-xs text-white/70 mb-4">{t("chat.meetIntro")}</p>
              <div className="space-y-3">
                {!user && (
                  <Link
                    href="/membership"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-white/10 bg-navy-800 hover:border-navy-400 hover:bg-navy-700 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center shrink-0 group-hover:bg-navy-600 transition-colors">
                      <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-bold text-white block group-hover:text-white/80 transition-colors">{t("chat.registerTitle")}</span>
                      <span className="text-xs text-white/70">{t("chat.registerDesc")}</span>
                    </div>
                    <svg className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                )}

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-white/10 bg-navy-800 hover:border-navy-400 hover:bg-navy-700 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center shrink-0 group-hover:bg-navy-600 transition-colors">
                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold text-white block group-hover:text-white/80 transition-colors">{t("chat.contactTitle")}</span>
                    <span className="text-xs text-white/70">{t("chat.contactDesc")}</span>
                  </div>
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>

                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-white/10 bg-navy-800 hover:border-green-400/50 hover:bg-navy-700 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center shrink-0 group-hover:bg-navy-600 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-bold text-white block group-hover:text-green-400 transition-colors">{t("chat.whatsappTitle")}</span>
                    <span className="text-xs text-white/70">{t("chat.whatsappDesc")}</span>
                  </div>
                  <svg className="w-4 h-4 text-white/60 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-[11px] text-white/70 leading-relaxed">
                  <span className="font-semibold text-white/80">{t("chat.officeLabel")}</span> KG 5 Ave, Kacyiru, Gasabo District, Kigali, Rwanda
                  <br />
                  <span className="font-semibold text-white/80">{t("chat.phoneLabel")}</span> +250 788 309 268
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
