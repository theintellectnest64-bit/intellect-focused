import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, TrendingUp, Download, LogIn, LogOut, ArrowUpDown, Search,
  ChevronDown, ChevronUp, MessageSquare, Phone, Globe, Send, Trash2,
  ExternalLink, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
type Contact = Tables<"contacts">;

interface AdminNote {
  id: string;
  record_type: string;
  record_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

/* ── Helpers ── */

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatDateTime = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

const whatsAppLink = (phone: string) =>
  `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

const mailtoLink = (email: string, name: string) =>
  `mailto:${email}?subject=Following up — The Intellect Nest&body=Hi ${encodeURIComponent(name)},`;

const STATUS_OPTIONS = ["new", "contacted", "converted", "closed"] as const;

const statusColors: Record<string, string> = {
  new: "bg-sky/10 text-sky border-sky/30",
  contacted: "bg-gold/10 text-gold border-gold/30",
  converted: "bg-green-100 text-green-700 border-green-300",
  closed: "bg-muted text-muted-foreground border-border",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusColors[status] || statusColors.new}`}>
    {status}
  </span>
);

/* ── Notes Component ── */

const NotesSection = ({ recordType, recordId }: { recordType: string; recordId: string }) => {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    const { data } = await supabase
      .from("admin_notes")
      .select("*")
      .eq("record_type", recordType)
      .eq("record_id", recordId)
      .order("created_at", { ascending: false });
    if (data) setNotes(data as AdminNote[]);
  }, [recordType, recordId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("admin_notes").insert([{
      record_type: recordType,
      record_id: recordId,
      note: newNote.trim(),
    }] as any);
    if (error) { toast.error("Failed to add note"); }
    else { setNewNote(""); await fetchNotes(); toast.success("Note added"); }
    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    await supabase.from("admin_notes").delete().eq("id", id);
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success("Note deleted");
  };

  return (
    <div className="mt-3">
      <h4 className="font-body text-xs font-semibold text-navy mb-2 flex items-center gap-1">
        <MessageSquare size={12} /> Notes
      </h4>
      <div className="space-y-2 mb-3">
        {notes.map(n => (
          <div key={n.id} className="flex items-start gap-2 bg-muted/50 rounded-lg px-3 py-2">
            <p className="font-body text-xs text-secondary flex-1">{n.note}</p>
            <span className="font-body text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(n.created_at)}</span>
            <button onClick={() => deleteNote(n.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {notes.length === 0 && <p className="font-body text-xs text-muted-foreground italic">No notes yet</p>}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addNote()}
          className="text-xs h-8"
        />
        <Button size="sm" variant="outline" onClick={addNote} disabled={loading || !newNote.trim()} className="h-8 px-3">
          <Send size={12} />
        </Button>
      </div>
    </div>
  );
};

/* ── Expandable Lead Row ── */

const LeadRow = ({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: string, status: string) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-sky-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{formatDate(lead.created_at)}</td>
        <td className="px-3 py-3 font-body text-navy font-medium">{lead.parent_name}</td>
        <td className="px-3 py-3 font-body text-secondary">{lead.parent_email}</td>
        <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{lead.parent_phone}</td>
        <td className="px-3 py-3 font-body text-navy">{lead.child_name}</td>
        <td className="px-3 py-3 font-body text-secondary text-center">{lead.child_age}</td>
        <td className="px-3 py-3 font-body text-secondary">{lead.current_level}</td>
        <td className="px-3 py-3 font-body text-secondary">{lead.preferred_language}</td>
        <td className="px-3 py-3"><StatusBadge status={lead.status} /></td>
        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
          <Select value={lead.status} onValueChange={v => onStatusChange(lead.id, v)}>
            <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="px-3 py-3 text-muted-foreground">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={11} className="px-3 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-4 px-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-sky-border">
                  {/* Details */}
                  <div className="space-y-2">
                    <h4 className="font-body text-xs font-semibold text-navy">Details</h4>
                    <div className="space-y-1">
                      <p className="font-body text-xs text-secondary">
                        <span className="text-muted-foreground">Submitted:</span> {formatDateTime(lead.created_at)}
                      </p>
                      {lead.message && (
                        <p className="font-body text-xs text-secondary">
                          <span className="text-muted-foreground">Message:</span> {lead.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-body text-xs font-semibold text-navy">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={whatsAppLink(lead.parent_phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                      >
                        <Phone size={12} /> WhatsApp
                      </a>
                      <a
                        href={mailtoLink(lead.parent_email, lead.parent_name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-sky/10 text-sky text-xs font-medium hover:bg-sky/20 transition-colors"
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <NotesSection recordType="lead" recordId={lead.id} />
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Expandable Contact Row ── */

const ContactRow = ({ contact, onStatusChange }: { contact: Contact; onStatusChange: (id: string, status: string) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-sky-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{formatDate(contact.created_at)}</td>
        <td className="px-3 py-3 font-body text-navy font-medium">{contact.name}</td>
        <td className="px-3 py-3 font-body text-secondary">{contact.email}</td>
        <td className="px-3 py-3 font-body text-secondary">{contact.phone || "—"}</td>
        <td className="px-3 py-3 font-body text-navy">{contact.subject}</td>
        <td className="px-3 py-3"><StatusBadge status={contact.status} /></td>
        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
          <Select value={contact.status} onValueChange={v => onStatusChange(contact.id, v)}>
            <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </td>
        <td className="px-3 py-3 text-muted-foreground">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={8} className="px-3 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-4 px-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-sky-border">
                  <div className="space-y-2">
                    <h4 className="font-body text-xs font-semibold text-navy">Message</h4>
                    <p className="font-body text-xs text-secondary whitespace-pre-wrap">{contact.message}</p>
                    <p className="font-body text-[10px] text-muted-foreground">Submitted: {formatDateTime(contact.created_at)}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-body text-xs font-semibold text-navy">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {contact.phone && (
                        <a
                          href={whatsAppLink(contact.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <Phone size={12} /> WhatsApp
                        </a>
                      )}
                      <a
                        href={mailtoLink(contact.email, contact.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-sky/10 text-sky text-xs font-medium hover:bg-sky/20 transition-colors"
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>

                  <div>
                    <NotesSection recordType="contact" recordId={contact.id} />
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Main Admin Page ── */

const Admin = () => {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tab, setTab] = useState<"leads" | "contacts">("leads");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase.rpc("is_admin", { _user_id: userId });
    setIsAdmin(data === true);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u ? { email: u.email } : null);
      if (u) checkAdminStatus(u.id);
      else setIsAdmin(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u ? { email: u.email } : null);
      if (u) checkAdminStatus(u.id).then(() => setLoading(false));
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    setRefreshing(true);
    const [leadsRes, contactsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    setRefreshing(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) toast.error(error.message);
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    toast.success("Status updated");
  };

  const updateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contacts").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast.success("Status updated");
  };

  const exportCSV = () => {
    const data = tab === "leads" ? leads : contacts;
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map(row => headers.map(h => `"${String((row as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const stats = useMemo(() => {
    const converted = leads.filter(l => l.status === "converted").length;
    return {
      total: leads.length,
      today: leads.filter(l => l.created_at.startsWith(todayStr)).length,
      week: leads.filter(l => l.created_at >= weekAgo).length,
      month: leads.filter(l => l.created_at >= monthAgo).length,
      converted,
      conversionRate: leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0,
      contactsTotal: contacts.length,
    };
  }, [leads, contacts, todayStr, weekAgo, monthAgo]);

  // Sort & filter
  const filterByStatus = <T extends { status: string }>(items: T[]) =>
    statusFilter === "all" ? items : items.filter(i => i.status === statusFilter);

  const sortedLeads = useMemo(() => {
    let filtered = filterByStatus(leads).filter(l =>
      !searchQuery || Object.values(l).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [leads, searchQuery, sortField, sortDir, statusFilter]);

  const sortedContacts = useMemo(() => {
    let filtered = filterByStatus(contacts).filter(c =>
      !searchQuery || Object.values(c).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [contacts, searchQuery, sortField, sortDir, statusFilter]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      onClick={() => toggleSort(field)}
      className="px-3 py-3 text-left font-body font-semibold text-navy cursor-pointer hover:text-sky whitespace-nowrap"
    >
      <span className="inline-flex items-center gap-1">{label} <ArrowUpDown size={12} /></span>
    </th>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-[75px]"><p className="font-body text-secondary">Loading...</p></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[75px] chess-grid-bg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-xl card-shadow border border-sky-border max-w-sm w-full mx-4">
          <h1 className="font-display text-2xl font-bold text-navy mb-6 text-center">Admin Login</h1>
          {user && !isAdmin && (
            <p className="font-body text-sm text-destructive mb-4 text-center">Access denied. Admin privileges required.</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Admin email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
            <Button type="submit" disabled={loginLoading} className="w-full cta-gold">
              <LogIn size={16} className="mr-2" />{loginLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[75px] min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">Admin Dashboard</h1>
            <p className="font-body text-sm text-secondary">Manage leads and contacts · {user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={refreshing}>
              <RefreshCw size={16} className={`mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, icon: <Users size={20} /> },
            { label: "Today", value: stats.today, icon: <TrendingUp size={20} /> },
            { label: "This Week", value: stats.week, icon: <TrendingUp size={20} /> },
            { label: "This Month", value: stats.month, icon: <Mail size={20} /> },
            { label: "Converted", value: stats.converted, icon: <TrendingUp size={20} /> },
            { label: "Conversion", value: `${stats.conversionRate}%`, icon: <TrendingUp size={20} /> },
          ].map((s, i) => (
            <div key={i} className="bg-card p-4 rounded-lg card-shadow border border-sky-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sky">{s.icon}</span>
                <span className="font-body text-xs text-secondary">{s.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["leads", "contacts"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearchQuery(""); setStatusFilter("all"); }}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-colors ${tab === t ? "bg-card text-navy card-shadow" : "text-secondary hover:text-navy"}`}
              >
                {t === "leads" ? "Leads" : "Contacts"} ({t === "leads" ? leads.length : contacts.length})
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="All statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={16} className="mr-1" /> Export CSV
          </Button>
        </div>

        {/* Results count */}
        <p className="font-body text-xs text-muted-foreground mb-2">
          Showing {tab === "leads" ? sortedLeads.length : tab === "contacts" ? sortedContacts.length : sortedEnrollments.length} of {tab === "leads" ? leads.length : tab === "contacts" ? contacts.length : enrollments.length} {tab}
        </p>

        {/* Leads Table */}
        {tab === "leads" && (
          <div className="bg-card rounded-xl card-shadow border border-sky-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-border bg-muted/50">
                  <SortHeader field="created_at" label="Date" />
                  <SortHeader field="parent_name" label="Parent" />
                  <SortHeader field="parent_email" label="Email" />
                  <SortHeader field="parent_phone" label="Phone" />
                  <SortHeader field="child_name" label="Child" />
                  <SortHeader field="child_age" label="Age" />
                  <SortHeader field="current_level" label="Level" />
                  <SortHeader field="preferred_language" label="Language" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Action</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map(lead => (
                  <LeadRow key={lead.id} lead={lead} onStatusChange={updateLeadStatus} />
                ))}
                {sortedLeads.length === 0 && (
                  <tr><td colSpan={11} className="px-3 py-8 text-center font-body text-secondary">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Contacts Table */}
        {tab === "contacts" && (
          <div className="bg-card rounded-xl card-shadow border border-sky-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-border bg-muted/50">
                  <SortHeader field="created_at" label="Date" />
                  <SortHeader field="name" label="Name" />
                  <SortHeader field="email" label="Email" />
                  <SortHeader field="phone" label="Phone" />
                  <SortHeader field="subject" label="Subject" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Action</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map(contact => (
                  <ContactRow key={contact.id} contact={contact} onStatusChange={updateContactStatus} />
                ))}
                {sortedContacts.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-8 text-center font-body text-secondary">No contacts found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Enrollments Table */}
        {tab === "enrollments" && (
          <div className="bg-card rounded-xl card-shadow border border-sky-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-border bg-muted/50">
                  <SortHeader field="created_at" label="Date" />
                  <SortHeader field="registration_number" label="Reg. No." />
                  <SortHeader field="student_name" label="Student" />
                  <SortHeader field="parent_name" label="Parent" />
                  <SortHeader field="plan" label="Plan" />
                  <SortHeader field="payment_type" label="Payment" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Action</th>
                  <th className="px-3 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {sortedEnrollments.map(enr => (
                  <EnrollmentRow key={enr.id} enrollment={enr} onStatusChange={updateEnrollmentStatus} />
                ))}
                {sortedEnrollments.length === 0 && (
                  <tr><td colSpan={9} className="px-3 py-8 text-center font-body text-secondary">No enrollments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
