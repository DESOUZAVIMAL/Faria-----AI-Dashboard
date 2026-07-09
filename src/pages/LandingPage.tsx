import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion, useScroll, useTransform, useInView, AnimatePresence, animate, MotionValue, useMotionValue,
} from "motion/react";
import { useAuth } from "../lib/AuthContext";
import InteractiveGradient from "../components/InteractiveGradient";
import {
  ArrowRight, Sparkles, CheckCircle2, Lock, ChevronDown, AlertTriangle,
  ListTodo, MessageSquare, Mail, Monitor, Zap, Clock, UserCheck, Trash2,
  Inbox, Filter, BarChart3, LayoutDashboard, Headphones, CheckSquare,
  GraduationCap, Layers, Brain,
} from "lucide-react";

/* ══════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════ */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, to, {
      duration: 2, ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix; },
    });
    return () => ctrl.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function Reveal({ children, delay = 0, y = 28, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   FEATURE DEMOS (solid dark cards — shown inside the tornado)
══════════════════════════════════════════════════ */
const NOTIFICATIONS = [
  { id: 1, title: "Database latency exceeded during peak Europe sync", source: "ManageBac+", time: "12m", cat: "Urgent", catColor: "#E837AC" },
  { id: 2, title: "SSL certificate renewals failing for partner portals", source: "Email", time: "45m", cat: "Urgent", catColor: "#E837AC" },
  { id: 3, title: "Feedback requested on international curriculum plan", source: "Slack", time: "32m", cat: "Action", catColor: "#F78B43" },
  { id: 4, title: "Critical SSO outage on production sandbox", source: "Zendesk", time: "50m", cat: "Urgent", catColor: "#E837AC" },
  { id: 5, title: "Global standards webinar rescheduled to 2:30 PM", source: "Email", time: "2h", cat: "Action", catColor: "#F78B43" },
  { id: 6, title: "Weekly school system backup verified successfully", source: "ManageBac+", time: "5h", cat: "FYI", catColor: "#F7D35F" },
];

function SourceIcon({ src }: { src: string }) {
  if (src === "Slack")      return <MessageSquare className="w-3.5 h-3.5 text-[#E837AC]" />;
  if (src === "ManageBac+") return <Monitor className="w-3.5 h-3.5 text-[#F7D35F]" />;
  if (src === "Email")      return <Mail className="w-3.5 h-3.5 text-[#F78B43]" />;
  return <Monitor className="w-3.5 h-3.5 text-white/40" />;
}

function InboxDemo({ progress }: { progress: MotionValue<number> }) {
  const [shown, setShown] = useState(2);
  const [filter, setFilter] = useState<"All" | "Urgent" | "Action" | "FYI">("All");
  useEffect(() => progress.on("change", v => setShown(Math.min(NOTIFICATIONS.length, Math.floor(v * NOTIFICATIONS.length * 1.6) + 2))), [progress]);
  const filtered = filter === "All" ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.cat === filter);

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1e0926", border: "1px solid rgba(232,55,172,0.25)" }}>
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between" style={{ background: "#250b2e" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E837AC] to-[#F78B43] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Smart Inbox</p>
              <p className="text-[9px] text-white/45">Auto-sorted by urgency</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E837AC] animate-pulse" />
            <span className="text-[9px] text-[#E837AC] font-black">3 URGENT</span>
          </div>
        </div>
        <div className="flex px-5 pt-3 gap-1.5">
          {(["All", "Urgent", "Action", "FYI"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-[9px] font-bold px-3 py-1 rounded-full transition-all"
              style={filter === f
                ? { background: f === "Urgent" ? "#E837AC" : f === "Action" ? "#F78B43" : f === "FYI" ? "rgba(247,211,95,0.25)" : "rgba(255,255,255,0.18)", color: f === "FYI" ? "#F7D35F" : "#fff" }
                : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>
              {f}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-2 min-h-[230px]">
          <AnimatePresence>
            {filtered.slice(0, Math.max(2, shown)).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "#2d1038", borderLeft: `3px solid ${n.catColor}` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${n.catColor}18` }}>
                  <SourceIcon src={n.source} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ background: `${n.catColor}28`, color: n.catColor }}>{n.cat}</span>
                    <span className="text-[8px] text-white/40">{n.source}</span>
                    <span className="text-[8px] text-white/30 ml-auto">{n.time} ago</span>
                  </div>
                  <p className="text-[10px] text-white/85 leading-snug">{n.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between" style={{ background: "#250b2e" }}>
          <p className="text-[9px] text-white/35">{NOTIFICATIONS.length} total notifications</p>
          <div className="flex items-center gap-1.5 text-[9px] text-[#F7D35F] font-black"><Sparkles className="w-3 h-3" /> AI Sort Active</div>
        </div>
      </div>
    </div>
  );
}

const TASKS_DATA = [
  { title: "Review categorised admissions stream", priority: "High", color: "#E837AC", done: false },
  { title: "Respond to critical platform migration ticket", priority: "High", color: "#E837AC", done: false },
  { title: "Prepare agenda for global curriculum sync", priority: "Medium", color: "#F78B43", done: true },
  { title: "Proofread academic brochure drafts", priority: "Low", color: "#F7D35F", done: false },
];

function TaskDemo({ progress }: { progress: MotionValue<number> }) {
  const barW = useTransform(progress, [0.05, 0.55], [0, 1]);
  const barWStr = useTransform(barW, v => `${Math.round(v * 25)}%`);
  const [shown, setShown] = useState(1);
  useEffect(() => progress.on("change", v => setShown(Math.floor(v * TASKS_DATA.length * 1.8) + 1)), [progress]);

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1e0926", border: "1px solid rgba(247,139,67,0.25)" }}>
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between" style={{ background: "#250b2e" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(247,139,67,0.18)", border: "1px solid rgba(247,139,67,0.35)" }}>
              <ListTodo className="w-4 h-4 text-[#F78B43]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Smart Tasks</p>
              <p className="text-[9px] text-white/45">Manage your active focus stack</p>
            </div>
          </div>
          <span className="text-sm font-black text-[#E837AC]">1/4</span>
        </div>
        <div className="px-5 py-4 border-b border-white/8" style={{ background: "#220a2a" }}>
          <div className="flex justify-between text-[10px] mb-2">
            <span className="text-white/65 font-semibold">Today's Progress</span>
            <span className="text-[#E837AC] font-black">25%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div className="h-full rounded-full" style={{ width: barWStr, background: "linear-gradient(90deg, #F78B43, #E837AC, #F7D35F)" }} />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <AnimatePresence>
            {TASKS_DATA.slice(0, Math.min(TASKS_DATA.length, Math.max(1, shown))).map((task, i) => (
              <motion.div key={task.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#2d1038", borderLeft: `3px solid ${task.color}` }}>
                <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: task.done ? task.color : "rgba(255,255,255,0.22)", background: task.done ? task.color : "transparent" }}>
                  {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs flex-1 ${task.done ? "line-through text-white/35" : "text-white/88 font-medium"}`}>{task.title}</span>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ background: `${task.color}22`, color: task.color }}>{task.priority}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const QUADRANTS = [
  { id: "q1", title: "DO FIRST", sub: "Urgent & Important", color: "#E837AC", icon: Zap, items: ["SSL cert failure", "SSO sandbox outage", "DB latency spike"] },
  { id: "q2", title: "PLAN", sub: "Important, Not Urgent", color: "#F78B43", icon: Clock, items: ["Curriculum framework", "Audit trail review"] },
  { id: "q3", title: "DELEGATE", sub: "Urgent, Not Important", color: "#F7D35F", icon: UserCheck, items: ["Webinar rescheduled"] },
  { id: "q4", title: "ARCHIVE", sub: "Neither urgent nor important", color: "#6b3878", icon: Trash2, items: ["Birthday reminder"] },
];

function MatrixDemo({ progress }: { progress: MotionValue<number> }) {
  const [shown, setShown] = useState(0);
  useEffect(() => progress.on("change", v => setShown(Math.floor(v * 14))), [progress]);

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1e0926", border: "1px solid rgba(247,211,95,0.25)" }}>
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between" style={{ background: "#250b2e" }}>
          <div>
            <p className="text-xs font-bold text-white">Faria Priority Matrix</p>
            <p className="text-[9px] text-white/45">Eisenhower 4-quadrant · Drag to reprioritise</p>
          </div>
          <span className="text-[9px] font-black px-2.5 py-1 rounded-full" style={{ background: "rgba(247,211,95,0.12)", border: "1px solid rgba(247,211,95,0.25)", color: "#F7D35F" }}>8 items</span>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          {QUADRANTS.map((q, qi) => {
            const Icon = q.icon;
            const visibleItems = q.items.slice(0, Math.max(0, shown - qi * 2));
            return (
              <motion.div key={q.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: qi * 0.08 }}
                className="rounded-xl p-3 min-h-[110px]" style={{ background: `${q.color}10`, border: `1px solid ${q.color}28` }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: q.color }} />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-wider" style={{ color: q.color }}>{q.title}</p>
                    <p className="text-[7px] text-white/35">{q.sub}</p>
                  </div>
                </div>
                <div className="w-full h-0.5 rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(q.items.length / 5) * 100}%`, background: q.color }} />
                </div>
                <div className="space-y-1">
                  <AnimatePresence>
                    {visibleItems.map((item) => (
                      <motion.div key={item} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                        className="text-[8px] text-white/70 px-2 py-1 rounded-md" style={{ background: `${q.color}12` }}>
                        {item}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO LOGO — upright gradient "f", IN FRONT, on a light tile
══════════════════════════════════════════════════ */
function HeroLogo() {
  return (
    <div className="relative h-[460px] lg:h-[560px] flex items-center justify-center" style={{ perspective: 1200 }}>
      {/* glow halo behind the tile */}
      <div className="absolute rounded-full blur-[80px] opacity-60"
        style={{ width: 360, height: 360, background: "radial-gradient(circle, rgba(255,255,255,0.7), rgba(247,211,95,0.4) 45%, rgba(232,55,172,0) 70%)" }} />

      {/* LOGO TILE — front element. Entrance (opacity/scale) on outer motion.div,
          continuous float (transform) on a separate inner .float-soft element. */}
      <motion.div className="relative" style={{ zIndex: 6 }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
        <div className="float-soft grid place-items-center"
          style={{
            width: "clamp(240px, 30vw, 340px)", aspectRatio: "1",
            borderRadius: "2.4rem",
            background: "linear-gradient(150deg, #ffffff 0%, #fff3f9 55%, #ffe9f4 100%)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 40px 90px -22px rgba(183,30,138,0.55), 0 10px 30px rgba(74,4,40,0.18), inset 0 2px 0 rgba(255,255,255,0.9)",
          }}>
          <span className="font-black select-none"
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontStyle: "normal",
              fontSize: "clamp(150px, 19vw, 230px)",
              lineHeight: 1, paddingBottom: "0.08em",
              background: "linear-gradient(150deg, #F78B43 0%, #E837AC 55%, #C71E8A 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 10px rgba(200,30,120,0.25))",
            }}>
            f
          </span>
        </div>
      </motion.div>

      {/* Floating app-preview cards — entrance on outer, float on inner */}
      <motion.div className="absolute" style={{ top: "-2%", right: "-2%", zIndex: 8 }}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
        <div className="float-soft w-[244px] rounded-2xl p-4 shadow-2xl"
          style={{ background: "rgba(20,4,22,0.94)", border: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-[10px] text-white" style={{ background: "linear-gradient(135deg, #F78B43, #E837AC)" }}>f</div>
              <span className="text-[9px] font-black uppercase tracking-wider text-white/55">Daily Brief</span>
            </div>
            <span className="text-[9px] text-[#E837AC] font-black">3 URGENT</span>
          </div>
          <p className="text-[11px] font-bold text-white/90 mb-2.5 leading-snug">Good morning, Vimal. 3 urgent items across 6 platforms.</p>
          <div className="rounded-lg p-2 flex items-center justify-between" style={{ background: "#2d1038" }}>
            <span className="text-[9px] text-white/50">Noise filtered today</span>
            <span className="text-[10px] font-black text-[#F7D35F]">92%</span>
          </div>
        </div>
      </motion.div>

      <motion.div className="absolute" style={{ bottom: "16%", left: "-4%", zIndex: 9 }}
        initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.9 }}>
        <div className="float-soft rounded-2xl p-3 shadow-xl flex items-center gap-2.5"
          style={{ background: "linear-gradient(135deg, #E837AC, #F78B43)", border: "1px solid rgba(255,255,255,0.25)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.25)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[8px] font-black text-white/80 uppercase tracking-widest">AI Sorted</p>
            <p className="text-xs font-black text-white">48 → 6 urgent</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="absolute" style={{ bottom: "-1%", right: "4%", zIndex: 8 }}
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.05 }}>
        <div className="float-soft rounded-2xl p-3.5 shadow-xl"
          style={{ background: "linear-gradient(135deg, #FFFFFF, #FFE9F3)", color: "#37023c", minWidth: "176px", border: "1px solid rgba(255,255,255,0.9)" }}>
          <p className="font-extrabold text-[11px] mb-2">Priority Matrix</p>
          <div className="grid grid-cols-2 gap-1">
            {[{ l: "DO FIRST", v: 4 }, { l: "PLAN", v: 2 }, { l: "DELEGATE", v: 1 }, { l: "ARCHIVE", v: 1 }].map(q => (
              <div key={q.l} className="rounded-lg px-2 py-1" style={{ background: "rgba(183,30,138,0.08)" }}>
                <p className="text-[7px] font-black opacity-60">{q.l}</p>
                <p className="text-sm font-black">{q.v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO (warm brand-graphic background)
══════════════════════════════════════════════════ */
function HeroSection({ isAuthenticated, onDemo }: { isAuthenticated: boolean; onDemo: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — dark plum text on warm */}
          <div className="space-y-7">
            <div className="hero-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black"
              style={{ background: "rgba(55,2,60,0.14)", border: "1px solid rgba(55,2,60,0.2)", color: "#37023c", animationDelay: "0.1s" }}>
              <Lock className="w-3 h-3" /> Internal tool · Faria Education Group
            </div>

            <h1 className="hero-in text-5xl sm:text-6xl xl:text-[74px] font-black leading-[1.02]"
              style={{ color: "#2a0421", animationDelay: "0.22s", letterSpacing: "-0.02em" }}>
              One inbox for<br />everything your<br />
              <span style={{ color: "#B81E83" }}>ops team</span> juggles.
            </h1>

            <p className="hero-in text-lg max-w-lg leading-relaxed font-medium" style={{ color: "rgba(42,4,33,0.72)", animationDelay: "0.36s" }}>
              Faria pulls every notification from Gmail, Slack, Zendesk, ClickUp and more into
              <span className="font-bold" style={{ color: "#2a0421" }}> one place</span> — then the AI filters, sorts and prioritises it for you.
            </p>

            <div className="hero-in flex flex-col sm:flex-row gap-4 pt-2" style={{ animationDelay: "0.5s" }}>
              {isAuthenticated ? (
                <Link to="/dashboard" className="group px-8 py-4 text-white font-bold text-sm rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  style={{ background: "#2a0421", boxShadow: "0 10px 30px rgba(42,4,33,0.3)" }}>
                  Open Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <button onClick={onDemo} className="group px-8 py-4 text-white font-bold text-sm rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{ background: "#2a0421", boxShadow: "0 10px 30px rgba(42,4,33,0.3)" }}>
                    Try the Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link to="/login" className="px-8 py-4 font-bold text-sm rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all text-center"
                    style={{ background: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.9)", color: "#2a0421" }}>
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — logo in front */}
          <HeroLogo />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.6 }, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ zIndex: 20, color: "rgba(42,4,33,0.5)" }}>
        <ChevronDown className="w-4 h-4" />
        <span className="text-[9px] tracking-[0.18em] uppercase font-bold">see how it works</span>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   INTEGRATIONS — sources signalling into the F hub
══════════════════════════════════════════════════ */
const SOURCES = [
  { name: "Gmail",     icon: Mail,          color: "#EA4335", angle: -90 },
  { name: "Slack",     icon: MessageSquare, color: "#611f69", angle: -30 },
  { name: "Zendesk",   icon: Headphones,    color: "#03363D", angle: 30 },
  { name: "ClickUp",   icon: CheckSquare,   color: "#7B68EE", angle: 90 },
  { name: "ManageBac", icon: GraduationCap, color: "#0a7", angle: 150 },
  { name: "Jira",      icon: Layers,        color: "#2684FF", angle: 210 },
];

function IntegrationsSection() {
  const R = 250, CX = 380, CY = 300;
  const pts = SOURCES.map((s) => {
    const rad = (s.angle * Math.PI) / 180;
    return { ...s, x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  });
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal className="text-center mb-2">
          <span className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#7a0f5e" }}>Connected to everything</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3" style={{ color: "#2a0421", letterSpacing: "-0.02em" }}>
            Every tool your team uses,<br />wired into one dashboard.
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base font-medium" style={{ color: "rgba(42,4,33,0.7)" }}>
            Faria listens to all of them at once and routes every signal into a single live feed.
          </p>
        </Reveal>

        <div className="relative mx-auto" style={{ width: 760, maxWidth: "100%", height: 600 }}>
          <svg viewBox="0 0 760 600" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* counter-rotating orbit rings */}
            <g>
              <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="44s" repeatCount="indefinite" />
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(42,4,33,0.16)" strokeWidth="1.5" strokeDasharray="2 12" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate" from={`360 ${CX} ${CY}`} to={`0 ${CX} ${CY}`} dur="64s" repeatCount="indefinite" />
              <circle cx={CX} cy={CY} r={R - 52} fill="none" stroke="rgba(42,4,33,0.1)" strokeWidth="1" strokeDasharray="1 9" />
            </g>
            {/* spokes + travelling signal pulses */}
            {pts.map((p, i) => (
              <g key={p.name}>
                <line x1={p.x} y1={p.y} x2={CX} y2={CY} stroke="rgba(42,4,33,0.2)" strokeWidth="2" strokeLinecap="round" />
                <circle r="5" fill={p.color}>
                  <animateMotion dur="2.4s" begin={`${i * 0.34}s`} repeatCount="indefinite" path={`M ${p.x},${p.y} L ${CX},${CY}`} />
                  <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" begin={`${i * 0.34}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>

          {/* pulsing glow behind F (centering on outer, pulse on inner) */}
          <div className="absolute pointer-events-none" style={{ left: CX, top: CY, transform: "translate(-50%,-50%)", zIndex: 1 }}>
            <motion.div className="rounded-full" style={{ width: 230, height: 230, background: "radial-gradient(circle, rgba(232,55,172,0.55), transparent 65%)", filter: "blur(18px)" }}
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
          </div>

          {/* F hub (centering on outer, float on inner) */}
          <div className="absolute" style={{ left: CX, top: CY, transform: "translate(-50%,-50%)", zIndex: 3 }}>
            <motion.div className="flex items-center justify-center rounded-3xl"
              style={{ width: 140, height: 140, background: "linear-gradient(150deg, #ffffff, #ffe9f4)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 26px 64px -14px rgba(183,30,138,0.55)" }}
              animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <span className="font-black" style={{ fontSize: 92, lineHeight: 1, paddingBottom: "0.06em",
                background: "linear-gradient(150deg, #F78B43, #E837AC 60%, #C71E8A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>f</span>
            </motion.div>
          </div>

          {/* source nodes (centering on outer, entrance + bob on inner) */}
          {pts.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%,-50%)", zIndex: 4 }}>
                <motion.div className="flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.div className="w-16 h-16 rounded-2xl bg-white grid place-items-center"
                    style={{ border: "1px solid rgba(255,255,255,0.9)", boxShadow: `0 12px 32px -8px ${p.color}66, 0 4px 12px rgba(42,4,33,0.12)` }}
                    animate={{ y: [0, -7, 0] }} transition={{ duration: 3 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}>
                    <Icon className="w-7 h-7" style={{ color: p.color }} />
                  </motion.div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.7)", color: "#2a0421" }}>{p.name}</span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   EXPLAINER — what the dashboard does (warm → dark bridge)
══════════════════════════════════════════════════ */
const PIPELINE = [
  { icon: Inbox,           label: "Collect",    desc: "Pulls every alert, email, ticket and message from all your platforms in real time." },
  { icon: Filter,          label: "Filter",     desc: "Strips out the noise — duplicates, FYIs and resolved items never reach you." },
  { icon: Brain,           label: "Prioritise", desc: "AI reads each item and ranks it Urgent · Action · FYI by real impact." },
  { icon: BarChart3,       label: "Visualise",  desc: "Surfaces what matters as a daily brief, smart inbox and priority matrix." },
];

function ExplainerSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#7a0f5e" }}>What Faria does</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3" style={{ color: "#2a0421", letterSpacing: "-0.02em" }}>
            From scattered noise<br />to one clear view.
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base font-medium leading-relaxed" style={{ color: "rgba(42,4,33,0.72)" }}>
            Your team drowns in notifications across six tools. Faria does the triage for you — automatically, every minute.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.label} delay={i * 0.12}>
                <div className="relative rounded-2xl p-6 h-full" style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 18px 44px -22px rgba(120,15,90,0.5)", backdropFilter: "blur(6px)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg, #F78B43, #E837AC)" }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-black" style={{ color: "rgba(42,4,33,0.14)" }}>0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-black mb-1.5" style={{ color: "#2a0421" }}>{step.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(42,4,33,0.62)" }}>{step.desc}</p>
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3.5 w-5 h-5" style={{ transform: "translateY(-50%)", color: "rgba(42,4,33,0.3)" }} />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   FEATURE TORNADO — cards spiral up a vertical helix
══════════════════════════════════════════════════ */
const FEATURES = [
  { tag: "Feature 01", title: "AI Smart Inbox", color: "#E837AC", side: 1,
    desc: "Every alert from every tool, auto-sorted Urgent · Action · FYI.",
    points: ["Pulls Gmail, Slack, Zendesk & more", "AI reads and tags each item", "Urgent always surfaces to the top"],
    Demo: InboxDemo },
  { tag: "Feature 02", title: "Smart Tasks", color: "#F78B43", side: -1,
    desc: "Turn what matters into a focused, prioritised task stack.",
    points: ["High / Medium / Low priorities", "Live daily progress bar", "Feeds straight into the matrix"],
    Demo: TaskDemo },
  { tag: "Feature 03", title: "Priority Matrix", color: "#D8A200", side: 1,
    desc: "Drag everything into an Eisenhower matrix to plan your day.",
    points: ["Do First · Plan · Delegate · Archive", "Drag items between quadrants", "Capacity warnings per quadrant"],
    Demo: MatrixDemo },
];

type Feature = typeof FEATURES[number];

function TornadoDemo({ index, total, progress, feature }: {
  index: number; total: number; progress: MotionValue<number>; feature: Feature;
}) {
  // Center-based, OVERLAPPING windows so features crossfade with no blank gap.
  const c = (index + 0.5) / total;
  const w = 0.30; // half-width — wide enough to overlap the neighbouring feature
  const input = [c - w, c - w * 0.42, c + w * 0.42, c + w];
  const side = feature.side;
  const opacity = useTransform(progress, input, [0, 1, 1, 0]);
  const rotateY = useTransform(progress, input, [side * 70, 0, 0, -side * 70]);
  const x       = useTransform(progress, input, [side * 300, 0, 0, -side * 300]);
  const y       = useTransform(progress, input, [160, 0, 0, -160]);
  const z       = useTransform(progress, input, [-360, 0, 0, -360]);
  const scale   = useTransform(progress, input, [0.7, 1, 1, 0.7]);
  const local   = useTransform(progress, [c - w, c], [0, 1]);
  const Demo = feature.Demo;
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
      <motion.div style={{ x, y, z, rotateY, scale, transformStyle: "preserve-3d" }} className="w-full max-w-[460px]">
        <div style={{ boxShadow: `0 44px 90px -28px ${feature.color}77` }}>
          <Demo progress={local} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function TornadoText({ index, total, progress, feature }: {
  index: number; total: number; progress: MotionValue<number>; feature: Feature;
}) {
  // Match the demo's overlapping window exactly so text + demo crossfade together.
  const c = (index + 0.5) / total;
  const w = 0.30;
  const input = [c - w, c - w * 0.42, c + w * 0.42, c + w];
  const opacity = useTransform(progress, input, [0, 1, 1, 0]);
  const y = useTransform(progress, input, [42, 0, 0, -42]);
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity, y }}>
      <span className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: "#B81E83" }}>{feature.tag}</span>
      <h3 className="text-4xl md:text-5xl font-black mt-2" style={{ color: "#2a0421", letterSpacing: "-0.02em" }}>{feature.title}</h3>
      <p className="text-base mt-3 max-w-sm font-medium leading-relaxed" style={{ color: "rgba(42,4,33,0.72)" }}>{feature.desc}</p>
      <ul className="mt-5 space-y-2.5">
        {feature.points.map((pt) => (
          <li key={pt} className="flex items-center gap-2.5 text-sm font-bold" style={{ color: "#2a0421" }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: feature.color }} /> {pt}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/*
  Robust scroll progress: read the section's real position every frame via
  getBoundingClientRect. This is immune to Lenis smooth-scroll timing (which was
  compressing Framer's useScroll so features 2 & 3 never reached full opacity).
*/
function useSectionProgress(ref: React.RefObject<HTMLDivElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), Math.max(1, total));
        progress.set(total > 0 ? scrolled / total : 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, progress]);
  return progress;
}

function FeatureTornado() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSectionProgress(ref);

  return (
    <section ref={ref} style={{ height: `${FEATURES.length * 130 + 30}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT — 3D tornado of feature demos */}
          <div className="relative h-[440px] lg:h-[520px] order-2 lg:order-1" style={{ perspective: 1400 }}>
            {FEATURES.map((f, i) => (
              <TornadoDemo key={f.title} index={i} total={FEATURES.length} progress={scrollYProgress} feature={f} />
            ))}
          </div>
          {/* RIGHT — brief synced explanation */}
          <div className="relative h-[300px] order-1 lg:order-2">
            <div className="absolute -top-12 left-0 text-xs font-black uppercase tracking-[0.3em]" style={{ color: "rgba(42,4,33,0.42)" }}>
              Inside the dashboard
            </div>
            {FEATURES.map((f, i) => (
              <TornadoText key={f.title} index={i} total={FEATURES.length} progress={scrollYProgress} feature={f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function LandingPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const handleDemo = () => { login(); navigate("/dashboard"); };

  return (
    <div className="relative font-sans" style={{ WebkitFontSmoothing: "antialiased" }}>
      {/* Fixed, mouse-reactive warm gradient — one consistent backdrop for the whole page */}
      <InteractiveGradient />

      <div className="relative" style={{ zIndex: 1 }}>
        <HeroSection isAuthenticated={isAuthenticated} onDemo={handleDemo} />
        <IntegrationsSection />
        <ExplainerSection />
        <FeatureTornado />

        {/* CTA */}
        <section className="relative py-32 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 text-center space-y-10" style={{ zIndex: 5 }}>
            <Reveal className="space-y-5">
              <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: "#7a0f5e" }}>Ready when you are</p>
              <h2 className="text-5xl md:text-7xl font-black leading-tight" style={{ color: "#2a0421", letterSpacing: "-0.02em" }}>
                Stop chasing<br />notifications.
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed" style={{ color: "rgba(42,4,33,0.72)" }}>
                One dashboard collects, filters and prioritises everything your ops team gets — so you start each day already in control.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="group px-10 py-5 text-white font-bold rounded-full hover:scale-[1.04] active:scale-[0.97] transition-all flex items-center justify-center gap-2 text-base"
                    style={{ background: "#2a0421", boxShadow: "0 14px 40px rgba(42,4,33,0.32)" }}>
                    Open Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <button onClick={handleDemo} className="group px-10 py-5 text-white font-bold rounded-full hover:scale-[1.04] active:scale-[0.97] transition-all flex items-center justify-center gap-2 text-base"
                      style={{ background: "#2a0421", boxShadow: "0 14px 40px rgba(42,4,33,0.32)" }}>
                      Try the Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <Link to="/login" className="px-10 py-5 font-bold rounded-full hover:scale-[1.04] active:scale-[0.97] transition-all text-center text-base"
                      style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)", color: "#2a0421" }}>
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="text-xs" style={{ color: "rgba(42,4,33,0.45)" }}>Faria Education Group · Internal Operations Dashboard · {new Date().getFullYear()}</p>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
