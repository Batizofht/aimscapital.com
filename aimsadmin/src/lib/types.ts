export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string | null;
  published: boolean;
  type: "blog" | "document";
  fileUrl: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  type: "audio" | "video";
  mediaUrl: string | null;
  coverImage: string | null;
  published: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  membershipType: "beneficial" | "professional";
  joined: string;
  status: "pending" | "active" | "suspended";
  rejectionReason: string | null;
}

export interface Message {
  id: number;
  with: string;
  email: string;
  customerEmail: string;
  lastMessage: string;
  date: string;
  unread: boolean;
  messages: { from: string; text: string; time: string }[];
}

export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  priority: "normal" | "urgent";
  notes: string;
  clientName: string;
  clientEmail: string;
}

export interface ServiceRequest {
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

export interface AdminUser {
  id: number;
  email: string;
  f_name: string | null;
  l_name: string | null;
  role: "admin" | "editor" | "administration" | "customerCare";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}
