import { useState } from "react";
import { useAuth } from "../AuthContext";
import { LayoutDashboard, Users, MessageSquare, Calendar, FileText, FolderOpen, Shield, Mail, PhoneCall, Settings, LogOut, Menu, X } from "lucide-react";

const allNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/service-requests", label: "Service Requests", icon: FileText },
  { href: "/blogs", label: "Publications", icon: FileText },
  { href: "/categories", label: "Categories", icon: FolderOpen },
  { href: "/admins", label: "Admins", icon: Shield },
  { href: "/consultations", label: "Consultations", icon: PhoneCall },
  { href: "/contact-messages", label: "Contact", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getNavItems(role: string) {
  const r = role?.toLowerCase();
  if (r === "editor") {
    return allNavItems.filter((i) => i.href === "/" || i.href === "/blogs" || i.href === "/categories");
  }
  if (r === "customercare" || r === "customer_care") {
    return allNavItems.filter((i) => i.href !== "/admins");
  }
  return allNavItems;
}

export default function AdminLayout({
  children,
  currentPath,
  onNavigate,
}: {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const { admin, logout } = useAuth();
  const navItems = getNavItems(admin?.role || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-64 lg:w-72 h-screen bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <button onClick={() => handleNav("/")} className="flex items-center gap-2">
            <img src="/secondlogo.png" alt="AIMS Capital" className="h-7 w-auto" />
            <span className="text-sm font-bold text-[#1a1a1a]">Admin Panel</span>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-[#1a1a1a]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.href;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  active
                    ? "bg-[#0F2B4A] text-white font-semibold shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0F2B4A] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a1a] truncate">{admin?.f_name || admin?.email || "Admin"}</p>
              <p className="text-[10px] text-gray-400 truncate">{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-50 rounded-xl transition-colors mt-1"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/secondlogo.png" alt="AIMS Capital" className="h-6 w-auto" />
          </div>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
