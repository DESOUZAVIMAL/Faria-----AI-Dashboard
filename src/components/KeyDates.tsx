import React from "react";
import { CalendarClock, ExternalLink, AlarmClock } from "lucide-react";
import { useDashboard, KeyDate } from "../lib/DashboardContext";

/* Days from today (local) to a YYYY-MM-DD date; negative = overdue. */
function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function bucketOf(days: number): { label: string; tone: string; dot: string } {
  if (days < 0) return { label: "Overdue", tone: "text-red-300 border-red-500/30 bg-red-500/10", dot: "bg-red-400" };
  if (days === 0) return { label: "Today", tone: "text-[#E837AC] border-[#E837AC]/30 bg-[#E837AC]/10", dot: "bg-[#E837AC]" };
  if (days <= 7) return { label: "This week", tone: "text-[#F78843] border-[#F78843]/30 bg-[#F78843]/10", dot: "bg-[#F78843]" };
  return { label: "Later", tone: "text-white/70 border-white/15 bg-white/5", dot: "bg-[#F7D35F]" };
}

function fmt(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function relative(days: number): string {
  if (days < 0) return `${Math.abs(days)}d ago`;
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days}d`;
}

export default function KeyDates() {
  const { keyDates } = useDashboard();

  const items = [...keyDates].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 12);

  return (
    <div className="bg-[#37023c]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F7D35F]/10 via-[#E837AC]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
        <div className="p-2.5 rounded-xl bg-white/5 text-[#F7D35F] border border-white/10 shadow-sm">
          <CalendarClock className="w-5 h-5 text-[#F7D35F]" />
        </div>
        <div className="text-left">
          <h2 className="text-lg font-extrabold tracking-tight">Key Dates</h2>
          <p className="text-xs text-white/60">Deadlines &amp; dates spotted in your emails</p>
        </div>
        <span className="ml-auto text-[10px] font-black font-mono px-2.5 py-1 rounded-full bg-white/10 text-[#F7D35F] border border-white/5">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/2">
          <AlarmClock className="w-6 h-6 text-white/30 mb-2" />
          <p className="text-xs font-bold text-white/50">No upcoming dates</p>
          <p className="text-[11px] text-white/40 mt-1 max-w-[220px] leading-relaxed">
            When the AI finds a deadline or date in an email, it appears here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((kd: KeyDate) => {
            const days = daysUntil(kd.date);
            const b = bucketOf(days);
            return (
              <li
                key={kd.id}
                className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                <div className={`flex flex-col items-center justify-center w-14 flex-shrink-0 rounded-lg border py-1.5 ${b.tone}`}>
                  <span className="text-sm font-black leading-none">{fmt(kd.date)}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-80">{relative(days)}</span>
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-bold text-white leading-snug line-clamp-2">{kd.label}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
                    <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider">
                      {b.label} · {kd.source}
                    </span>
                  </div>
                </div>

                {kd.link && (
                  <a
                    href={kd.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open the source email"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-[#F7D35F] transition-all flex-shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
