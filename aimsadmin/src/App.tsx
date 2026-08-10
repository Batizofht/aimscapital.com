import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import AdminMessages from "./pages/AdminMessages";
import AdminAppointments from "./pages/AdminAppointments";
import Blogs from "./pages/Blogs";
import Events from "./pages/Events";
import Categories from "./pages/Categories";
import AdminServiceRequests from "./pages/AdminServiceRequests";
import AdminUsers from "./pages/AdminUsers";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminConsultations from "./pages/AdminConsultations";
import Settings from "./pages/Settings";
import AdminLayout from "./components/AdminLayout";

function allowedRoutes(role: string) {
  const r = role?.toLowerCase();
  if (r === "editor") return new Set(["/", "/blogs", "/events", "/categories", "/settings"]);
  if (r === "customercare" || r === "customer_care")
    return new Set(["/", "/members", "/messages", "/appointments", "/service-requests", "/blogs", "/events", "/categories", "/consultations", "/contact-messages", "/settings"]);
  return new Set(["/", "/members", "/messages", "/appointments", "/service-requests", "/blogs", "/events", "/categories", "/admins", "/consultations", "/contact-messages", "/settings"]);
}

function AppContent() {
  const { admin } = useAuth();
  const [page, setPage] = useState(() => {
    return new URLSearchParams(window.location.hash.replace("#", "?")).get("page") || "/";
  });
  const [emailParam, setEmailParam] = useState(() => {
    return new URLSearchParams(window.location.hash.replace("#", "?")).get("email") || "";
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const allowed = admin ? allowedRoutes(admin.role) : new Set(["/"]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page);
    if (emailParam) params.set("email", emailParam);
    window.location.hash = `#${params.toString()}`;
  }, [page, emailParam]);

  const navigate = (p: string, email?: string) => {
    if (!allowed.has(p)) return;
    setPage(p);
    setEmailParam(email || "");
  };

  if (!admin) {
    return <Login onSuccess={() => setPage("/")} />;
  }

  const resolved = allowed.has(page) ? page : "/";

  const renderPage = () => {
    switch (resolved) {
      case "/members":         return <Members key={refreshKey} onUpdate={refresh} onNavigate={navigate} />;
      case "/messages":        return <AdminMessages key={refreshKey} onUpdate={refresh} defaultEmail={emailParam} />;
      case "/appointments":    return <AdminAppointments key={refreshKey} onUpdate={refresh} onNavigate={navigate} />;
      case "/service-requests": return <AdminServiceRequests key={refreshKey} onUpdate={refresh} onNavigate={navigate} />;
      case "/blogs":           return <Blogs key={refreshKey} onUpdate={refresh} />;
      case "/events":          return <Events key={refreshKey} onUpdate={refresh} />;
      case "/categories":      return <Categories key={refreshKey} onUpdate={refresh} />;
      case "/admins":          return <AdminUsers key={refreshKey} onUpdate={refresh} />;
      case "/contact-messages": return <AdminContactMessages key={refreshKey} onUpdate={refresh} />;
      case "/consultations":   return <AdminConsultations key={refreshKey} onUpdate={refresh} />;
      case "/settings":        return <Settings key={refreshKey} />;
      default:                 return <Dashboard key={refreshKey} role={admin?.role} />;
    }
  };

  return (
    <AdminLayout currentPath={resolved} onNavigate={navigate}>
      {renderPage()}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}