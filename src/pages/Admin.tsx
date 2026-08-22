import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Mail, TrendingUp, Download, LogIn, LogOut, ArrowUpDown, Search,
  ChevronDown, ChevronUp, MessageSquare, Phone, Globe, Send, Trash2,
  ExternalLink, RefreshCw, Copy, CalendarCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import EnrollmentPaymentPanel from "@/components/admin/EnrollmentPaymentPanel";

type Lead = Tables<"leads">;
type Contact = Tables<"contacts">;
type Enrollment = Tables<"enrollments">;

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

const DEMO_STATUS_OPTIONS = [
  { value: "not_scheduled", label: "Not scheduled" },
  { value: "scheduled", label: "Scheduled" },
  { value: "done", label: "Demo done" },
  { value: "no_show", label: "No show" },
  { value: "rescheduled", label: "Rescheduled" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "hot", label: "🔥 Hot" },
  { value: "normal", label: "Normal" },
  { value: "cold", label: "Cold" },
] as const;

const demoColors: Record<string, string> = {
  not_scheduled: "bg-muted text-muted-foreground border-border",
  scheduled: "bg-sky/10 text-sky border-sky/30",
  done: "bg-green-100 text-green-700 border-green-300",
  no_show: "bg-red-100 text-red-700 border-red-300",
  rescheduled: "bg-gold/10 text-gold border-gold/30",
};

const priorityColors: Record<string, string> = {
  hot: "bg-red-100 text-red-700 border-red-300",
  normal: "bg-muted text-muted-foreground border-border",
  cold: "bg-sky/10 text-sky border-sky/30",
};

const demoLabel = (v: string) =>
  DEMO_STATUS_OPTIONS.find(o => o.value === v)?.label ?? v;

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const statusColors: Record<string, string> = {
  new: "bg-sky/10 text-sky border-sky/30",
  contacted: "bg-gold/10 text-gold border-gold/30",
  converted: "bg-green-100 text-green-700 border-green-300",
  closed: "bg-muted text-muted-foreground border-border",
  "Pending Review": "bg-gold/10 text-gold border-gold/30",
  Verified: "bg-sky/10 text-sky border-sky/30",
  Active: "bg-green-100 text-green-700 border-green-300",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${statusColors[status] || statusColors.new}`}>
    {status}
  </span>
);

const DemoBadge = ({ demo }: { demo: string }) => (
  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${demoColors[demo] || demoColors.not_scheduled}`}>
    {demoLabel(demo)}
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

const LeadRow = ({ lead, onUpdate }: { lead: Lead; onUpdate: (id: string, patch: Partial<Lead>) => void }) => {
  const [expanded, setExpanded] = useState(false);

  const waMessage = (text: string) =>
    `${whatsAppLink(lead.parent_phone)}?text=${encodeURIComponent(text)}`;

  const templates = [
    {
      label: "Intro",
      text: `Hi ${lead.parent_name}, this is The Intellect Nest 👋 Thanks for your interest in chess classes for ${lead.child_name}. When would be a good time for a free demo class?`,
    },
    {
      label: "Demo link",
      text: `Hi ${lead.parent_name}, here is the link for ${lead.child_name}'s free demo class: https://www.tinchess.com/demo\nMeeting ID: 951 624 2285 · Passcode: 123456\nPlease join 5 minutes early.`,
    },
    {
      label: "Reminder",
      text: `Hi ${lead.parent_name}, gentle reminder for ${lead.child_name}'s free demo class today. Join here: https://www.tinchess.com/demo`,
    },
    {
      label: "Follow-up",
      text: `Hi ${lead.parent_name}, hope ${lead.child_name} enjoyed the demo class! Would you like me to share the batch options and pricing?`,
    },
  ];

  const copy = (text: string, what: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${what} copied`);
  };

  const overdue =
    lead.follow_up_at && lead.follow_up_at < new Date().toISOString().split("T")[0] && lead.status !== "converted";

  return (
    <>
      <tr
        className={`border-b border-sky-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${lead.priority === "hot" ? "bg-red-50/40" : ""} ${overdue ? "border-l-2 border-l-destructive" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Parent / Lead */}
        <td className="px-3 py-2.5">
          <div className="font-body text-navy font-medium leading-tight truncate max-w-[190px]">
            {lead.priority === "hot" && <span className="mr-1">🔥</span>}
            {lead.parent_name}
          </div>
          <div className="font-body text-[11px] text-muted-foreground leading-tight">{formatDate(lead.created_at)}</div>
        </td>

        {/* Child */}
        <td className="px-3 py-2.5">
          <div className="font-body text-navy leading-tight truncate max-w-[150px]">{lead.child_name}</div>
          <div className="font-body text-[11px] text-muted-foreground leading-tight">
            {lead.child_age} yrs · {lead.current_level}
          </div>
        </td>

        {/* Demo Status — most important */}
        <td className="px-2 py-2.5"><DemoBadge demo={lead.demo_status} /></td>

        {/* Demo date/time */}
        <td className="px-2 py-2.5 font-body text-xs text-secondary whitespace-nowrap">
          {lead.demo_scheduled_at ? formatDateTime(lead.demo_scheduled_at) : "—"}
        </td>

        {/* Follow-up */}
        <td className={`px-2 py-2.5 font-body text-xs whitespace-nowrap ${overdue ? "text-destructive font-semibold" : "text-secondary"}`}>
          {lead.follow_up_at ? formatDate(lead.follow_up_at) : "—"}
        </td>

        {/* Status */}
        <td className="px-2 py-2.5"><StatusBadge status={lead.status} /></td>

        {/* Actions */}
        <td className="px-2 py-2.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1 justify-end">
            <Select value={lead.demo_status} onValueChange={v => onUpdate(lead.id, { demo_status: v })}>
              <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEMO_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={lead.status} onValueChange={v => onUpdate(lead.id, { status: v })}>
              <SelectTrigger className="h-8 w-[104px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
              </SelectContent>
            </Select>
            <a
              href={waMessage(templates[0].text)}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <Phone size={14} />
            </a>
            <button
              type="button"
              title="Set follow-up in 2 days"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 2);
                onUpdate(lead.id, { follow_up_at: d.toISOString().split("T")[0] });
              }}
              className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-md bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
            >
              <CalendarCheck size={14} />
            </button>
            <button
              type="button"
              title={expanded ? "Collapse" : "Expand details"}
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center justify-center h-8 w-7 shrink-0 rounded-md text-muted-foreground hover:text-navy transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </td>
      </tr>

      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={7} className="px-3 py-0">
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
                    <h4 className="font-body text-xs font-semibold text-navy">Lead Details</h4>
                    <div className="space-y-1">
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Parent:</span> {lead.parent_name}</p>
                      <p className="font-body text-xs text-secondary break-all"><span className="text-muted-foreground">Email:</span> {lead.parent_email}</p>
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Phone:</span> {lead.parent_phone}</p>
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Child:</span> {lead.child_name}</p>
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Age:</span> {lead.child_age}</p>
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Level:</span> {lead.current_level}</p>
                      <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Language:</span> {lead.preferred_language}</p>
                      {lead.source && (
                        <p className="font-body text-xs text-secondary"><span className="text-muted-foreground">Source:</span> {lead.source}</p>
                      )}
                      <p className="font-body text-xs text-secondary">
                        <span className="text-muted-foreground">Submitted:</span> {formatDateTime(lead.created_at)}
                      </p>
                      {lead.message && (
                        <p className="font-body text-xs text-secondary">
                          <span className="text-muted-foreground">Message:</span> {lead.message}
                        </p>
                      )}
                    </div>


                    <h4 className="font-body text-xs font-semibold text-navy pt-2">Demo Tracking</h4>
                    <div className="space-y-2">
                      <label className="block font-body text-[11px] text-muted-foreground">
                        Demo date & time
                        <Input
                          type="datetime-local"
                          value={toLocalInput(lead.demo_scheduled_at)}
                          onChange={e =>
                            onUpdate(lead.id, {
                              demo_scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                              demo_status: lead.demo_status === "not_scheduled" && e.target.value ? "scheduled" : lead.demo_status,
                            })
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </label>
                      <label className="block font-body text-[11px] text-muted-foreground">
                        Next follow-up
                        <Input
                          type="date"
                          value={lead.follow_up_at ?? ""}
                          onChange={e => onUpdate(lead.id, { follow_up_at: e.target.value || null })}
                          className="h-8 text-xs mt-1"
                        />
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-[11px] text-muted-foreground">Priority</span>
                        <Select value={lead.priority} onValueChange={v => onUpdate(lead.id, { priority: v })}>
                          <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${priorityColors[lead.priority] || priorityColors.normal}`}>
                          {lead.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-body text-xs font-semibold text-navy">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${lead.parent_phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-navy/5 text-navy text-xs font-medium hover:bg-navy/10 transition-colors"
                      >
                        <Phone size={12} /> Call
                      </a>
                      <a
                        href={mailtoLink(lead.parent_email, lead.parent_name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-sky/10 text-sky text-xs font-medium hover:bg-sky/20 transition-colors"
                      >
                        <Mail size={12} /> Email
                      </a>
                      <button
                        onClick={() => copy(lead.parent_phone, "Phone")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-secondary text-xs font-medium hover:bg-muted/70 transition-colors"
                      >
                        <Copy size={12} /> Phone
                      </button>
                      <button
                        onClick={() => copy(lead.parent_email, "Email")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-muted text-secondary text-xs font-medium hover:bg-muted/70 transition-colors"
                      >
                        <Copy size={12} /> Email
                      </button>
                      <a
                        href={`/harshit-enrollment?plan=&lead=${lead.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                      >
                        <ExternalLink size={12} /> Enroll
                      </a>
                    </div>

                    <h4 className="font-body text-xs font-semibold text-navy pt-2">WhatsApp Templates</h4>
                    <div className="flex flex-wrap gap-2">
                      {templates.map(t => (
                        <a
                          key={t.label}
                          href={waMessage(t.text)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <MessageSquare size={12} /> {t.label}
                        </a>
                      ))}
                    </div>

                    <h4 className="font-body text-xs font-semibold text-navy pt-2">Mark</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => onUpdate(lead.id, { demo_status: "done", status: lead.status === "new" ? "contacted" : lead.status })}>
                        Demo done
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => onUpdate(lead.id, { demo_status: "no_show" })}>
                        No show
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => onUpdate(lead.id, { status: "converted" })}>
                        Converted
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 2);
                          onUpdate(lead.id, { follow_up_at: d.toISOString().split("T")[0] });
                        }}>
                        Follow up +2d
                      </Button>
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

/* ── Expandable Enrollment Row ── */

const ENROLLMENT_STATUS_OPTIONS = ["Pending Review", "Verified", "Active"] as const;

const EnrollmentRow = ({ enrollment: e, onStatusChange, onPatch }: { enrollment: Enrollment; onStatusChange: (id: string, status: string) => void; onPatch: (id: string, patch: Partial<Enrollment>) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);

  const openProof = async () => {
    if (!e.payment_proof_url) return;
    setProofLoading(true);
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(e.payment_proof_url, 300);
    setProofLoading(false);
    if (error || !data) { toast.error("Could not open payment proof"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const Detail = ({ label, value }: { label: string; value?: string | null }) =>
    value ? <p className="font-body text-xs text-secondary"><span className="text-navy font-semibold">{label}:</span> {value}</p> : null;

  return (
    <>
      <tr
        className="border-b border-sky-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{formatDate(e.created_at)}</td>
        <td className="px-3 py-3 font-body text-navy font-semibold whitespace-nowrap">{e.registration_number}</td>
        <td className="px-3 py-3 font-body text-navy">{e.student_name}</td>
        <td className="px-3 py-3 font-body text-secondary">{e.parent_name}</td>
        <td className="px-3 py-3 font-body text-secondary">{e.plan}</td>
        <td className="px-3 py-3 font-body text-secondary whitespace-nowrap">{e.payment_type}</td>
        <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
        <td className="px-3 py-3" onClick={ev => ev.stopPropagation()}>
          <Select value={e.status} onValueChange={v => onStatusChange(e.id, v)}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ENROLLMENT_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
            <td colSpan={9} className="px-3 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-4 px-2 grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-sky-border">
                  <div className="space-y-1">
                    <h4 className="font-body text-xs font-semibold text-navy mb-1">Student &amp; Plan</h4>
                    <Detail label="Date of birth" value={e.student_dob} />
                    <Detail label="Plan" value={e.plan} />
                    <Detail label="Custom request" value={e.custom_plan_note} />
                    <Detail label="Rubik's add-on" value={e.rubiks_addon ? "Yes" : "No"} />
                    <Detail label="Coach" value={e.preferred_coach} />
                    <Detail label="Time zone" value={e.preferred_timezone} />
                    <Detail label="Chess ID" value={e.chess_id} />
                    <Detail label="Counsellor" value={e.student_counsellor} />
                    <Detail label="Notes" value={e.notes} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-body text-xs font-semibold text-navy mb-1">Contact</h4>
                    <Detail label="Email" value={e.email} />
                    <Detail label="Phone" value={e.phone} />
                    <Detail label="Guardian WhatsApp" value={e.guardian_whatsapp} />
                    <Detail label="Student WhatsApp" value={e.student_whatsapp} />
                    <Detail label="Alternate" value={e.alternate_phone} />
                    <Detail label="Location" value={[e.city, e.state, e.country].filter(Boolean).join(", ")} />
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={whatsAppLink(e.guardian_whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                      >
                        <Phone size={12} /> WhatsApp
                      </a>
                      <a
                        href={mailtoLink(e.email, e.parent_name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-sky/10 text-sky text-xs font-medium hover:bg-sky/20 transition-colors"
                      >
                        <Mail size={12} /> Email
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-body text-xs font-semibold text-navy mb-1">Payment</h4>
                    <Detail label="Type" value={e.payment_type} />
                    <Detail label="Balance" value={e.balance_amount} />
                    <Detail label="Date" value={e.payment_date} />
                    <Detail label="Transaction ID" value={e.transaction_id} />
                    <Detail label="Note" value={e.payment_note} />
                    {e.payment_proof_url && (
                      <button
                        type="button"
                        onClick={openProof}
                        disabled={proofLoading}
                        className="inline-flex items-center gap-1 px-3 py-1.5 mt-2 rounded-md bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                      >
                        <ExternalLink size={12} /> {proofLoading ? "Opening..." : "View payment proof"}
                      </button>
                    )}
                    <p className="font-body text-[10px] text-muted-foreground pt-2">Submitted: {formatDateTime(e.created_at)}</p>
                  </div>

                  <div>
                    <NotesSection recordType="enrollment" recordId={e.id} />
                  </div>
                </div>
                <div className="pb-4 px-2">
                  <EnrollmentPaymentPanel enrollment={e} onUpdated={patch => onPatch(e.id, patch)} />
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
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [tab, setTab] = useState<"leads" | "contacts" | "enrollments">("leads");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [demoFilter, setDemoFilter] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"none" | "hot" | "followup" | "today_demo" | "no_demo">("none");

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
    const [leadsRes, contactsRes, enrollmentsRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) setLeads(leadsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
    if (enrollmentsRes.data) setEnrollments(enrollmentsRes.data);
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

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    const { error } = await supabase.from("leads").update(patch as never).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
    toast.success("Lead updated");
  };


  const updateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contacts").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    toast.success("Status updated");
  };

  const updateEnrollmentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enrollments").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    toast.success("Status updated");
  };

  const patchEnrollment = (id: string, patch: Partial<Enrollment>) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  };

  const exportCSV = () => {
    const data: Record<string, unknown>[] = tab === "leads" ? leads : tab === "contacts" ? contacts : enrollments;
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
    const demoDone = leads.filter(l => l.demo_status === "done").length;
    const demoScheduled = leads.filter(l => l.demo_status === "scheduled" || l.demo_status === "rescheduled").length;
    const demoPending = leads.filter(l => l.demo_status === "not_scheduled").length;
    const noShow = leads.filter(l => l.demo_status === "no_show").length;
    const followUpDue = leads.filter(l => l.follow_up_at && l.follow_up_at <= todayStr && l.status !== "converted").length;
    const hot = leads.filter(l => l.priority === "hot").length;
    return {
      total: leads.length,
      today: leads.filter(l => l.created_at.startsWith(todayStr)).length,
      week: leads.filter(l => l.created_at >= weekAgo).length,
      month: leads.filter(l => l.created_at >= monthAgo).length,
      converted,
      conversionRate: leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0,
      contactsTotal: contacts.length,
      demoDone,
      demoScheduled,
      demoPending,
      noShow,
      followUpDue,
      hot,
      demoToEnroll: demoDone > 0 ? Math.round((converted / demoDone) * 100) : 0,
    };
  }, [leads, contacts, todayStr, weekAgo, monthAgo]);

  // Sort & filter
  const filterByStatus = <T extends { status: string }>(items: T[]) =>
    statusFilter === "all" ? items : items.filter(i => i.status === statusFilter);

  const sortedLeads = useMemo(() => {
    let filtered = filterByStatus(leads).filter(l =>
      !searchQuery || Object.values(l).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (demoFilter !== "all") filtered = filtered.filter(l => l.demo_status === demoFilter);
    if (quickFilter === "hot") filtered = filtered.filter(l => l.priority === "hot");
    if (quickFilter === "followup") filtered = filtered.filter(l => l.follow_up_at && l.follow_up_at <= todayStr && l.status !== "converted");
    if (quickFilter === "today_demo") filtered = filtered.filter(l => l.demo_scheduled_at?.slice(0, 10) === todayStr);
    if (quickFilter === "no_demo") filtered = filtered.filter(l => l.demo_status === "not_scheduled");
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [leads, searchQuery, sortField, sortDir, statusFilter, demoFilter, quickFilter, todayStr]);


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

  const sortedEnrollments = useMemo(() => {
    const filtered = (statusFilter === "all" ? enrollments : enrollments.filter(e => e.status === statusFilter))
      .filter(e => !searchQuery || Object.values(e).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase())));
    return filtered.sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [enrollments, searchQuery, sortField, sortDir, statusFilter]);

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
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

        {/* Demo pipeline stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Demo Done", value: stats.demoDone, icon: <CalendarCheck size={20} /> },
            { label: "Demo Scheduled", value: stats.demoScheduled, icon: <CalendarCheck size={20} /> },
            { label: "Demo Pending", value: stats.demoPending, icon: <CalendarCheck size={20} /> },
            { label: "No Shows", value: stats.noShow, icon: <CalendarCheck size={20} /> },
            { label: "Follow-ups Due", value: stats.followUpDue, icon: <MessageSquare size={20} /> },
            { label: "Demo → Enroll", value: `${stats.demoToEnroll}%`, icon: <TrendingUp size={20} /> },
          ].map((s, i) => (
            <div key={i} className="bg-card p-4 rounded-lg card-shadow border border-sky-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gold">{s.icon}</span>
                <span className="font-body text-xs text-secondary">{s.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-navy">{s.value}</p>
            </div>
          ))}
        </div>


        {/* Tabs + Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["leads", "contacts", "enrollments"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearchQuery(""); setStatusFilter("all"); setDemoFilter("all"); setQuickFilter("none"); }}
                className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-colors ${tab === t ? "bg-card text-navy card-shadow" : "text-secondary hover:text-navy"}`}
              >
                {t === "leads" ? "Leads" : t === "contacts" ? "Contacts" : "Enrollments"} ({t === "leads" ? leads.length : t === "contacts" ? contacts.length : enrollments.length})
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
              {tab === "enrollments"
                ? ENROLLMENT_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)
                : STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          {tab === "leads" && (
            <Select value={demoFilter} onValueChange={setDemoFilter}>
              <SelectTrigger className="w-36 h-9 text-xs"><SelectValue placeholder="All demos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Demos</SelectItem>
                {DEMO_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={16} className="mr-1" /> Export CSV
          </Button>
        </div>

        {/* Quick filters */}
        {tab === "leads" && (
          <div className="flex flex-wrap gap-2 mb-3">
            {([
              { key: "none", label: "All leads" },
              { key: "hot", label: `🔥 Hot (${stats.hot})` },
              { key: "followup", label: `Follow-ups due (${stats.followUpDue})` },
              { key: "today_demo", label: "Demo today" },
              { key: "no_demo", label: `Demo not scheduled (${stats.demoPending})` },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setQuickFilter(f.key)}
                className={`px-3 py-1.5 rounded-full font-body text-xs font-medium border transition-colors ${
                  quickFilter === f.key
                    ? "bg-navy text-white border-navy"
                    : "bg-card text-secondary border-sky-border hover:text-navy"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}


        {/* Results count */}
        <p className="font-body text-xs text-muted-foreground mb-2">
          Showing {tab === "leads" ? sortedLeads.length : tab === "contacts" ? sortedContacts.length : sortedEnrollments.length} of {tab === "leads" ? leads.length : tab === "contacts" ? contacts.length : enrollments.length} {tab}
        </p>

        {/* Leads Table */}
        {tab === "leads" && (
          <div className="bg-card rounded-xl card-shadow border border-sky-border">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[19%]" />
                <col className="w-[15%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[9%]" />
                <col className="w-[9%]" />
                <col className="w-[25%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-sky-border bg-muted/50">
                  <SortHeader field="parent_name" label="Parent / Lead" />
                  <SortHeader field="child_name" label="Child" />
                  <SortHeader field="demo_status" label="Demo" />
                  <SortHeader field="demo_scheduled_at" label="Demo On" />
                  <SortHeader field="follow_up_at" label="Follow-up" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-2 py-3 text-right font-body font-semibold text-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map(lead => (
                  <LeadRow key={lead.id} lead={lead} onUpdate={updateLead} />
                ))}
                {sortedLeads.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-8 text-center font-body text-secondary">No leads found</td></tr>
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
                  <EnrollmentRow key={enr.id} enrollment={enr} onStatusChange={updateEnrollmentStatus} onPatch={patchEnrollment} />
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
