"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { User, Mail, Shield, AlertTriangle, Save, Phone, Lock, Loader } from "lucide-react";
import { toast } from "sonner";

const API = "https://api.aimscapital.org/api";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [membershipType, setMembershipType] = useState<"beneficial" | "professional">(user?.membershipType || "beneficial");
  const [saving, setSaving] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    if (!user || !name) return;
    setSaving(true);
    const res = await fetch(`${API}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, name, phone, membershipType }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.error) { toast.error(data.error); return; }
    toast.success("Profile updated");
    setEditing(false);
    await refreshUser();
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    const res = await fetch(`${API}/members/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, currentPassword, newPassword }),
    });
    const data = await res.json();
    setChangingPassword(false);
    if (data.error) { toast.error(data.error); return; }
    toast.success("Password changed successfully");
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResubmit = async () => {
    if (!user) return;
    const res = await fetch(`${API}/members/resubmit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json();
    if (data.error) { toast.error(data.error); return; }
    toast.success("Application re-submitted for review");
    await refreshUser();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-6">Your profile and account information</p>

      {user?.status === "suspended" && user?.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Membership Rejected</p>
            <p className="text-xs text-red-600 mt-1">{user.rejectionReason}</p>
            <p className="text-xs text-red-500 mt-2">You can update your information below and re-submit.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-50">
          <div className="w-14 h-14 rounded-full bg-[#0F2B4A] flex items-center justify-center">
            <span className="text-white text-xl font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div className="flex-1">
            {editing ? (
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="text-base font-bold text-[#1a1a1a] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full outline-none focus:border-sky-400" />
            ) : (
              <h3 className="text-base font-bold text-[#1a1a1a]">{user?.name}</h3>
            )}
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 w-24">Full Name</span>
            {editing ? (
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400" />
            ) : (
              <span className="text-[#1a1a1a] font-medium">{user?.name}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 w-24">Phone</span>
            {editing ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Add phone number"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400" />
            ) : (
              <span className="text-[#1a1a1a] font-medium">{user?.phone || "—"}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 w-24">Email</span>
            <span className="text-[#1a1a1a] font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 w-24">Membership</span>
            {editing ? (
              <select value={membershipType} onChange={(e) => setMembershipType(e.target.value as any)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400 bg-white">
                <option value="beneficial">Beneficial</option>
                <option value="professional">Professional</option>
              </select>
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                {user?.membershipType === "professional" ? "Professional" : "Beneficial"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-50 flex items-center gap-3 flex-wrap">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving || !name}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30">
                <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => { setName(user?.name || ""); setPhone(user?.phone || ""); setMembershipType(user?.membershipType || "beneficial"); setEditing(false); }}
                className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => { setName(user?.name || ""); setPhone(user?.phone || ""); setMembershipType(user?.membershipType || "beneficial"); setEditing(true); }}
                className="px-5 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all">Edit Profile</button>
              {user?.status === "suspended" && (
                <button onClick={handleResubmit}
                  className="px-5 py-2.5 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 transition-all">Re-submit Application</button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Change Password</h3>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>
          {!showPasswordForm && (
            <button onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 text-xs font-semibold text-[#0F2B4A] border border-[#0F2B4A] rounded-xl hover:bg-[#0F2B4A] hover:text-white transition-all">
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button onClick={handleChangePassword} disabled={changingPassword}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30">
                {changingPassword ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Changing...</> : "Update Password"}
              </button>
              <button onClick={() => { setShowPasswordForm(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}