import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  isSheetConfigured,
  isConnected as sheetIsConnected,
  connect as connectSheet,
  fetchSheetRows,
  pushStatus,
  SheetRow,
} from "./sheetService";

export enum AICategory {
  Urgent = "Urgent",
  ActionRequired = "Action Required",
  FYI = "FYI",
}

export interface NotificationItem {
  id: string;
  title: string;
  source: string;
  time: string;
  aiCategory: AICategory;
  isRead: boolean;
  summary: string;
  isUrgent: boolean;
  isImportant: boolean;
  aiReasoning: string;
  // Optional fields populated when the item comes from the Google Sheet
  action?: string;
  dueDate?: string;
  ticketId?: string;
  link?: string;
  rowIndex?: number;
}

export type DataSource = "demo" | "live";

/*
  Map the Gem's Eisenhower category string onto the dashboard's urgent/important
  flags + AICategory. The Gem emits three buckets:
    "Urgent & Important"   → Q1 (urgent + important)
    "Important, Not Urgent"→ Q2 (important only)
    "FYI / Read Later"     → Q4 (neither)
  Matching is done loosely (lowercase, substring) so small wording drift is safe.
*/
function categoryToFlags(raw: string): { cat: AICategory; isUrgent: boolean; isImportant: boolean } {
  const c = (raw || "").toLowerCase();
  if (c.includes("fyi") || c.includes("read later")) {
    return { cat: AICategory.FYI, isUrgent: false, isImportant: false };
  }
  // Negations checked explicitly so "Not Important" / "Not Urgent" don't false-match.
  const isImportant = c.includes("important") && !c.includes("not important");
  const isUrgent = c.includes("urgent") && !c.includes("not urgent");
  let cat: AICategory;
  if (isUrgent && isImportant) cat = AICategory.Urgent;
  else if (isImportant || isUrgent) cat = AICategory.ActionRequired;
  else cat = AICategory.FYI;
  return { cat, isUrgent, isImportant };
}

/* Read a cell from a Sheet row, trying several header aliases in order. */
function cell(row: SheetRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function priorityFromRow(
  row: SheetRow,
  isUrgent: boolean,
  isImportant: boolean
): "High" | "Medium" | "Low" {
  const p = cell(row, "Priority").toLowerCase();
  if (p.includes("high")) return "High";
  if (p.includes("med")) return "Medium";
  if (p.includes("low")) return "Low";
  if (isUrgent && isImportant) return "High";
  if (isUrgent || isImportant) return "Medium";
  return "Low";
}

/* Convert one Sheet row (keyed by header name) into a dashboard NotificationItem. */
function mapRowToNotification(row: SheetRow): NotificationItem {
  const get = (...keys: string[]): string => cell(row, ...keys);

  const rawCategory = get("Category");
  const { cat, isUrgent, isImportant } = categoryToFlags(rawCategory);
  const summary = get("Summary");
  const action = get("Action");
  const statusRaw = get("Status");

  // Defensive clamp: a mis-mapped column (e.g. full email body in Subject/Source)
  // must never blow up a compact card slot.
  const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);

  // A real source is a short label ("Gmail", "Zendesk"). If it's a paragraph, the
  // column was mis-mapped to body text — fall back to a generic label.
  const rawSource = get("Source", "Branch");
  const source = rawSource && rawSource.length <= 24 ? rawSource : "Email";

  const subject = get("Subject", "Title");
  const title = clamp(subject || summary || `[${source}] New item`, 120);

  return {
    id: `sheet-${row._row}`,
    title,
    source,
    time: clamp(get("Timestamp", "Time", "DueDate"), 40),
    aiCategory: cat,
    isRead: /done|read|complete|archiv/i.test(statusRaw),
    summary: clamp(summary || action || "No summary provided.", 600),
    isUrgent,
    isImportant,
    aiReasoning:
      get("Reasoning", "AI Reasoning") ||
      (action
        ? `AI: Action required — ${action}`
        : `AI: Categorised as "${rawCategory || "Uncategorised"}".`),
    action: action || undefined,
    dueDate: get("DueDate") || undefined,
    ticketId: get("TicketID", "ID") || undefined,
    link: get("Link", "URL") || undefined,
    rowIndex: row._row,
  };
}

/*
  Rows that carry an Action item also become a to-do in the Tasks panel.
  Returns null for rows with no action (those stay inbox-only).
*/
function mapRowToTask(row: SheetRow): Task | null {
  const action = cell(row, "Action");
  if (!action) return null;
  const { isUrgent, isImportant } = categoryToFlags(cell(row, "Category"));
  const source = cell(row, "Source", "Branch") || "email";
  return {
    id: `sheet-task-${row._row}`,
    title: action,
    priority: priorityFromRow(row, isUrgent, isImportant),
    completed: /done|complete/i.test(cell(row, "Status")),
    isUrgent,
    isImportant,
    aiReasoning:
      cell(row, "Reasoning", "AI Reasoning") || `AI: Action extracted from ${source}.`,
    rowIndex: row._row,
  };
}

/*
  Pull every important date out of a row: the `KeyDates` column (a JSON array of
  { date, label }) plus the single `DueDate`. Returns them de-duplicated.
*/
function parseKeyDates(row: SheetRow): KeyDate[] {
  const source = cell(row, "Source", "Branch") || "Email";
  const sourceTitle = cell(row, "Subject", "Title") || cell(row, "Summary").slice(0, 60);
  const link = cell(row, "Link", "URL") || undefined;
  const out: KeyDate[] = [];
  const seen = new Set<string>();
  const add = (date: string, label: string, key: string) => {
    if (!date || seen.has(`${date}|${key}`)) return;
    seen.add(`${date}|${key}`);
    out.push({ id: `${row._row}-${out.length}`, date, label: label || sourceTitle || "Important date", source, sourceTitle, link });
  };

  const raw = cell(row, "KeyDates", "Dates");
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((d: { date?: string; Date?: string; label?: string; Label?: string; what?: string }) => {
          const date = normalizeDate(String(d.date || d.Date || ""));
          const label = String(d.label || d.Label || d.what || "").trim();
          add(date, label, label);
        });
      }
    } catch {
      // Not JSON — fall through; DueDate below still works.
    }
  }

  const due = normalizeDate(cell(row, "DueDate"));
  if (due) add(due, cell(row, "Action") || sourceTitle, "duedate");

  return out;
}

/* A few upcoming dates so the panel looks alive in demo mode (relative to today). */
function demoKeyDates(): KeyDate[] {
  const mk = (days: number, label: string, source: string): KeyDate => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return { id: `demo-${days}`, date: d.toISOString().slice(0, 10), label, source, sourceTitle: label };
  };
  return [
    mk(0, "Confirm RSVP: Global academic standards webinar", "Calendar"),
    mk(3, "Q3 IB diploma templates — feedback due", "Slack"),
    mk(9, "SSL certificate manual renewal deadline", "Email"),
    mk(21, "DFES 2026/27 compliance review", "Email"),
  ];
}

export interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  isUrgent: boolean;
  isImportant: boolean;
  aiReasoning: string;
  rowIndex?: number;
}

export type MatrixItem =
  | { type: "notification"; data: NotificationItem }
  | { type: "task"; data: Task };

/* Normalise a cell value to YYYY-MM-DD, or "" if it isn't a real date. */
function normalizeDate(raw: string): string {
  const s = (raw || "").trim();
  if (!s || /immediate|asap|n\/?a|none/i.test(s)) return "";
  const iso = s.match(/\d{4}-\d{2}-\d{2}/);
  if (iso) return iso[0];
  const d = new Date(s);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/* An important date mentioned in an email (deadline, event, form due date…). */
export interface KeyDate {
  id: string;
  date: string; // YYYY-MM-DD
  label: string; // what the date is for
  source: string; // Gmail / Zendesk / …
  sourceTitle?: string; // the email it came from
  link?: string; // deep link back to that email
}

interface DashboardContextType {
  userName: string;
  notifications: NotificationItem[];
  tasks: Task[];
  isSorting: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, priority: "High" | "Medium" | "Low") => void;
  deleteTask: (id: string) => void;
  autoSortInbox: () => Promise<void>;
  resetStream: () => void;
  resetDemo: () => void;
  updateItemMatrix: (id: string, isUrgent: boolean, isImportant: boolean) => void;
  quadrantCounts: { q1: number; q2: number; q3: number; q4: number };
  keyDates: KeyDate[];
  dataSource: DataSource;
  isLoading: boolean;
  refresh: () => Promise<void>;
  sheetConfigured: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "faria-notif-1",
    title: "Database latency threshold exceeded during peak Europe sync",
    source: "ManageBac+",
    time: "12m ago",
    aiCategory: AICategory.Urgent,
    isRead: false,
    summary: "A brief replication backlog was detected on our primary European nodes. We have scaled the subscriber capacity. Action: Monitor the synchronisation metrics over the next hour to ensure stability.",
    isUrgent: true,
    isImportant: true,
    aiReasoning: "AI: Server latency directly impacts EU partner schools and requires instant capacity scaling."
  },
  {
    id: "faria-notif-2",
    title: "Sarah Jenkins: Feedback requested on international curriculum plan",
    source: "Slack",
    time: "32m ago",
    aiCategory: AICategory.ActionRequired,
    isRead: false,
    summary: "Sarah is seeking final reviews on the Q3 IB diploma templates prior to our 5:00 PM team synchronisation. Please append your notes to the shared document.",
    isUrgent: true,
    isImportant: false,
    aiReasoning: "AI: Team sync is at 5:00 PM; Sarah Jenkins requires input on Q3 templates before then."
  },
  {
    id: "faria-notif-3",
    title: "Urgent: SSL certificate renewals failing for partner school portals",
    source: "Email",
    time: "45m ago",
    aiCategory: AICategory.Urgent,
    isRead: false,
    summary: "Automatic certificate updates have failed for three major academy trust domains. Action: Trigger manual Let's Encrypt renewal protocols immediately to avoid user access downtime.",
    isUrgent: true,
    isImportant: true,
    aiReasoning: "AI: SSL failure is causing access downtime for three major academy trust domains."
  },
  {
    id: "faria-notif-7",
    title: "Zendesk #4019: Critical SSO outage on production sandbox",
    source: "Zendesk",
    time: "50m ago",
    aiCategory: AICategory.Urgent,
    isRead: false,
    summary: "Single Sign-On has failed for sandbox environments, blocking key partner schools. Immediate investigation required.",
    isUrgent: true,
    isImportant: true,
    aiReasoning: "AI: Zendesk ticket specifies sandbox SSO is completely down, blocking integration partners."
  },
  {
    id: "faria-notif-4",
    title: "Global academic standards webinar moved to 2:30 PM",
    source: "Calendar",
    time: "2h ago",
    aiCategory: AICategory.ActionRequired,
    isRead: false,
    summary: "The mid-quarter alignment panel was rescheduled. Action: Please confirm your slot availability and update your RSVP response in the calendar system.",
    isUrgent: false,
    isImportant: true,
    aiReasoning: "AI: Calendar slot rescheduled. Immediate RSVP confirmation needed."
  },
  {
    id: "faria-notif-5",
    title: "Weekly school system backup verified successfully",
    source: "ManageBac+",
    time: "5h ago",
    aiCategory: AICategory.FYI,
    isRead: true,
    summary: "All automated snapshots of regional academic databases have been compiled, validated, and compressed into our secure, off-site storage archive.",
    isUrgent: false,
    isImportant: false,
    aiReasoning: "AI: Automatic confirmation of completed scheduled weekly routine backup."
  },
  {
    id: "faria-notif-6",
    title: "New DFES compliance guidelines published for 2026/27",
    source: "Email",
    time: "1d ago",
    aiCategory: AICategory.FYI,
    isRead: true,
    summary: "An overview of the upcoming UK national curriculum framework changes. Useful reading for product teams preparing mid-year platform updates.",
    isUrgent: false,
    isImportant: true,
    aiReasoning: "AI: Long-term reference document of national curriculum framework updates."
  },
  {
    id: "faria-notif-8",
    title: "Slack: Wish Vimal a Happy Birthday! 🎉",
    source: "Slack",
    time: "1d ago",
    aiCategory: AICategory.FYI,
    isRead: true,
    summary: "Don't forget to congratulate Vimal on his birthday today in the general channel.",
    isUrgent: false,
    isImportant: false,
    aiReasoning: "AI: Social event message with no immediate deadline or critical impact."
  }
];

const INITIAL_TASKS: Task[] = [
  { id: "task-1", title: "Review categorised admissions stream", priority: "High", completed: false, isUrgent: true, isImportant: true, aiReasoning: "AI: High priority item requested by admission coordinators for review." },
  { id: "task-2", title: "Prepare agenda for global curriculum sync", priority: "Medium", completed: true, isUrgent: false, isImportant: true, aiReasoning: "AI: Agenda needed for the upcoming curriculum synchronization meeting." },
  { id: "task-3", title: "Proofread academic brochure drafts", priority: "Low", completed: false, isUrgent: false, isImportant: false, aiReasoning: "AI: Basic review of informational brochures with no strict deadline." },
  { id: "task-4", title: "Respond to critical platform migration ticket", priority: "High", completed: false, isUrgent: true, isImportant: true, aiReasoning: "AI: Relates to a critical infrastructure migration ticket." },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [userName] = useState("Vimal");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isSorting, setIsSorting] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>("demo");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [keyDates, setKeyDates] = useState<KeyDate[]>(demoKeyDates());

  /*
    Pull live rows from the connected Google Sheet. Only runs once the user is
    signed in (so it never triggers a surprise popup); falls back to demo data
    when the Sheet is empty or errors — the dashboard always shows something.
  */
  const refresh = useCallback(async () => {
    if (!isSheetConfigured() || !sheetIsConnected()) return;
    setIsLoading(true);
    try {
      const rows = await fetchSheetRows();
      const mapped = rows
        .map(mapRowToNotification)
        .filter((n) => n.title && n.title !== "[Email] New item");
      if (mapped.length) {
        setNotifications(mapped);
        // Rows with an Action become to-dos in the Tasks panel.
        setTasks(rows.map(mapRowToTask).filter((t): t is Task => t !== null));
        // Collect important dates across all rows, sorted soonest-first.
        setKeyDates(rows.flatMap(parseKeyDates).sort((a, b) => a.date.localeCompare(b.date)));
        setDataSource("live");
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
        setKeyDates(demoKeyDates());
        setDataSource("demo");
      }
    } catch (err) {
      console.error("[Dashboard] Sheet load failed, showing demo data:", err);
      setDataSource("demo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ask the user to sign in (opens the Google consent popup), then load.
  const connect = useCallback(async () => {
    if (!isSheetConfigured()) return;
    await connectSheet(true);
    setIsConnected(true);
  }, []);

  // On mount, try a SILENT reconnect (works if the user already granted access
  // this session) so returning users skip the button.
  useEffect(() => {
    if (!isSheetConfigured()) return;
    connectSheet(false)
      .then(() => setIsConnected(true))
      .catch(() => {/* first-time / expired — user must click Connect */});
  }, []);

  // Once connected, load immediately and poll so new triaged emails appear.
  useEffect(() => {
    if (!isConnected) return;
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [isConnected, refresh]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const next = { ...n, isRead: !n.isRead };
        // Reflect the change back into the Sheet's Status column when this is a live row.
        if (n.rowIndex) pushStatus(n.rowIndex, next.isRead ? "Done" : "New");
        return next;
      })
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, completed: !t.completed };
        if (t.rowIndex) pushStatus(t.rowIndex, next.completed ? "Done" : "New");
        return next;
      })
    );
  };

  const addTask = (title: string, priority: "High" | "Medium" | "Low") => {
    const isUrgent = priority === "High";
    const isImportant = priority === "High" || priority === "Medium";
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      priority,
      completed: false,
      isUrgent,
      isImportant,
      aiReasoning: `AI: User task created manually with ${priority} priority.`
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const autoSortInbox = async () => {
    if (isSorting) return;
    setIsSorting(true);
    
    // Simulate a 1-second AI calculation latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setNotifications((prev) => {
      // Sort priority order: Urgent first, then Action Required, then FYI
      const order = {
        [AICategory.Urgent]: 1,
        [AICategory.ActionRequired]: 2,
        [AICategory.FYI]: 3,
      };

      return [...prev].sort((a, b) => {
        // Unread items should also bubble up relative to read items
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1;
        }
        return order[a.aiCategory] - order[b.aiCategory];
      });
    });

    setIsSorting(false);
  };

  const resetStream = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const resetDemo = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setTasks(INITIAL_TASKS);
  };

  const updateItemMatrix = (id: string, isUrgent: boolean, isImportant: boolean) => {
    // Update whichever collection holds this id (works for both demo and sheet ids).
    setNotifications((prev) =>
      prev.some((n) => n.id === id)
        ? prev.map((n) => (n.id === id ? { ...n, isUrgent, isImportant } : n))
        : prev
    );
    setTasks((prev) =>
      prev.some((t) => t.id === id)
        ? prev.map((t) => (t.id === id ? { ...t, isUrgent, isImportant } : t))
        : prev
    );
  };

  const q1Count = notifications.filter((n) => n.isUrgent && n.isImportant).length + tasks.filter((t) => t.isUrgent && t.isImportant).length;
  const q2Count = notifications.filter((n) => !n.isUrgent && n.isImportant).length + tasks.filter((t) => !t.isUrgent && t.isImportant).length;
  const q3Count = notifications.filter((n) => n.isUrgent && !n.isImportant).length + tasks.filter((t) => t.isUrgent && !t.isImportant).length;
  const q4Count = notifications.filter((n) => !n.isUrgent && !n.isImportant).length + tasks.filter((t) => !t.isUrgent && !t.isImportant).length;

  const quadrantCounts = {
    q1: q1Count,
    q2: q2Count,
    q3: q3Count,
    q4: q4Count
  };

  return (
    <DashboardContext.Provider
      value={{
        userName,
        notifications,
        tasks,
        isSorting,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        toggleTask,
        addTask,
        deleteTask,
        autoSortInbox,
        resetStream,
        resetDemo,
        updateItemMatrix,
        quadrantCounts,
        keyDates,
        dataSource,
        isLoading,
        refresh,
        sheetConfigured: isSheetConfigured(),
        isConnected,
        connect,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
