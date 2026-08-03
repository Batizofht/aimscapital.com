"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, X, Check, Plus, Loader } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

type Status = "pending" | "confirmed" | "completed" | "cancelled";

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: Status;
  priority: 'normal' | 'urgent';
  notes: string;
  clientName: string;
  clientEmail: string;
}

const statusStyles: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-sky-50 text-sky-600 border-sky-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-400 border-red-200" },
};

const platforms = ["Zoom", "Google Meet", "Microsoft Teams", "In-Person", "Phone Call"];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr === 0 ? 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [form, setForm] = useState<{ title: string; date: string; time: string; platform: string; notes: string; priority: "normal" | "urgent" }>({ title: "", date: "", time: "", platform: "Zoom", notes: "", priority: "normal" });

  const load = async () => {
    setLoading(true);
    const res = await fetch("https://client2.wecollections.us/api/appointments");
    if (!res.ok) { setLoading(false); return; }
    const data: Appointment[] = await res.json();
    if (user) setAppointments(data.filter((a) => a.clientEmail === user.email));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const resetForm = () => setForm({ title: "", date: "", time: "", platform: "Zoom", notes: "", priority: "normal" });

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.time || !user) return;
    setSubmitting(true);
    if (editing) {
      const res = await fetch("https://client2.wecollections.us/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form, status: "pending" }),
      });
      if (!res.ok) { setSubmitting(false); return; }
    } else {
      const res = await fetch("https://client2.wecollections.us/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientName: user.name, clientEmail: user.email }),
      });
      if (!res.ok) { setSubmitting(false); return; }
    }
    resetForm();
    setShowForm(false);
    setEditing(null);
    setSubmitting(false);
    await load();
    toast.success(editing ? "Appointment rescheduled" : "Appointment requested");
  };

  const handleEdit = (apt: Appointment) => {
    setForm({ title: apt.title, date: apt.date, time: apt.time, platform: apt.platform, notes: apt.notes, priority: apt.priority || "normal" });
    setEditing(apt.id);
    setShowForm(true);
  };

  const handleCancel = async (id: number) => {
    setCancelling(id);
    await fetch("https://client2.wecollections.us/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelled" }),
    });
    await load();
    setCancelling(null);
    toast.success("Appointment cancelled");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-[#1a1a1a]">Appointments</h1>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">
          <Plus className="w-3.5 h-3.5" /> Request Appointment
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">Manage your consultations and meetings</p>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center pt-8 sm:pt-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30" onClick={() => { setShowForm(false); setEditing(null); }} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{editing ? "Reschedule" : "Request"} Appointment</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 text-gray-300 hover:text-[#1a1a1a]"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g. Contract Review" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                  {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Any details for the appointment" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" checked={form.priority === "urgent"}
                  onChange={(e) => setForm({ ...form, priority: e.target.checked ? "urgent" : "normal" })}
                  className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400" />
                <label htmlFor="urgent" className="text-xs font-medium text-gray-500">This is urgent / emergency</label>
              </div>
              <button onClick={handleSubmit} disabled={!form.title || !form.date || !form.time || submitting}
                className="w-full py-3 text-sm font-semibold text-white bg-[#0F2B4A] rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting && <Loader className="w-4 h-4 animate-spin" />}
                {editing ? "Reschedule" : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="w-9 h-9 shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-64 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No appointments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const st = statusStyles[apt.status];
            return (
              <div key={apt.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${apt.status === "cancelled" ? "bg-red-50" : apt.status === "completed" ? "bg-green-50" : "bg-sky-50"}`}>
                      {apt.status === "completed" ? <Check className="w-4 h-4 text-green-600" /> :
                       apt.status === "cancelled" ? <X className="w-4 h-4 text-red-400" /> :
                       <Calendar className="w-4 h-4 text-sky-600" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1a1a1a]">{apt.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(apt.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(apt.time)}</span>
                        <span className="flex items-center gap-1">{apt.platform}</span>
                      </div>
                      {apt.notes && <p className="text-xs text-gray-400 mt-1">{apt.notes}</p>}
                    </div>
                  </div>
                    <div className="flex flex-col sm:items-end items-start gap-2 shrink-0">
                    {apt.priority === "urgent" && <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">Urgent</span>}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${st.className}`}>{st.label}</span>
                    {apt.status === "confirmed" && (
                      <button onClick={() => handleEdit(apt)} className="text-[10px] text-sky-600 font-semibold hover:underline">Reschedule</button>
                    )}
                    {(apt.status === "pending" || apt.status === "confirmed") && (
                      <button onClick={() => handleCancel(apt.id)} disabled={cancelling === apt.id} className="text-[10px] text-red-400 font-semibold hover:underline disabled:opacity-40 inline-flex items-center gap-1">
                        {cancelling === apt.id && <Loader className="w-3 h-3 animate-spin" />}Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
