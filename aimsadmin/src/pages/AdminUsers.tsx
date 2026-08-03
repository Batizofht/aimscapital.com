import { useState, useEffect } from "react";
import { Shield, Plus, Search, UserCheck, UserX, Pencil } from "lucide-react";
import { useAuth } from "../AuthContext";
import { getAdmins, createAdmin, updateAdmin, type AdminUser } from "../lib/store";
import { toast } from "sonner";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

const roles = [
  { value: "admin", label: "Admin", desc: "Full access to everything" },
  { value: "editor", label: "Editor", desc: "Can create and edit publications" },
  { value: "administration", label: "Administration", desc: "Manage appointments, messages, service requests" },
  { value: "customerCare", label: "Customer Care", desc: "Handle appointments and messages" },
];

const SUPER_ADMIN_EMAIL = "aims@aimscapital.com";

export default function AdminUsers({ onUpdate }: { onUpdate: () => void }) {
  const { admin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  const [editPassword, setEditPassword] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ email: "", password: "", f_name: "", l_name: "", role: "editor" });
  const [passwordForm, setPasswordForm] = useState({ password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!admin) return;
    setLoading(true);
    const data = await getAdmins(admin.id);
    setAdmins(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = admins.filter((a) =>
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    (a.f_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (!admin) return;
    const result = await createAdmin(admin.id, form);
    if (result.error) {
      toast.error(result.error);
      setError(result.error);
    } else {
      setShowForm(false);
      setForm({ email: "", password: "", f_name: "", l_name: "", role: "editor" });
      await load();
      onUpdate();
      toast.success("Admin created");
    }
  };

  const handleUpdateAdmin = async () => {
    if (!editAdmin || !admin) return;
    const result = await updateAdmin(admin.id, editAdmin.id, { f_name: editAdmin.f_name ?? "", l_name: editAdmin.l_name ?? "", role: editAdmin.role });
    if (result.error) {
      toast.error(result.error);
    } else {
      setEditAdmin(null);
      await load();
      toast.success("Admin updated");
    }
  };

  const handleUpdatePassword = async () => {
    if (!editPassword || !admin || !passwordForm.password) return;
    const result = await updateAdmin(admin.id, editPassword.id, { password: passwordForm.password });
    if (result.error) {
      toast.error(result.error);
    } else {
      setEditPassword(null);
      setPasswordForm({ password: "" });
      await load();
      toast.success("Password updated");
    }
  };

  const toggleStatus = async (id: number, current: boolean) => {
    if (!admin) return;
    await updateAdmin(admin.id, id, { isActive: !current });
    await load();
    onUpdate();
    toast.success(current ? "Admin deactivated" : "Admin activated");
  };

  const changeRole = async (id: number, role: string) => {
    if (!admin) return;
    await updateAdmin(admin.id, id, { role });
    await load();
    onUpdate();
    toast.success("Role updated");
  };

  const handleRevoke = async (id: number, email: string) => {
    if (!confirm(`Revoke access for ${email}? They will be deactivated and can no longer sign in. You can reactivate them later.`)) return;
    if (!admin) return;
    const result = await updateAdmin(admin.id, id, { isActive: false });
    if (result.error) {
      toast.error(result.error);
    } else {
      await load();
      onUpdate();
      toast.success("Access revoked");
    }
  };

  if (admin?.role !== "admin") {
    return (
      <div className="p-4 md:p-8 max-w-5xl">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">You don't have permission to manage admins.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Admins", value: admins.length },
    { label: "Active", value: admins.filter((a) => a.isActive).length },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">System</p>
          <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Admins</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Admin
        </button>
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search admins..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48 hidden md:block" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No admins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Admin</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const isSuperAdmin = a.email === SUPER_ADMIN_EMAIL;
                  return (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSuperAdmin ? "bg-amber-500" : "bg-[#0F2B4A]"}`}>
                            <span className="text-white text-xs font-bold">{(a.f_name || a.email).charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                              {a.f_name || a.l_name ? `${a.f_name || ""} ${a.l_name || ""}`.trim() : a.email}
                              {isSuperAdmin && <span className="text-[8px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded">SUPER</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs text-gray-500">{a.email}</span></td>
                      <td className="px-4 py-3.5">
                        {isSuperAdmin ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-50 text-amber-600">{a.role}</span>
                        ) : (
                          <select
                            value={a.role}
                            onChange={(e) => changeRole(a.id, e.target.value)}
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border bg-white cursor-pointer"
                          >
                            {roles.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${a.isActive ? "text-green-600 bg-green-50" : "text-red-400 bg-red-50"}`}>
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isSuperAdmin && (
                            <>
                              <button
                                onClick={() => setEditAdmin(a)}
                                className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                                title="Edit Admin"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditPassword(a)}
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                title="Change Password"
                              >
                                <Shield className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => a.isActive ? handleRevoke(a.id, a.email) : toggleStatus(a.id, a.isActive)}
                                className={`p-1.5 rounded-lg transition-all ${a.isActive ? "text-red-400 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                                title={a.isActive ? "Revoke access (deactivate)" : "Reactivate"}
                              >
                                {a.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>
                            </>
                          )}
                          {isSuperAdmin && (
                            <span className="text-[10px] text-gray-400 italic px-2">Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">New Admin</h2>
            {error && (
              <div className="mb-4 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-500 font-medium">{error}</div>
            )}
            <div className="space-y-3">
              <input value={form.f_name} onChange={(e) => setForm({ ...form, f_name: e.target.value })} placeholder="First name" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <input value={form.l_name} onChange={(e) => setForm({ ...form, l_name: e.target.value })} placeholder="Last name" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white">
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label} - {r.desc}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <button onClick={() => { setShowForm(false); setError(""); }} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">Create</button>
            </div>
          </div>
        </div>
      )}

      {editAdmin && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => setEditAdmin(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">Edit Admin</h2>
            <div className="space-y-3">
              <input value={editAdmin.f_name || ""} onChange={(e) => setEditAdmin({ ...editAdmin, f_name: e.target.value })} placeholder="First name" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <input value={editAdmin.l_name || ""} onChange={(e) => setEditAdmin({ ...editAdmin, l_name: e.target.value })} placeholder="Last name" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
              <select value={editAdmin.role} onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value as AdminUser["role"] })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none bg-white">
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label} - {r.desc}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <button onClick={() => setEditAdmin(null)} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleUpdateAdmin} className="px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {editPassword && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => setEditPassword(null)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">Change Password for {editPassword.email}</h2>
            <div className="space-y-3">
              <input
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ password: e.target.value })}
                placeholder="New Password"
                type="password"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 mt-4 justify-end">
              <button onClick={() => { setEditPassword(null); setPasswordForm({ password: "" }); }} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleUpdatePassword} disabled={!passwordForm.password} className="px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-50">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}