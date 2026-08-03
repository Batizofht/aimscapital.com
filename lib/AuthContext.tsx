"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

const API = "https://client2.wecollections.us/api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  membershipType: "beneficial" | "professional";
  status: "pending" | "active" | "suspended";
  rejectionReason: string | null;
  joined: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string, type: "beneficial" | "professional") => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("aims_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem("aims_user");
    if (!stored) return;
    const prev = JSON.parse(stored);
    try {
      const res = await fetch(`${API}/members/me?email=${encodeURIComponent(prev.email)}`);
      if (res.ok) {
        const data = await res.json();
        const u: User = { id: data.id, name: data.name, email: data.email, phone: data.phone || null, membershipType: data.membershipType, status: data.status, rejectionReason: data.rejectionReason, joined: data.joined || "" };
        setUser(u);
        localStorage.setItem("aims_user", JSON.stringify(u));
      }
    } catch { /* ignore */ }
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API}/members/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) return { ok: false, error: data.error };
      const u: User = { id: data.id, name: data.name, email: data.email, phone: data.phone || null, membershipType: data.membershipType, status: data.status, rejectionReason: data.rejectionReason, joined: data.joined };
      setUser(u);
      localStorage.setItem("aims_user", JSON.stringify(u));
      return { ok: true };
    } catch {
      return { ok: false, error: "Connection error. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string, type: "beneficial" | "professional"): Promise<string | null> => {
    try {
      const res = await fetch(`${API}/members/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, membershipType: type }),
      });
      const data = await res.json();
      if (data.error) return data.error;
      const u: User = { id: data.id, name: data.name, email: data.email, phone: data.phone || null, membershipType: data.membershipType, status: data.status, rejectionReason: data.rejectionReason || null, joined: data.joined || "" };
      setUser(u);
      localStorage.setItem("aims_user", JSON.stringify(u));
      return null;
    } catch {
      return "Connection error. Please try again.";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aims_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}