const API = "https://api.aimscapital.org/api";

export interface Conversation {
  id: number;
  with: string;
  email: string;
  lastMessage: string;
  date: string;
  unread: boolean;
  messages: { from: string; text: string; time: string }[];
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API}/messages`);
  return res.json();
}

export async function sendMessage(conversationId: number, from: string, text: string): Promise<Conversation> {
  const res = await fetch(`${API}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, from, text, time: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) }),
  });
  return res.json();
}

export interface AppointmentData {
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

export async function getAppointmentsData(): Promise<AppointmentData[]> {
  const res = await fetch(`${API}/appointments`);
  return res.json();
}

export async function createAppointmentData(data: Partial<AppointmentData>): Promise<AppointmentData> {
  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateAppointmentData(id: number, fields: Partial<AppointmentData>): Promise<AppointmentData> {
  const res = await fetch(`${API}/appointments`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...fields }),
  });
  return res.json();
}
