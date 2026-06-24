import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  MessageSquare, 
  Mail, 
  Monitor, 
  Clock, 
  Compass, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  Globe,
  Database,
  Terminal,
  Activity
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  // Ref for scroll parallax effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform outputs for subtle parallax elements
  const heroBgY = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative text-white font-sans overflow-hidden bg-[#391638] selection:bg-[#E837AC]/20 selection:text-[#E837AC]">
      {/* Immersive high-end background gradient blurs mimicking 3D studio environments */}
      <motion.div 
        style={{ y: heroBgY, scale: heroScale }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#E837AC]/15 via-[#F78843]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" 
      />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#F7D35F]/10 via-[#37023c]/20 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[200px] left-10 w-[700px] h-[700px] bg-gradient-to-tr from-[#E837AC]/10 via-[#F78843]/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-28 md:pb-44 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
          
          {/* Hero Left: Strategic Proposition */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black text-[#F7D35F] shadow-inner"
            >
              <Cpu className="w-3.5 h-3.5 text-[#E837AC] animate-pulse" />
              <span className="font-mono tracking-wider uppercase">Faria Governance Suite v2.4</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white"
              >
                The relentless <br />
                pursuit of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F] filter drop-shadow-sm">
                  better focus.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed font-sans font-medium"
              >
                Faria Dashboard pulls alerts from Slack, Zendesk, and Email, filters the noise, and maps your true priorities instantly.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F] text-white font-black text-sm tracking-wide shadow-xl shadow-[#E837AC]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Go to Admin Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F] text-white font-black text-sm tracking-wide shadow-xl shadow-[#E837AC]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Authenticate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#video-demo"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all shadow-inner"
                  >
                    <Play className="w-3.5 h-3.5 text-[#F7D35F] fill-[#F7D35F]" />
                    <span>Watch Demo</span>
                  </a>
                </>
              )}
            </motion.div>

            {/* Micro regulatory badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-white/50"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-wider font-mono">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F7D35F]" />
                <span className="text-[10px] font-black uppercase tracking-wider font-mono">Sovereign Hosting</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right: Highly Styled Cluster of Floating 3D-rotated Glass Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px]">
            {/* Visual background orbital tracks */}
            <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full pointer-events-none flex items-center justify-center">
              <div className="w-[300px] h-[300px] border border-white/5 rounded-full" />
            </div>

            {/* Glowing 3D Glass Cluster Panel Wrapper */}
            <div className="relative w-full max-w-[420px] h-[380px] perspective-1000">
              
              {/* Card 1: Slack stream alert (Top left, tilted forward) */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotateY: [15, 12, 15],
                  rotateX: [12, 15, 12]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute top-0 left-0 w-[240px] bg-[#37023c]/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(232,55,172,0.15)] z-20 text-left cursor-default select-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#E837AC]/20 border border-[#E837AC]/30">
                      <MessageSquare className="w-4 h-4 text-[#E837AC]" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-white/50 uppercase font-mono">Slack Channel</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#E837AC] animate-ping" />
                </div>
                <h4 className="text-xs font-black text-white leading-snug">#academic-coordination</h4>
                <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                  "SSL expired on sandbox domains. Core single sign-on is offline."
                </p>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-[#F7D35F] uppercase">URGENT</span>
                  <span className="text-[9px] text-white/40">1m ago</span>
                </div>
              </motion.div>

              {/* Card 2: Email stream notification (Bottom right, offset) */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotateY: [-10, -8, -10],
                  rotateX: [15, 12, 15]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute bottom-4 right-0 w-[260px] bg-[#37023c]/75 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_25px_60px_rgba(247,136,67,0.15)] z-30 text-left cursor-default select-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-[#F78843]/20 border border-[#F78843]/30">
                      <Mail className="w-4 h-4 text-[#F78843]" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-white/50 uppercase font-mono">Executive Email</span>
                  </div>
                  <span className="text-[9px] text-white/40">5m ago</span>
                </div>
                <h4 className="text-xs font-black text-white leading-snug">Sarah Jenkins • Product QA</h4>
                <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed">
                  "Please append final reviews on the Q3 academic templates prior to team synchronisation."
                </p>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-[#F78843] uppercase">ACTION REQUIRED</span>
                  <span className="text-[9px] text-white/30 font-mono">AI Ranked #2</span>
                </div>
              </motion.div>

              {/* Card 3: Mini telemetry tracking Node (Floating background) */}
              <motion.div
                animate={{
                  scale: [0.95, 1, 0.95],
                  y: [10, -10, 10],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-3 shadow-inner z-10 text-left"
              >
                <div className="flex items-center gap-2 text-[#F7D35F] mb-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider font-mono">Cognitive Sorter</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-[#F78843] to-[#E837AC]" />
                </div>
                <p className="text-[9px] text-white/40 font-mono mt-1">Filtering active...</p>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. THE DEMO VIDEO SHOWCASE */}
      <section id="video-demo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-10"
        >
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#E837AC] font-mono">Interactive Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
              See the matrix in physical motion.
            </h2>
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
              Ditch the static folders. Take control of your daily stream using an intelligent, single-screen administrative canvas. Watch how easily telemetry flows.
            </p>
          </div>

          {/* Massive 16:9 3D-Shadow Video Placeholder */}
          <div className="relative group max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden bg-[#37023c]/60 border border-white/10 shadow-[0_30px_80px_rgba(232,55,172,0.18)] transition-all duration-500 hover:border-white/20">
            {/* Ambient glow backdrop inside */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/50 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-[#E837AC]/10 to-[#F78843]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />

            {/* Video mockup graphics: Grid elements representing active streams */}
            <div className="absolute inset-8 border border-white/5 rounded-2xl grid grid-cols-12 gap-4 p-4 opacity-30 select-none">
              <div className="col-span-3 rounded-xl bg-white/5 border border-white/10" />
              <div className="col-span-6 rounded-xl bg-white/5 border border-white/10" />
              <div className="col-span-3 rounded-xl bg-white/5 border border-white/10" />
              <div className="col-span-4 rounded-xl bg-white/5 border border-white/10" />
              <div className="col-span-8 rounded-xl bg-white/5 border border-white/10" />
            </div>

            {/* Simulated Play button / Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#F78843] via-[#E837AC] to-[#F7D35F] p-[2px] shadow-2xl cursor-pointer"
              >
                <div className="w-full h-full bg-[#37023c] rounded-full flex items-center justify-center">
                  <Play className="w-7 h-7 text-[#F7D35F] fill-[#F7D35F] translate-x-0.5" />
                </div>
              </motion.button>
              
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-[#F7D35F] font-mono">Initialize Preview</span>
                <p className="text-[11px] text-white/50">Run Faria Governance Simulator (Duration 1:40)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. FEATURE WALKTHROUGH */}
      <section className="py-24 space-y-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header of walkthrough */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#F78843] font-mono">Structural Breakthroughs</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Designed to protect your focus.</h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans font-medium">
            We broke down academic administrative overhead into three logical stages of clean engineering.
          </p>
        </div>

        {/* Feature 1: The Universal Inbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E837AC]/10 border border-[#E837AC]/20 flex items-center justify-center text-[#E837AC] shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">The Universal Inbox</h3>
              <p className="text-sm text-white/70 leading-relaxed font-sans font-medium">
                Consolidate disconnected streams. Faria Dashboard establishes real-time synchronisation protocols with internal Slack channels, ManageBac+ alerts, and corporate Gmail domains, organizing everything into a single, cohesive feed.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-white/60 pl-1 font-sans font-medium">
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#E837AC]" />
                <span>Zero configuration API integrations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#E837AC]" />
                <span>Encrypted on-site memory architecture</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#E837AC]" />
                <span>Configurable real-time telemetry polling</span>
              </li>
            </ul>
          </motion.div>

          {/* Visual Right: Isometric stack of glass panels */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[380px] h-[340px] flex items-center justify-center">
              
              {/* Parent Perspective box representing Solid 3D */}
              <div className="w-full h-full transform rotate-x-[55deg] rotate-z-[-45deg] transform-style-3d scale-90">
                {/* Panel 1: ManageBac+ (Top Layer) */}
                <div className="absolute top-0 left-0 w-full h-[180px] bg-[#37023c]/80 border border-[#F7D35F]/40 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between p-4 translate-z-[80px] transition-transform hover:translate-z-[100px] duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F7D35F] font-mono">ManageBac+ Stream</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-white">Daily Snapshots Compiled</p>
                    <p className="text-[10px] text-white/50">Backup storage verified</p>
                  </div>
                </div>

                {/* Panel 2: Slack Channel (Middle Layer) */}
                <div className="absolute top-12 left-12 w-full h-[180px] bg-[#37023c]/75 border border-[#E837AC]/40 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between p-4 translate-z-[40px] transition-transform hover:translate-z-[50px] duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E837AC] font-mono">Slack Feed</span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#E837AC]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-extrabold text-white">Backlog replications</p>
                    <p className="text-[10px] text-white/50">Capacity scaled up</p>
                  </div>
                </div>

                {/* Panel 3: Master Sync Base (Bottom Layer) */}
                <div className="absolute top-24 left-24 w-full h-[180px] bg-black/50 border border-white/10 rounded-2xl shadow-inner flex flex-col justify-between p-4 translate-z-0">
                  <span className="text-[10px] font-mono font-bold text-white/30 uppercase">Master Feed Aggregator</span>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Cpu className="w-3.5 h-3.5 text-[#F78843] animate-spin-slow" />
                    <span>Re-routing telemetry in real-time</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Feature 2: AI Noise Filtration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Left: Glowing animated funnel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 order-last lg:order-first flex justify-center"
          >
            <div className="relative w-full max-w-[360px] h-[340px] flex items-center justify-center bg-white/2 rounded-3xl border border-white/5 p-6 shadow-inner">
              
              {/* Funnel container */}
              <div className="flex flex-col items-center w-full max-w-[240px] space-y-4">
                
                {/* Wide Top: Unsorted incoming stream */}
                <div className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F78843]/20 to-[#E837AC]/20 border border-white/10 flex items-center justify-between px-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/60">Raw Alerts Input</span>
                  <span className="text-[10px] font-bold text-white">128 items / min</span>
                </div>

                {/* Arrow down */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-6 w-0.5 bg-[#E837AC]"
                />

                {/* Medium Tier: Sorting matrix */}
                <div className="w-4/5 h-12 rounded-xl bg-gradient-to-r from-[#E837AC]/20 to-[#F7D35F]/20 border border-[#E837AC]/30 flex items-center justify-center relative">
                  <span className="text-[9px] font-mono font-black text-[#F7D35F] uppercase animate-pulse">AI Noise Filtering Engine</span>
                </div>

                {/* Arrow down */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="h-6 w-0.5 bg-[#F7D35F]"
                />

                {/* Small Bottom: High priority compliance stream */}
                <div className="w-1/2 h-12 rounded-xl bg-[#37023c] border border-green-500/40 shadow-[0_0_20px_rgba(74,222,128,0.15)] flex items-center justify-between px-3">
                  <span className="text-[9px] font-mono font-bold text-green-400">Action Stream</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                </div>

              </div>

            </div>
          </motion.div>

          {/* Text Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F78843]/10 border border-[#F78843]/20 flex items-center justify-center text-[#F78843] shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">AI Noise Filtration</h3>
              <p className="text-sm text-white/70 leading-relaxed font-sans font-medium">
                Not all alerts are created equal. Faria's cognitive sorting engine processes incoming alerts, filters out automated snapshots or non-critical birthday updates, and highlights only high-impact actions. Useless notifications are automatically routed to the eliminate archive.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-white/60 pl-1 font-sans font-medium">
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F78843]" />
                <span>Advanced priority classification</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F78843]" />
                <span>Automatic background archiving</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F78843]" />
                <span>Manual threshold controls</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Feature 3: The Eisenhower Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F7D35F]/10 border border-[#F7D35F]/20 flex items-center justify-center text-[#F7D35F] shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Interactive Governance Matrix</h3>
              <p className="text-sm text-white/70 leading-relaxed font-sans font-medium">
                Prioritise with fluid drag-and-drop. Our interactive, full-screen compliance matrix segments outstanding notifications and active tasks into four discrete quadrants of urgency and importance.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-white/60 pl-1 font-sans font-medium">
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F7D35F]" />
                <span>Real-time quadrant load capacity monitoring</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F7D35F]" />
                <span>Automated system warnings for overload limits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ChevronRight className="w-4 h-4 text-[#F7D35F]" />
                <span>Smooth transitions with fluid Framer Motion feedback</span>
              </li>
            </ul>
          </motion.div>

          {/* Visual Right: Stylized, elevated 2x2 grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[380px] h-[340px] flex items-center justify-center">
              
              {/* Matrix mock layout */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[340px] p-4 bg-white/2 border border-white/5 rounded-2xl relative shadow-inner">
                {/* Q1 DO */}
                <div className="h-[120px] rounded-xl bg-[#37023c]/80 border border-[#E837AC]/30 p-3.5 flex flex-col justify-between text-left shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-[#E837AC] uppercase tracking-widest">Q1 DO</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#E837AC]/10 text-[#E837AC] font-bold">2 Items</span>
                  </div>
                  <div className="h-1 w-full bg-[#E837AC] rounded-full" />
                </div>

                {/* Q2 PLAN */}
                <div className="h-[120px] rounded-xl bg-[#37023c]/80 border border-[#F78843]/30 p-3.5 flex flex-col justify-between text-left shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-[#F78843] uppercase tracking-widest">Q2 PLAN</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#F78843]/10 text-[#F78843] font-bold">4 Items</span>
                  </div>
                  <div className="h-1 w-full bg-[#F78843] rounded-full" />
                </div>

                {/* Q3 DELEGATE */}
                <div className="h-[120px] rounded-xl bg-[#37023c]/80 border border-[#F7D35F]/30 p-3.5 flex flex-col justify-between text-left shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-[#F7D35F] uppercase tracking-widest">Q3 DELEGATE</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#F7D35F]/10 text-[#F7D35F] font-bold">1 Item</span>
                  </div>
                  <div className="h-1 w-full bg-[#F7D35F] rounded-full" />
                </div>

                {/* Q4 ELIMINATE */}
                <div className="h-[120px] rounded-xl bg-[#37023c]/80 border border-[#552859]/30 p-3.5 flex flex-col justify-between text-left shadow-lg opacity-40">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-white/50 uppercase tracking-widest">Q4 ELIMINATE</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50 font-bold">0 Items</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full" />
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </section>

      {/* 4. BOTTOM CALL TO ACTION */}
      <section className="py-28 relative z-10 overflow-hidden">
        {/* Dynamic backdrop accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#E837AC]/15 via-[#F78843]/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <div className="space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-[#F7D35F] font-mono">Administrative Sovereignty</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              Ready to claim your administrative workspace?
            </h2>
            <p className="text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
              Consolidate outstanding admissions streams, protect critical sandbox SSO integrations, and balance administrative workloads with precision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F] text-white font-black text-sm tracking-wide shadow-2xl shadow-[#E837AC]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all"
            >
              <span>Activate Demo Access</span>
            </Link>
          </div>

          <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest font-bold">
            No long-term setup required. Secure SSO sandbox enabled by default.
          </p>
        </div>
      </section>

    </div>
  );
}
