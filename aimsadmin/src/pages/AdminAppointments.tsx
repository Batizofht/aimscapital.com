import { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, Phone, Search, Check, X, Plus, MessageSquare, Loader, Send } from "lucide-react";
import { getAppointments, updateAppointment, createAppointment, navigateToMessage, sendMemberMessage, type Appointment } from "../lib/store";
import { toast } from "sonner";
import RichTextEditor from "../components/RichTextEditor";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-amber-50 text-amber-600 border-amber-200" },
  confirmed:  { label: "Confirmed",  className: "bg-sky-50 text-sky-600 border-sky-200" },
  completed:  { label: "Completed",  className: "bg-green-50 text-green-600 border-green-200" },
  cancelled:  { label: "Cancelled",  className: "bg-red-50 text-red-400 border-red-200" },
};

const platformIcons: Record<string, typeof Video> = { Zoom: Video, "Google Meet": Video, "Microsoft Teams": Video, "In-Person": MapPin, "Phone Call": Phone };
const platforms = ["Zoom", "Google Meet", "Microsoft Teams", "In-Person", "Phone Call"];

export default function AdminAppointments({ onUpdate, onNavigate }: { onUpdate: () => void; onNavigate?: (page: string, email?: string) => void }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", platform: "Zoom", notes: "", clientName: "", clientEmail: "", priority: "normal" as "normal" | "urgent" });
  const [confirmModal, setConfirmModal] = useState<Appointment | null>(null);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmSending, setConfirmSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const load = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = appointments.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.clientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const changeStatus = async (id: number, status: Appointment["status"]) => {
    const key = `status-${id}-${status}`;
    if (actionLoading.has(key)) return;
    setActionLoading((prev) => new Set(prev).add(key));
    try {
      await updateAppointment(id, { status } as Partial<Appointment>);
      await load();
      onUpdate();
    } catch {
      toast.error("Failed to update appointment status.");
    } finally {
      setActionLoading((prev) => { const next = new Set(prev); next.delete(key); return next; });
    }
  };

  const handleConfirmWithMessage = async () => {
    if (!confirmModal || !confirmMsg.trim() || confirmSending) return;
    setConfirmSending(true);
    try {
      await sendMemberMessage(confirmModal.clientEmail, `Appointment Confirmed: ${confirmModal.title}`, confirmMsg.trim(), confirmModal.clientName);
      await updateAppointment(confirmModal.id, { status: "confirmed" } as Partial<Appointment>);
      toast.success(`${confirmModal.title} confirmed & email sent`);
      setConfirmModal(null);
      setConfirmMsg("");
      await load();
      onUpdate();
    } catch {
      toast.error("Failed to confirm appointment. Please try again.");
    } finally {
      setConfirmSending(false);
    }
  };

  const addAppointment = async () => {
    if (!form.title || !form.date || !form.time) return;
    setCreating(true);
    try {
      await createAppointment(form as Partial<Appointment>);
      setShowForm(false);
      setForm({ title: "", date: "", time: "", platform: "Zoom", notes: "", clientName: "", clientEmail: "", priority: "normal" });
      await load();
      onUpdate();
    } catch {
      toast.error("Failed to create appointment. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const stats = [
    { label: "Total", value: appointments.length },
    { label: "Pending", value: appointments.filter((a) => a.status === "pending").length },
    { label: "Confirmed", value: appointments.filter((a) => a.status === "confirmed").length },
    { label: "Completed", value: appointments.filter((a) => a.status === "completed").length },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Management</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Appointments</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New Appointment</button>
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 bg-white">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-64 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-5 w-20" />
                    <div className="flex gap-1"><Skeleton className="h-7 w-20" /><Skeleton className="h-7 w-20" /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No appointments found</p>
          </div>
        ) : (
          filtered.map((apt) => {
            const Icon = platformIcons[apt.platform] || Video;
            const st = statusStyles[apt.status];
            return (
              <div key={apt.id} className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-sky-600" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1a1a1a]">{apt.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                        <span className="flex items-center gap-1">{apt.platform}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-gray-400">{apt.clientName}</span>
                        <span className="text-[10px] text-gray-300">·</span>
                        <span className="text-[10px] text-gray-400">{apt.clientEmail}</span>
                      </div>
                      {apt.notes && <p className="text-[11px] text-gray-400 mt-1 italic">{apt.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 shrink-0 flex-wrap justify-end">
                    {apt.priority === "urgent" && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border bg-red-50 text-red-600 border-red-200">Urgent</span>}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${st.className}`}>{st.label}</span>
                    <div className="flex items-center gap-1 w-full justify-end mt-1">
                      <button onClick={() => navigateToMessage(apt.clientEmail, apt.clientName, onNavigate)} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all"><MessageSquare className="w-3 h-3" />Message</button>
                      {apt.status === "pending" && (
                        <>
                          <button onClick={() => setConfirmModal(apt)} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all"><Check className="w-3 h-3" />Confirm</button>
                          <button onClick={() => changeStatus(apt.id, "cancelled")} disabled={actionLoading.has(`status-${apt.id}-cancelled`)} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`status-${apt.id}-cancelled`) ? <Loader className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}Cancel</button>
                        </>
                      )}
                      {apt.status === "confirmed" && (
                        <button onClick={() => changeStatus(apt.id, "completed")} disabled={actionLoading.has(`status-${apt.id}-completed`)} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`status-${apt.id}-completed`) ? <Loader className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}Complete</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => { if (!confirmSending) { setConfirmModal(null); setConfirmMsg(""); } }}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div>
              <div>
                <h2 className="text-sm font-bold text-[#1a1a1a]">Confirm Appointment</h2>
                <p className="text-[11px] text-gray-400">Send an approval email to {confirmModal.clientName}</p>
              </div>
            </div>
            <RichTextEditor
              content={confirmMsg}
              onChange={setConfirmMsg}
              placeholder="Write the confirmation message to send to the client..."
              minHeight="150px"
            />
            <div className="flex items-center gap-2 mt-4 justify-end">
              <button onClick={() => { setConfirmModal(null); setConfirmMsg(""); }} disabled={confirmSending} className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:text-red-500 transition-all disabled:opacity-40">Cancel</button>
              <button onClick={handleConfirmWithMessage} disabled={!confirmMsg.trim() || confirmSending}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                {confirmSending ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">New Appointment</h2>
            <div className="space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              </div>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white">{platforms.map((p) => <option key={p} value={p}>{p}</option>)}</select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "normal" | "urgent" })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white"><option value="normal">Normal Priority</option><option value="urgent">Urgent</option></select>
              <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client name" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <input value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} placeholder="Client email" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all resize-none" />
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <button onClick={() => setShowForm(false)} disabled={creating} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all disabled:opacity-50">Cancel</button>
              <button onClick={addAppointment} disabled={creating || !form.title || !form.date || !form.time} className="px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-2 disabled:opacity-50">
                {creating ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}