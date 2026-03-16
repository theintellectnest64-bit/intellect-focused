import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, Mail, TrendingUp, Download, LogIn, LogOut, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
type Contact = Tables<"contacts">;

const ADMIN_EMAIL = "theintellectnest64@gmail.com";

const Admin = () => {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tab, setTab] = useState<"leads" | "contacts">("leads");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u ? { email: u.email } : null);
      setIsAdmin(u?.email === ADMIN_EMAIL);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u ? { email: u.email } : null);
      setIsAdmin(u?.email === ADMIN_EMAIL);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    const [leadsRes, contactsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
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

  const stats = useMemo(() => ({
    total: leads.length,
    today: leads.filter(l => l.created_at.startsWith(todayStr)).length,
    week: leads.filter(l => l.created_at >= weekAgo).length,
    month: leads.filter(l => l.created_at >= monthAgo).length,
  }), [leads, todayStr, weekAgo, monthAgo]);

  // Sort & filter
  const sortedLeads = useMemo(() => {
    let filtered = leads.filter(l =>
      !searchQuery || Object.values(l).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [leads, searchQuery, sortField, sortDir]);

  const sortedContacts = useMemo(() => {
    let filtered = contacts.filter(c =>
      !searchQuery || Object.values(c).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [contacts, searchQuery, sortField, sortDir]);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-[75px]"><p className="font-body text-secondary">Loading...</p></div>;
  }

  // Login screen
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

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-sky/10 text-sky border-sky/30",
      contacted: "bg-gold/10 text-gold border-gold/30",
      converted: "bg-green-100 text-green-700 border-green-300",
      closed: "bg-muted text-muted-foreground border-border",
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${colors[status] || colors.new}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="pt-[75px] min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy">Admin Dashboard</h1>
            <p className="font-body text-sm text-secondary">Manage leads and contacts</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-1" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: stats.total, icon: <Users size={20} /> },
            { label: "Today", value: stats.today, icon: <TrendingUp size={20} /> },
            { label: "This Week", value: stats.week, icon: <TrendingUp size={20} /> },
            { label: "This Month", value: stats.month, icon: <Mail size={20} /> },
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
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["leads", "contacts"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearchQuery(""); }}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-colors ${tab === t ? "bg-card text-navy card-shadow" : "text-secondary hover:text-navy"}`}
              >
                {t === "leads" ? "Leads" : "Contacts"} ({t === "leads" ? leads.length : contacts.length})
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={16} className="mr-1" /> Export CSV
          </Button>
        </div>

        {/* Leads Table */}
        {tab === "leads" && (
          <div className="bg-card rounded-xl card-shadow border border-sky-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sky-border bg-muted/50">
                  {[
                    { key: "created_at", label: "Date" },
                    { key: "parent_name", label: "Parent" },
                    { key: "parent_email", label: "Email" },
                    { key: "parent_phone", label: "Phone" },
                    { key: "child_name", label: "Child" },
                    { key: "child_age", label: "Age" },
                    { key: "current_level", label: "Level" },
                    { key: "status", label: "Status" },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)} className="px-3 py-3 text-left font-body font-semibold text-navy cursor-pointer hover:text-sky whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">{col.label} <ArrowUpDown size={12} /></span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-sky-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3 font-body text-navy font-medium">{lead.parent_name}</td>
                    <td className="px-3 py-3 font-body text-secondary">{lead.parent_email}</td>
                    <td className="px-3 py-3 font-body text-secondary">{lead.parent_phone}</td>
                    <td className="px-3 py-3 font-body text-navy">{lead.child_name}</td>
                    <td className="px-3 py-3 font-body text-secondary">{lead.child_age}</td>
                    <td className="px-3 py-3 font-body text-secondary">{lead.current_level}</td>
                    <td className="px-3 py-3">{statusBadge(lead.status)}</td>
                    <td className="px-3 py-3">
                      <Select value={lead.status} onValueChange={v => updateLeadStatus(lead.id, v)}>
                        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {sortedLeads.length === 0 && (
                  <tr><td colSpan={9} className="px-3 py-8 text-center font-body text-secondary">No leads found</td></tr>
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
                  {[
                    { key: "created_at", label: "Date" },
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "subject", label: "Subject" },
                    { key: "status", label: "Status" },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)} className="px-3 py-3 text-left font-body font-semibold text-navy cursor-pointer hover:text-sky whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">{col.label} <ArrowUpDown size={12} /></span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Message</th>
                  <th className="px-3 py-3 text-left font-body font-semibold text-navy">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map(contact => (
                  <tr key={contact.id} className="border-b border-sky-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{new Date(contact.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3 font-body text-navy font-medium">{contact.name}</td>
                    <td className="px-3 py-3 font-body text-secondary">{contact.email}</td>
                    <td className="px-3 py-3 font-body text-navy">{contact.subject}</td>
                    <td className="px-3 py-3">{statusBadge(contact.status)}</td>
                    <td className="px-3 py-3 font-body text-secondary max-w-[200px] truncate">{contact.message}</td>
                    <td className="px-3 py-3">
                      <Select value={contact.status} onValueChange={v => updateContactStatus(contact.id, v)}>
                        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {sortedContacts.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center font-body text-secondary">No contacts found</td></tr>
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
