import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { loginAdmin } from "./lib/store";

interface AdminUser {
  id: number;
  email: string;
  f_name: string | null;
  l_name: string | null;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aimsadmin");
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const login = async (email: string, password: string) => {
    let data;
    try {
      data = await loginAdmin(email, password);
    } catch {
      toast.error("Cannot reach the server. Please try again.");
      return false;
    }
    if (!data || data.error) {
      toast.error(data?.error || "Invalid email or password");
      return false;
    }
    const user = { id: data.id, email: data.email, f_name: data.f_name, l_name: data.l_name, role: data.role };
    localStorage.setItem("aimsadmin", JSON.stringify(user));
    setAdmin(user);
    toast.success(`Welcome, ${user.f_name || user.email}`);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("aimsadmin");
    setAdmin(null);
    toast.success("Signed out");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}