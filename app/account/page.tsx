"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Calendar, Briefcase, MessageSquare, ChevronRight, Clock } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AccountDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [aptCount, setAptCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/membership"); return; }
    Promise.all([
      fetch("https://client2.wecollections.us/api/appointments").then(async (r) => { if (!r.ok) return []; return r.json(); }),
      fetch("https://client2.wecollections.us/api/messages").then(async (r) => { if (!r.ok) return []; return r.json(); }),
    ]).then(([appts, msgs]) => {
      const mine = appts.filter((a: any) => a.clientEmail === user.email);
      setAptCount(mine.filter((a: any) => a.status === "pending" || a.status === "confirmed").length);
      setUpcoming(mine.filter((a: any) => a.status !== "completed" && a.status !== "cancelled").slice(0, 3));
      const msgMine = msgs.filter((c: any) => c.customerEmail === user.email);
      setMsgCount(msgMine.filter((c: any) => c.unread).length);
      setRecent(msgMine.slice(0, 3));
      setLoading(false);
    });
  }, [user, router]);

  if (!user) return null;

  const stats = [
    { label: "Services", value: "5", href: "/account/services" },
    { label: "Appointments", value: String(aptCount), href: "/account/appointments" },
    { label: "Messages", value: String(msgCount), href: "/account/messages" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Welcome back</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">{user.name}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 hover:border-sky-200 transition-all group">
            {loading ? (
              <div><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-3 w-20" /></div>
            ) : (
              <><p className="text-2xl lg:text-3xl font-bold text-[#0F2B4A]">{s.value}</p><p className="text-[11px] text-gray-400 mt-1">{s.label}</p></>
            )}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Upcoming</h2>
            <Link href="/account/appointments" className="text-[10px] text-sky-600 font-semibold hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map((i) => <div key={i} className="flex items-start gap-3"><Skeleton className="w-9 h-9 shrink-0" /><div className="flex-1"><Skeleton className="h-4 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></div></div>)}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt: any, i: number) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-sky-600" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1a1a1a]">{apt.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 inline-block ${apt.status === "confirmed" ? "text-sky-600" : "text-amber-500"}`}>{apt.status === "confirmed" ? "Confirmed" : "Pending"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Recent Messages</h2>
            <Link href="/account/messages" className="text-[10px] text-sky-600 font-semibold hover:underline flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map((i) => <div key={i} className="flex items-start gap-3"><Skeleton className="w-9 h-9 rounded-full shrink-0" /><div className="flex-1"><Skeleton className="h-4 w-2/3 mb-2" /><Skeleton className="h-3 w-full" /></div></div>)}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No messages</p>
          ) : (
            <div className="space-y-3">
              {recent.map((c: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${c.unread ? "bg-[#0F2B4A]" : "bg-sky-50"}`}>
                    <span className={`text-xs font-bold ${c.unread ? "text-white" : "text-sky-600"}`}>{c.with.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1a1a1a]">{c.with}</p>
                    <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">{c.date}</span>
                      {c.unread && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/account/appointments" className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">
          <Calendar className="w-3.5 h-3.5" /> Request Appointment
        </Link>
      </div>
    </div>
  );
}