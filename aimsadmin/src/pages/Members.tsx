import { useState, useEffect } from "react";
import { Users, Search, UserCheck, X, AlertTriangle, Trash2, RotateCcw, Ban, MessageSquare, Send, Loader } from "lucide-react";
import { getMembers, approveMember, rejectMember, deleteMember, sendMemberMessage, navigateToMessage, type Member } from "../lib/store";
import { toast } from "sonner";
import RichTextEditor from "../components/RichTextEditor";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className || ""}`} />;
}

export default function Members({ onUpdate, onNavigate }: { onUpdate: () => void; onNavigate?: (page: string, email?: string) => void }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "active" | "suspended">("all");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: "reject" | "suspend" | "delete" | "message"; member: Member } | null>(null);
  const [reason, setReason] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  const withLoading = (key: string, fn: () => Promise<void>) => async () => {
    if (actionLoading.has(key)) return;
    setActionLoading((prev) => new Set(prev).add(key));
    try { await fn(); } finally { setActionLoading((prev) => { const next = new Set(prev); next.delete(key); return next; }); }
  };

  const load = async () => {
    setLoading(true);
    const data = await getMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (m: Member) => {
    const res = await approveMember(m.id);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`${m.name} approved`);
    await load();
    onUpdate();
  };

  const handleReactivate = async (m: Member) => {
    const res = await approveMember(m.id);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`${m.name} reactivated`);
    await load();
    onUpdate();
  };

  const handleRowAction = (key: string, fn: () => Promise<void>) => withLoading(key, fn);

  const handleSuspend = async () => {
    if (!modal || modal.type !== "suspend" || !reason) return;
    setModalLoading(true);
    const res = await rejectMember(modal.member.id, reason);
    setModalLoading(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`${modal.member.name} suspended`);
    setModal(null);
    setReason("");
    await load();
    onUpdate();
  };

  const handleReject = async () => {
    if (!modal || modal.type !== "reject" || !reason) return;
    setModalLoading(true);
    const res = await rejectMember(modal.member.id, reason);
    setModalLoading(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`${modal.member.name} rejected`);
    setModal(null);
    setReason("");
    await load();
    onUpdate();
  };

  const handleDelete = async () => {
    if (!modal || modal.type !== "delete") return;
    setModalLoading(true);
    const res = await deleteMember(modal.member.id);
    setModalLoading(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`${modal.member.name} deleted`);
    setModal(null);
    await load();
    onUpdate();
  };

  const handleSendMessage = async () => {
    if (!modal || modal.type !== "message" || !msgSubject || !msgText) return;
    setSending(true);
    const res = await sendMemberMessage(modal.member.email, msgSubject, msgText);
    setSending(false);
    if (res.error) { toast.error(res.error); return; }
    toast.success(`Message sent to ${modal.member.name}`);
    setModal(null);
    setMsgSubject("");
    setMsgText("");
  };

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || m.status === tab;
    return matchSearch && matchTab;
  });

  const tabs = [
    { key: "all" as const, label: "All", count: members.length },
    { key: "pending" as const, label: "Pending", count: members.filter((m) => m.status === "pending").length },
    { key: "active" as const, label: "Active", count: members.filter((m) => m.status === "active").length },
    { key: "suspended" as const, label: "Suspended", count: members.filter((m) => m.status === "suspended").length },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Management</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Members</h1>
      </div>

      <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${tab === t.key ? "bg-white text-[#0F2B4A] shadow-sm" : "text-gray-400 hover:text-[#1a1a1a]"}`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-[#0F2B4A] text-white" : "bg-gray-200 text-gray-500"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {loading ? (
          <div className="p-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <Skeleton className="h-4 w-36 flex-1" />
                <Skeleton className="h-4 w-48 hidden md:block" />
                <Skeleton className="h-4 w-28 hidden lg:block" />
                <Skeleton className="h-4 w-20 hidden sm:block" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Joined</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${member.status === "pending" ? "bg-amber-100" : member.status === "active" ? "bg-[#0F2B4A]" : "bg-red-100"}`}>
                          <span className={`text-xs font-bold ${member.status === "pending" ? "text-amber-600" : member.status === "active" ? "text-white" : "text-red-500"}`}>{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1a1a1a]">{member.name}</p>
                          {member.rejectionReason && <p className="text-[10px] text-red-400 mt-0.5 max-w-[200px] truncate" dangerouslySetInnerHTML={{ __html: member.rejectionReason }} />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs text-gray-500">{member.email}</span></td>
                    <td className="px-4 py-3.5 hidden lg:table-cell"><span className="text-xs text-gray-500">{member.phone || "—"}</span></td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${member.membershipType === "professional" ? "text-amber-600 bg-amber-50" : "text-green-600 bg-green-50"}`}>{member.membershipType}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-400">{member.joined}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${
                        member.status === "active" ? "text-green-600 bg-green-50" :
                        member.status === "pending" ? "text-amber-600 bg-amber-50" : "text-red-400 bg-red-50"
                      }`}>{member.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {member.status === "pending" && (
                          <>
                            <button onClick={handleRowAction(`approve-${member.id}`, () => handleApprove(member))} disabled={actionLoading.has(`approve-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`approve-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}Approve</button>
                            <button onClick={handleRowAction(`reject-${member.id}`, async () => { setModal({ type: "reject", member }); setReason(""); })} disabled={actionLoading.has(`reject-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`reject-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}Reject</button>
                            <button onClick={handleRowAction(`delete-${member.id}`, async () => { setModal({ type: "delete", member }); })} disabled={actionLoading.has(`delete-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-400 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`delete-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}Delete</button>
                          </>
                        )}
                        {member.status === "active" && (
                          <>
                            <button onClick={handleRowAction(`message-${member.id}`, async () => navigateToMessage(member.email, member.name, onNavigate))} disabled={actionLoading.has(`message-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`message-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />}Message</button>
                            <button onClick={handleRowAction(`suspend-${member.id}`, async () => { setModal({ type: "suspend", member }); setReason(""); })} disabled={actionLoading.has(`suspend-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`suspend-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}Suspend</button>
                            <button onClick={handleRowAction(`delete-${member.id}`, async () => { setModal({ type: "delete", member }); })} disabled={actionLoading.has(`delete-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-400 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`delete-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}Delete</button>
                          </>
                        )}
                        {member.status === "suspended" && (
                          <>
                            <button onClick={handleRowAction(`reactivate-${member.id}`, () => handleReactivate(member))} disabled={actionLoading.has(`reactivate-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`reactivate-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}Reactivate</button>
                            <button onClick={handleRowAction(`delete-${member.id}`, async () => { setModal({ type: "delete", member }); })} disabled={actionLoading.has(`delete-${member.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 hover:bg-red-50 hover:text-red-400 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">{actionLoading.has(`delete-${member.id}`) ? <Loader className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center p-4 pt-12 sm:pt-4 overflow-y-auto" onClick={() => { if (!sending && !modalLoading) { setModal(null); setReason(""); setMsgSubject(""); setMsgText(""); } }}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            {modal.type === "delete" ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1a1a1a]">Delete {modal.member.name}</h2>
                    <p className="text-[11px] text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button onClick={() => { setModal(null); setReason(""); }} disabled={modalLoading} className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:text-red-500 transition-all disabled:opacity-40">Cancel</button>
                  <button onClick={handleDelete} disabled={modalLoading} className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{modalLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null} Delete Forever</button>
                </div>
              </>
            ) : modal.type === "message" ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-sky-600" /></div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1a1a1a]">Message {modal.member.name}</h2>
                    <p className="text-[11px] text-gray-400">Send a direct notification to {modal.member.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <input value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 transition-all" />
                  <RichTextEditor
                    content={msgText}
                    onChange={setMsgText}
                    placeholder="Write your message..."
                    minHeight="200px"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button onClick={() => { setModal(null); setMsgSubject(""); setMsgText(""); }} className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl transition-all">Cancel</button>
                  <button onClick={handleSendMessage} disabled={!msgSubject || !msgText || sending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    {sending && <Loader className="w-3.5 h-3.5 animate-spin" />}
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1a1a1a]">{modal.type === "reject" ? "Reject" : "Suspend"} {modal.member.name}</h2>
                    <p className="text-[11px] text-gray-400">Provide a reason the member can see and act on</p>
                  </div>
                </div>
                <RichTextEditor
                  content={reason}
                  onChange={setReason}
                  placeholder="e.g. Please upload a valid ID document before we can approve your membership..."
                  minHeight="120px"
                />
                <div className="flex items-center gap-2 mt-4 justify-end">
                  <button onClick={() => { setModal(null); setReason(""); }} disabled={modalLoading} className="px-4 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:text-red-500 transition-all disabled:opacity-40">Cancel</button>
                  <button onClick={modal.type === "reject" ? handleReject : handleSuspend} disabled={!reason || modalLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed">{modalLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : null} {modal.type === "reject" ? "Reject & Send Email" : "Suspend & Send Email"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}