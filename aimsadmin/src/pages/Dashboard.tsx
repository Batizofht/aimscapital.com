import { useState, useEffect } from "react";
import { FileText, FolderOpen, Eye, Calendar, MessageSquare, Users, ClipboardList } from "lucide-react";
import { getPosts, getCategories, getAppointments, getMessages, getMembers, getServiceRequests } from "../lib/store";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function Dashboard({ role }: { role?: string }) {
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof getPosts>>>([]);
  const [cats] = useState(getCategories());
  const [apts, setApts] = useState(0);
  const [msgs, setMsgs] = useState(0);
  const [members, setMembers] = useState(0);
  const [serviceReqs, setServiceReqs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPosts().then(setPosts),
      getAppointments().then((d) => setApts(d.length)),
      getMessages().then((d) => setMsgs(d.filter((m: any) => m.unread).length)),
      getMembers().then((d) => setMembers(d.length)),
      getServiceRequests().then((d) => setServiceReqs(d.filter((r: any) => r.status === "pending").length)),
    ]).finally(() => setLoading(false));
  }, []);

  const published = posts.filter((p) => p.published).length;
  const r = role?.toLowerCase();

  const allStats = [
    { label: "Total Publications", value: posts.length, icon: FileText, color: "text-sky-600 bg-sky-50" },
    { label: "Published", value: published, icon: Eye, color: "text-green-600 bg-green-50" },
    { label: "Categories", value: cats.length, icon: FolderOpen, color: "text-amber-600 bg-amber-50" },
    { label: "Appointments", value: apts, icon: Calendar, color: "text-purple-600 bg-purple-50" },
    { label: "Unread Messages", value: msgs, icon: MessageSquare, color: "text-red-500 bg-red-50" },
    { label: "Members", value: members, icon: Users, color: "text-sky-600 bg-sky-50" },
    { label: "Pending Requests", value: serviceReqs, icon: ClipboardList, color: "text-amber-600 bg-amber-50" },
  ];

  const stats = r === "editor" ? allStats.slice(0, 3) : allStats;

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Admin</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-8">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
              <Skeleton className="w-9 h-9 rounded-lg mb-3" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl lg:text-3xl font-bold text-[#0F2B4A]">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-5 lg:p-6">
        <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">Recent Publications</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No publications yet</p>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-sky-600" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1a1a1a]">{post.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${post.published ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}>{post.published ? "Published" : "Draft"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
