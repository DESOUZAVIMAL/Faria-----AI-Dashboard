import React, { createContext, useContext, useState } from "react";

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
}

export interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  isUrgent: boolean;
  isImportant: boolean;
  aiReasoning: string;
}

export type MatrixItem = 
  | { type: "notification"; data: NotificationItem }
  | { type: "task"; data: Task };

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

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
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
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
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
    // Determine if it's a notification or a task
    if (id.startsWith("faria-notif-")) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isUrgent, isImportant } : n))
      );
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isUrgent, isImportant } : t))
      );
    }
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
