"use client";

import { useState, useEffect } from "react";
import { Check, Briefcase, Plus, Loader, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const serviceData = [
  { category: "Corporate Law", items: ["Alternative investment markets advisory", "Insolvency and restructuring", "Contract management"] },
  { category: "Projects", items: ["Advice", "Management", "Financing"] },
  { category: "Litigation", items: ["Commercial litigation", "Alternative dispute settlement"] },
  { category: "Consulting", items: ["Legal advisory", "Transaction advisory"] },
  { category: "Infrastructure", items: ["Utility agency services", "Technology agency services"] },
];

interface Sr {
  id: string;
  clientName: string;
  clientEmail: string;
  category: string;
  service: string;
  status: "pending" | "approved" | "rejected";
  priority: "normal" | "urgent";
  date: string;
  notes: string;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function ServicesPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Sr[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{ category: string; service: string; notes: string; priority: "normal" | "urgent" }>({ category: "", service: "", notes: "", priority: "normal" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`https://client2.wecollections.us/api/service-requests?email=${encodeURIComponent(user.email)}`);
    if (!res.ok) { setLoading(false); return; }
    setRequests(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!form.category || !form.service || !user) return;
    setSubmitting(true);
    const res = await fetch("https://client2.wecollections.us/api/service-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: user.name,
        clientEmail: user.email,
        category: form.category,
        service: form.service,
        notes: form.notes,
        priority: form.priority,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }),
    });
    if (!res.ok) { setSubmitting(false); return; }
    setForm({ category: "", service: "", notes: "", priority: "normal" });
    setShowForm(false);
    setSubmitting(false);
    await load();
    toast.success("Service request submitted");
  };

  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">My Services</h1>
          <p className="text-sm text-gray-500">All services available through your membership</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">
          <Plus className="w-3.5 h-3.5" /> Request Service
        </button>
      </div>

      {(pending > 0 || approved > 0) && (
        <div className="flex items-center gap-3 mb-6 mt-4">
          {pending > 0 && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">{pending} pending</span>}
          {approved > 0 && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">{approved} approved</span>}
          {requests.length > 0 && <span className="text-[10px] text-gray-400">{requests.length} total requests</span>}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3"><Skeleton className="w-8 h-8 shrink-0" /><Skeleton className="h-4 w-32" /></div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[1,2,3].map((j) => <div key={j} className="flex items-center gap-2"><Skeleton className="w-3.5 h-3.5" /><Skeleton className="h-4 w-28" /></div>)}
                </div>
              </div>
            ))}
          </div>
        ) : serviceData.map((s) => (
          <div key={s.category} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#0F2B4A] flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">{s.category}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {s.items.map((item) => {
                const req = requests.find((r) => r.category === s.category && r.service === item);
                return (
                  <div key={item} className="flex items-center justify-between gap-2 text-sm text-gray-600 py-1 group">
                    <div className="flex items-center gap-2 min-w-0">
                      {req ? (
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                          req.status === "approved" ? "text-green-500" :
                          req.status === "rejected" ? "text-red-400" : "text-amber-500"
                        }`}>
                          {req.status === "approved" ? <Check className="w-3 h-3" /> :
                           req.status === "rejected" ? <X className="w-3 h-3" /> :
                           <Loader className="w-3 h-3" />}
                        </span>
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      )}
                      <span className={req ? (
                        req.status === "approved" ? "text-green-700 font-medium" :
                        req.status === "rejected" ? "text-red-400" : "text-amber-700 font-medium"
                      ) : "text-gray-600"}>
                        {item}
                      </span>
                    </div>
                    {req ? (
                      <span className="flex items-center gap-1 shrink-0">
                        {req.priority === "urgent" && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Urgent</span>}
                        <span className={`text-[10px] font-semibold uppercase ${
                          req.status === "approved" ? "text-green-500" :
                          req.status === "rejected" ? "text-red-400" : "text-amber-500"
                        }`}>{req.status}</span>
                      </span>
                    ) : (
                      <button onClick={() => { setForm({ category: s.category, service: item, notes: "", priority: "normal" }); setShowForm(true); }}
                        className="text-[10px] text-sky-600 font-semibold hover:underline sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                        Request
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-8 sm:pt-4 overflow-y-auto" onClick={() => { if (!submitting) setShowForm(false); }}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-4">Request Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                  <option value="">Select category</option>
                  {serviceData.map((s) => <option key={s.category} value={s.category}>{s.category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Service</label>
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                  <option value="">Select service</option>
                  {form.category && serviceData.find((s) => s.category === form.category)?.items.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  placeholder="Any details about your request" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" checked={form.priority === "urgent"}
                  onChange={(e) => setForm({ ...form, priority: e.target.checked ? "urgent" : "normal" })}
                  className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400" />
                <label htmlFor="urgent" className="text-xs font-medium text-gray-500">This is urgent / emergency</label>
              </div>
              <button onClick={submit} disabled={!form.category || !form.service || submitting}
                className="w-full py-3 text-sm font-semibold text-white bg-[#0F2B4A] rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting && <Loader className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
