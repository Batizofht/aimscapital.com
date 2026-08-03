import { useState } from "react";
import { Key, Loader, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

const API = "https://client2.wecollections.us/api";

export default function Settings() {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!admin) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/admins/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.id}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        setLoading(false);
        return;
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Account</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Settings</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
            <Key className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1a1a1a]">Change Password</h2>
            <p className="text-[11px] text-gray-400">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleChangePassword}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full sm:w-auto px-6 py-3 bg-[#0F2B4A] text-white text-sm font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-sky-50 rounded-xl">
          <p className="text-xs text-sky-900 font-medium mb-1">Password Requirements:</p>
          <ul className="text-xs text-sky-700 space-y-0.5">
            <li>• Minimum 8 characters</li>
            <li>• Use a strong, unique password</li>
            <li>• Don't share your password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
