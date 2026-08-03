import { useState, useEffect } from "react";
import { Briefcase, Search, Check, X, Send, MessageSquare } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";
import { getServiceRequests, updateServiceRequest, navigateToMessage, type ServiceRequest } from "../lib/store";
import { toast } from "sonner";

const API = "https://client2.wecollections.us/api";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AdminServiceRequests({ onUpdate, onNavigate }: { onUpdate: () => void; onNavigate?: (page: string, email?: string) => void }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<{ id: string; action: "approved" | "rejected" } | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getServiceRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const confirmAction = async () => {
    if (!actionTarget) return;
    setSending(true);
    try {
      const r = requests.find((x) => x.id === actionTarget.id);
      await updateServiceRequest(actionTarget.id, { status: actionTarget.action } as Partial<ServiceRequest>);
      if (actionNote && r) {
        // Best-effort notification — don't fail the whole action if the client isn't a messageable member.
        await fetch(`${API}/messages/notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: r.clientEmail,
            customerName: r.clientName,
            subject: `Service Request ${actionTarget.action === "approved" ? "Approved" : "Rejected"}`,
            text: actionNote,
          }),
        }).catch(() => {});
      }
      const action = actionTarget.action;
      setActionTarget(null);
      setActionNote("");
      await load();
      onUpdate();
      toast.success(`Service request ${action}`);
    } catch {
      toast.error("Failed to update service request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const filtered = requests.filter((r) => {
    const matchSearch = !search || r.service.toLowerCase().includes(search.toLowerCase()) || r.clientName.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "Total", value: requests.length },
    { label: "Pending", value: requests.filter((r) => r.status === "pending").length },
    { label: "Approved", value: requests.filter((r) => r.status === "approved").length },
    { label: "Rejected", value: requests.filter((r) => r.status === "rejected").length },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Management</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Service Requests</h1>
      </div>

      <div className="grid grid-cols-4 gap-3 lg:gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-lg lg:text-xl font-bold text-[#0F2B4A]">{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search requests..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {loading ? (
          <div className="p-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <Skeleton className="w-8 h-8 shrink-0" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-28 hidden md:block" />
                <Skeleton className="h-4 w-20 hidden sm:block" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-14 hidden lg:table-cell" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No service requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Client</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Priority</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0"><Briefcase className="w-4 h-4 text-sky-600" /></div>
                        <p className="text-sm font-bold text-[#1a1a1a]">{r.service}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div><p className="text-xs font-semibold text-[#333]">{r.clientName}</p><p className="text-[10px] text-gray-400">{r.clientEmail}</p></div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-500">{r.category}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                        r.status === "approved" ? "text-green-600 bg-green-50" :
                        r.status === "rejected" ? "text-red-400 bg-red-50" : "text-amber-600 bg-amber-50"
                      }`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {r.priority === "urgent" ? <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Urgent</span> : <span className="text-[10px] text-gray-400">Normal</span>}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-400">{r.date}</span></td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        <button onClick={() => navigateToMessage(r.clientEmail, r.clientName, onNavigate)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all"><MessageSquare className="w-3 h-3" />Message</button>
                        {r.status === "pending" && (
                          <>
                            <button onClick={() => setActionTarget({ id: r.id, action: "approved" })} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all"><Check className="w-3 h-3" />Approve</button>
                            <button onClick={() => setActionTarget({ id: r.id, action: "rejected" })} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-all"><X className="w-3 h-3" />Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {actionTarget && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => { if (!sending) { setActionTarget(null); setActionNote(""); } }}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actionTarget.action === "approved" ? "bg-green-50" : "bg-red-50"}`}>
                {actionTarget.action === "approved" ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1a1a1a]">{actionTarget.action === "approved" ? "Approve" : "Reject"} Service Request</h2>
                <p className="text-[11px] text-gray-400">Add a note to send as an in-app message</p>
              </div>
            </div>
            <RichTextEditor
              content={actionNote}
              onChange={(html) => setActionNote(html)}
              placeholder={`Explain why this request is being ${actionTarget.action}...`}
              minHeight="200px"
            />
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => { setActionTarget(null); setActionNote(""); }} disabled={sending} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={confirmAction} disabled={sending}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all flex items-center gap-1.5 ${actionTarget.action === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} disabled:opacity-30`}>
                <Send className="w-3 h-3" /> {sending ? "Processing..." : `${actionTarget.action === "approved" ? "Approve" : "Reject"} & Send Message`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}