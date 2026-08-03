import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

export function readData<T>(filename: string, fallback: T): T {
  try {
    const full = path.join(DATA_DIR, filename);
    if (!fs.existsSync(full)) return fallback;
    return JSON.parse(fs.readFileSync(full, "utf-8"));
  } catch {
    return fallback;
  }
}

export function writeData(filename: string, data: unknown) {
  const full = path.join(DATA_DIR, filename);
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf-8");
}

export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  clientName: string;
  clientEmail: string;
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

export interface Member {
  id: string;
  name: string;
  email: string;
  membershipType: "beneficial" | "professional";
  joined: string;
  status: "active" | "suspended";
}

export interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  category: string;
  service: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  notes: string;
}

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
  published: boolean;
}
