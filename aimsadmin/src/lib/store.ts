import type { BlogPost, BlogCategory, Appointment, Message, Member, ServiceRequest, AdminUser, EventItem } from "./types";

// Re-export types for convenience
export type { Member, BlogPost, BlogCategory, Appointment, Message, ServiceRequest, AdminUser, EventItem };

const API = "https://client2.wecollections.us/api";
// Derived from API so it can never drift out of sync when API is pointed at a
// different environment (e.g. localhost during development) — a hardcoded
// second constant here previously caused uploaded file URLs to resolve
// against the wrong host.
const API_BASE = API.replace(/\/api\/?$/, "");

// ─── Blog posts via API ─────────────────────────────────────

export async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API}/posts`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const posts = await res.json();
  return posts.map((p: BlogPost) => ({
    ...p,
    image: p.image ? (p.image.startsWith("http") ? p.image : `${API_BASE}${p.image}`) : null
  }));
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  const res = await fetch(`${API}/posts`, {
    method: post.id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to save post: ${res.status}`);
  }
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`${API}/posts`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to delete post: ${res.status}`);
  }
}

// Uses XHR (not fetch) so we can report real upload progress via
// `upload.onprogress` — fetch has no simple cross-browser way to do this.
function uploadWithProgress(url: string, fieldName: string, file: File, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data: any = {};
      try { data = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        resolve(`${API_BASE}${data.url}`);
      } else {
        reject(new Error(data.error || `Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Cannot reach the server. Please check your connection."));
    xhr.send(formData);
  });
}

export async function uploadFile(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return uploadWithProgress(`${API}/upload/file`, "file", file, onProgress);
}

export async function uploadCoverImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return uploadWithProgress(`${API}/upload/cover`, "image", file, onProgress);
}

// ─── Events (audio/video) via API ───────────────────────────

export async function getEvents(): Promise<EventItem[]> {
  const res = await fetch(`${API}/events`);
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  const events = await res.json();
  return events.map((e: EventItem) => ({
    ...e,
    coverImage: e.coverImage ? (e.coverImage.startsWith("http") ? e.coverImage : `${API_BASE}${e.coverImage}`) : null,
    mediaUrl: e.mediaUrl ? (e.mediaUrl.startsWith("http") ? e.mediaUrl : `${API_BASE}${e.mediaUrl}`) : null,
  }));
}

export async function saveEvent(event: EventItem): Promise<EventItem> {
  const res = await fetch(`${API}/events`, {
    method: event.id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to save event: ${res.status}`);
  }
  return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API}/events`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to delete event: ${res.status}`);
  }
}

export async function uploadMedia(file: File, onProgress?: (pct: number) => void): Promise<string> {
  return uploadWithProgress(`${API}/upload/media`, "media", file, onProgress);
}

// ─── Categories (localStorage — admin-managed) ─────────────

const STORAGE_KEY_CATS = "aimsadmin_categories";

const defaultCategories: BlogCategory[] = [
  { id: "1", name: "International Arbitration" },
  { id: "2", name: "Infrastructure" },
  { id: "3", name: "Finance" },
  { id: "4", name: "Real Estate" },
  { id: "5", name: "Climate Finance" },
  { id: "6", name: "Aviation" },
  { id: "7", name: "Corporate Law" },
];

function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {}
  return fallback;
}

export function getCategories(): BlogCategory[] { return load<BlogCategory[]>(STORAGE_KEY_CATS, defaultCategories); }
export function saveCategories(cats: BlogCategory[]) { localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(cats)); }

// ─── Shared data via API ─────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${API}/members`);
  if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
  return res.json();
}

export async function updateMember(id: string, fields: Partial<Member>): Promise<Member> {
  const res = await fetch(`${API}/members`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...fields }),
  });
  if (!res.ok) throw new Error(`Failed to update member: ${res.status}`);
  return res.json();
}

// Helper: never throw on HTTP/network errors — return { error } so callers can show a toast
// and keep their UI responsive (prevents frozen buttons / silent no-ops).
async function postJson(url: string, body: unknown, method = "POST"): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { error: "Cannot reach the server. Please check your connection." };
  }
  const data = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
  if (!res.ok && !data.error) return { error: `Request failed (${res.status})` };
  return data;
}

export async function approveMember(id: string): Promise<any> {
  return postJson(`${API}/members/approve`, { id });
}

export async function rejectMember(id: string, reason: string): Promise<any> {
  return postJson(`${API}/members/reject`, { id, reason });
}

export async function deleteMember(id: string): Promise<any> {
  return postJson(`${API}/members`, { id }, "DELETE");
}

export async function sendMemberMessage(customerEmail: string, subject: string, text: string, customerName?: string): Promise<any> {
  return postJson(`${API}/messages/notify`, { customerEmail, customerName, subject, text });
}

export async function ensureConversation(customerEmail: string, memberName: string): Promise<void> {
  const all = await getMessages();
  const exists = all.some((c: any) => c.customerEmail === customerEmail);
  if (!exists) {
    await sendMemberMessage(
      customerEmail,
      "Welcome to AIMS Capital",
      `Hello ${memberName}, welcome! This is your message thread with AIMS Capital. Feel free to ask any questions here.`,
      memberName
    );
  }
}

export async function navigateToMessage(
  customerEmail: string,
  memberName: string,
  onNavigate?: (page: string, email?: string) => void
): Promise<void> {
  await ensureConversation(customerEmail, memberName);
  onNavigate?.("/messages", customerEmail);
}

export async function getMessages(): Promise<Message[]> {
  const res = await fetch(`${API}/messages`);
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  return res.json();
}

export async function replyToConversation(
  conversationId: number,
  from: string,
  text: string,
  time?: string
): Promise<Message> {
  const res = await fetch(`${API}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, from, text, time }),
  });
  if (!res.ok) throw new Error(`Failed to reply: ${res.status}`);
  return res.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${API}/appointments`);
  if (!res.ok) throw new Error(`Failed to fetch appointments: ${res.status}`);
  return res.json();
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch(`${API}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create appointment: ${res.status}`);
  return res.json();
}

export async function updateAppointment(id: number, fields: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch(`${API}/appointments`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...fields }),
  });
  if (!res.ok) throw new Error(`Failed to update appointment: ${res.status}`);
  return res.json();
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  const res = await fetch(`${API}/service-requests`);
  if (!res.ok) throw new Error(`Failed to fetch service requests: ${res.status}`);
  return res.json();
}

export async function updateServiceRequest(id: string, fields: Partial<ServiceRequest>): Promise<ServiceRequest> {
  const res = await fetch(`${API}/service-requests`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...fields }),
  });
  if (!res.ok) throw new Error(`Failed to update service request: ${res.status}`);
  return res.json();
}

export async function createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
  const res = await fetch(`${API}/service-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create service request: ${res.status}`);
  return res.json();
}

// ─── Admin auth & management via API ────────────────────

export async function loginAdmin(email: string, password: string): Promise<any> {
  let res: Response;
  try {
    res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // Network/connection error — never throw, so the caller can reset loading state.
    return { error: "Cannot reach the server. Check your connection and try again." };
  }
  // Both success and credential errors (400/401) come back as JSON with our shape.
  const data = await res.json().catch(() => ({ error: `Login failed (${res.status})` }));
  if (!res.ok && !data.error) {
    return { error: `Login failed (${res.status})` };
  }
  return data;
}

export async function getAdmins(token: number): Promise<AdminUser[]> {
  const res = await fetch(`${API}/admins`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Failed to fetch admins: ${res.status}`);
  return res.json();
}

export async function createAdmin(token: number, data: { email: string; password: string; f_name?: string; l_name?: string; role: string }): Promise<any> {
  const res = await fetch(`${API}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create admin: ${res.status}`);
  return res.json();
}

export async function getContactMessages(token: number): Promise<any[]> {
  const res = await fetch(`${API}/contact`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Failed to fetch contact messages: ${res.status}`);
  return res.json();
}

export async function updateAdmin(token: number, id: number, data: { role?: string; isActive?: boolean; password?: string; f_name?: string; l_name?: string }): Promise<any> {
  const res = await fetch(`${API}/admins`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error(`Failed to update admin: ${res.status}`);
  return res.json();
}