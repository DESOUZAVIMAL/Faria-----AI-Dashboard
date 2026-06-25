import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import BrandTracksBackground from "../components/BrandTracksBackground";
import { useAuth } from "../lib/AuthContext";
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Compass, 
  Layout, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Layers,
  Activity,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Navigation tabs for the interactive preview sandbox
  const [activeSandboxTab, setActiveSandboxTab] = useState<"scheduling" | "matrix" | "analytics">("scheduling");

  // Subtle parallax offsets
  const heroBgY = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.96]);

  const handleDemoSignIn = () => {
    login();
    navigate("/dashboard");
  };

  return (
    <div ref={containerRef} className="relative text-white font-sans overflow-hidden bg-[#37023c] selection:bg-[#E837AC]/20 selection:text-[#E837AC]">
      {/* Scroll-animated brand track lines background */}
      <BrandTracksBackground />

      {/* Immersive high-end background gradient blurs mimicking 3D studio environments */}
      <motion.div 
        style={{ y: heroBgY, scale: heroScale }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#E837AC]/15 via-[#F78843]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" 
      />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-[#F7D35F]/10 via-[#37023c]/20 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[200px] left-10 w-[700px] h-[700px] bg-gradient-to-tr from-[#E837AC]/10 via-[#F78843]/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-28 md:pb-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#F7D35F]"
            >
              <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#F7D35F]" />
              <span>Next-Gen Academic Resource Governance</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
            >
              The relentless <br />
              pursuit of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F78843] via-[#E837AC] to-[#F7D35F]">better</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#F0EBEB]/90 max-w-2xl font-medium leading-relaxed"
            >
              We share the ambitions of schools, educators, and learners to create better collaboration, communication, and outcomes across every timezone. Map availability, track administrative compliance, and synchronize schedules seamlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  id="hero-dashboard-btn"
                  className="px-8 py-4 bg-[#E837AC] hover:bg-[#c92f93] text-white font-extrabold text-sm rounded-full shadow-lg shadow-[#E837AC]/20 hover:shadow-[#E837AC]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Enter Workspace
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    id="hero-login-btn"
                    className="px-8 py-4 bg-[#E837AC] hover:bg-[#c92f93] text-white font-extrabold text-sm rounded-full shadow-lg shadow-[#E837AC]/20 hover:shadow-[#E837AC]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Authenticate Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={handleDemoSignIn}
                    id="hero-demo-btn"
                    className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-sm rounded-full backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
                  >
                    Launch Interactive Demo
                  </button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-2 text-white/50 text-xs font-semibold pt-4"
            >
              <Info className="w-4 h-4 text-[#F7D35F]" />
              <span>Recommended: Global multi-timezone configuration for 200+ academic seats.</span>
            </motion.div>
          </div>

          {/* Interactive 3D Perspective Floating Mockups */}
          <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
            
            {/* Card 1: Main Dashboard Overview (Floating at 3D Angle) */}
            <motion.div
              initial={{ opacity: 0, rotateY: -15, rotateX: 10, y: 30 }}
              animate={{ opacity: 1, rotateY: -10, rotateX: 12, y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                opacity: { duration: 0.8 }
              }}
              className="absolute w-[320px] bg-[#391638]/90 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-xl z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F78843] to-[#E837AC] flex items-center justify-center font-black select-none text-xs">f</div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Schedule Stream</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>Active Overlaps</span>
                    <span className="text-emerald-400 font-bold font-mono">92% MATCH</span>
                  </div>
                  <p className="text-sm font-bold text-white font-mono">14:00 - 15:30 UTC</p>
                  <p className="text-[10px] text-white/60 mt-1">Chloe (LDN) &bull; Aarav (BOM) &bull; Kenji (TYO)</p>
                </div>

                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>Compliance Health</span>
                    <span className="text-[#F7D35F] font-bold font-mono">GDPR PENDING</span>
                  </div>
                  <p className="text-sm font-bold text-white font-mono font-sans">Quadrant II Checklists</p>
                  <p className="text-[10px] text-white/60 mt-1">3 non-essential titles auto-muted.</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Companion Contact Card (Floating below) */}
            <motion.div
              initial={{ opacity: 0, rotateY: 15, rotateX: -5, y: 80, x: 80 }}
              animate={{ opacity: 1, rotateY: 12, rotateX: -8, y: [80, 70, 80], x: 80 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.5,
                opacity: { duration: 0.8 }
              }}
              className="absolute w-[240px] bg-gradient-to-br from-[#FAE59F] to-[#FBC5A1] rounded-2xl p-4 shadow-xl z-10 border border-white/20 text-[#37023c]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                    alt="Chloe" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs">Chloe Vance</h4>
                  <p className="text-[10px] opacity-75 font-semibold">Academic Lead &bull; London</p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-black/10 flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#37023c]/10 px-1.5 py-0.5 rounded">Active Stream</span>
                <span className="text-[10px] font-mono font-extrabold">UTC +1</span>
              </div>
            </motion.div>

            {/* Card 3: Compliance Circle Indicator (Floating above left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -120, y: -100 }}
              animate={{ opacity: 1, scale: 1, x: -120, y: [-100, -110, -100] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1,
                opacity: { duration: 0.8 }
              }}
              className="absolute bg-gradient-to-tr from-[#E837AC] to-[#F78843] rounded-2xl p-3 shadow-lg z-30 border border-white/20 text-white flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white animate-spin-slow" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-white/80 uppercase tracking-widest leading-none">Security Rating</p>
                <p className="text-xs font-black leading-none mt-1">A+ ISO 27001</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. LOGO GRID / TRUST SECTION */}
      <section className="relative py-12 border-t border-b border-white/5 bg-black/10 z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-[#F0EBEB]/50 font-bold mb-6">
            Empowering governance & administration at schools worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center opacity-65 grayscale hover:opacity-85 transition-opacity">
            <div className="flex justify-center text-sm font-extrabold tracking-tight text-white select-none">
              MANAGEBAC
            </div>
            <div className="flex justify-center text-sm font-extrabold tracking-tight text-white select-none">
              OPENAPPLY
            </div>
            <div className="flex justify-center text-sm font-extrabold tracking-tight text-white select-none">
              ATLAS NEXT
            </div>
            <div className="flex justify-center text-sm font-extrabold tracking-tight text-white select-none">
              SCHOOLDECISIONS
            </div>
            <div className="hidden lg:flex justify-center text-sm font-extrabold tracking-tight text-white select-none">
              FARIA ONE
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID OF CORE PLATFORM FEATURES */}
      <section className="relative py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-bold text-[#E837AC] uppercase tracking-widest">Platform Core Architecture</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Administrative precision. Global scales.</h2>
          <p className="text-[#F0EBEB]/70 max-w-2xl mx-auto text-sm md:text-base">
            Engineered specifically to solve the calendar and alignment complexities inherent to global education networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Multi-timezone Matrix */}
          <div className="bg-[#391638]/45 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-[#E837AC]/30 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E837AC]/10 border border-[#E837AC]/20 flex items-center justify-center text-[#E837AC]">
                <Globe className="w-6 h-6 text-[#E837AC]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Multi-Timezone Sweep Matrix</h3>
              <p className="text-sm text-[#F0EBEB]/60 leading-relaxed">
                Automatically maps local calendars to real UTC overlaps. Instantly discover exact hour segments where teammates across three continents share synchronized free blocks.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#E837AC] gap-1 group-hover:gap-2 transition-all">
              <span>Explore Overlap Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: GDPR & Privacy Compliance */}
          <div className="bg-[#391638]/45 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-[#F78843]/30 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F78843]/10 border border-[#F78843]/20 flex items-center justify-center text-[#F78843]">
                <ShieldCheck className="w-6 h-6 text-[#F78843]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">GDPR & Academic Governance</h3>
              <p className="text-sm text-[#F0EBEB]/60 leading-relaxed">
                Filter private events, mute confidential keywords, and configure secure working-hour fences. Rest assured that sensitive school records and private calendar items remain fully localized.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#F78843] gap-1 group-hover:gap-2 transition-all">
              <span>Inspect Security Mandates</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Intelligent AI Copilot */}
          <div className="bg-[#391638]/45 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between group hover:border-[#F7D35F]/30 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7D35F]/10 border border-[#F7D35F]/20 flex items-center justify-center text-[#F7D35F]">
                <Sparkles className="w-6 h-6 text-[#F7D35F] animate-pulse" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Gemini Governance Copilot</h3>
              <p className="text-sm text-[#F0EBEB]/60 leading-relaxed">
                Talk to your schedule in natural human language. Let our integrated AI analyze meeting rosters, evaluate school-day streaks, and auto-recommend optimal workspace agendas instantly.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#F7D35F] gap-1 group-hover:gap-2 transition-all">
              <span>Launch AI Sandbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE SANDBOX DEMO SECTION */}
      <section className="relative py-20 bg-black/15 z-10 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: descriptions of sandbox */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-mono font-bold text-[#F7D35F] uppercase tracking-widest">Interactive Experience</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Experience Faria Operations in real-time</h2>
              <p className="text-sm text-[#F0EBEB]/70 leading-relaxed">
                Click through the preview tabs to visualize the high-momentum tracking streams we use to map global academic rosters.
              </p>

              {/* Tabs list */}
              <div className="space-y-2 pt-4">
                {[
                  { id: "scheduling", title: "Overlap Schedulers", desc: "Discover consensus-free times." },
                  { id: "matrix", title: "Compliance Checklists", desc: "Mute keywords & protect GDPR data." },
                  { id: "analytics", title: "Global Roster Analytics", desc: "Evaluate team distribution across regions." }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSandboxTab(tab.id as any)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      activeSandboxTab === tab.id
                        ? "bg-white/5 border-[#E837AC] text-white shadow-lg"
                        : "bg-transparent border-transparent text-white/50 hover:text-white"
                    }`}
                  >
                    <h4 className="text-sm font-bold">{tab.title}</h4>
                    <p className="text-xs opacity-80 mt-0.5">{tab.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Mockup terminal container */}
            <div className="lg:col-span-7">
              <div className="bg-[#391638] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                
                {/* Header terminal controls */}
                <div className="h-12 bg-black/20 flex items-center justify-between px-5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <span className="w-3 h-3 rounded-full bg-[#F7D35F]/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono font-bold uppercase tracking-wider">
                    governance-matrix-v1.4.1.sys
                  </span>
                  <span className="w-4 h-4 rounded bg-white/5 flex items-center justify-center text-[10px] font-mono text-white/30">
                    &bull;
                  </span>
                </div>

                {/* Sandbox viewports based on tab */}
                <div className="p-8 min-h-[300px] flex flex-col justify-center">
                  {activeSandboxTab === "scheduling" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between bg-black/30 border border-white/5 rounded-xl p-4">
                        <div>
                          <p className="text-xs font-bold text-[#E837AC]">Academic Alignment Consensus</p>
                          <p className="text-[10px] text-white/40">London, Mumbai, and Tokyo streams verified</p>
                        </div>
                        <span className="text-[11px] font-bold text-[#F7D35F] bg-[#F7D35F]/10 px-2.5 py-1 rounded">Optimal Run</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-xl text-center">
                          <p className="text-[10px] text-white/40">Consensus Free-Block</p>
                          <p className="text-sm font-bold mt-1">11:30 - 13:00</p>
                          <span className="text-[9px] text-[#E837AC] font-mono">UTC TIMEZONE</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl text-center">
                          <p className="text-[10px] text-white/40">Average Availability</p>
                          <p className="text-sm font-bold mt-1">4.5 Hrs / Day</p>
                          <span className="text-[9px] text-[#F78843] font-mono">HIGH-MOMENTUM</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSandboxTab === "matrix" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 text-left"
                    >
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-[#F78843] mb-2 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#F78843]" />
                          GDPR Privacy Filter
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-white/60">
                            <span>Muted Keyword: "Staff Evaluation"</span>
                            <span className="text-emerald-400 font-bold">MUTED</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-white/60">
                            <span>Muted Keyword: "Board Meeting"</span>
                            <span className="text-emerald-400 font-bold">MUTED</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/40 italic">
                        * All non-compliant text strings are client-side filtered prior to calendar render cycles.
                      </p>
                    </motion.div>
                  )}

                  {activeSandboxTab === "analytics" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
                        <div>
                          <p className="text-xs font-bold">Roster Coverage Distribution</p>
                          <p className="text-[10px] text-white/40">Academic staff across global operations</p>
                        </div>
                        <span className="text-xs font-bold text-[#F7D35F]">99.8% SYNC</span>
                      </div>

                      <div className="space-y-2">
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#E837AC] to-[#F78843] w-4/5" />
                        </div>
                        <div className="flex justify-between text-[9px] text-white/50">
                          <span>EMEA (80%)</span>
                          <span>APAC (65%)</span>
                          <span>Americas (40%)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bottom console output strip */}
                <div className="h-10 bg-black/40 flex items-center px-5 border-t border-white/5 text-[9px] font-mono text-[#F7D35F]">
                  <span className="animate-pulse mr-2">&gt;_</span> Sync sequence successfully initialized. Overlap data ready.
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BOTTOM CALL TO ACTION */}
      <section className="py-28 relative z-10 overflow-hidden">
        {/* Dynamic backdrop accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#E837AC]/15 via-[#F78843]/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <div className="space-y-5">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to streamline your <br />
              educational operations?
            </h2>
            <p className="text-base md:text-lg text-[#F0EBEB]/70 max-w-2xl mx-auto leading-relaxed">
              Join thousands of academic administrators and curriculum leads worldwide who trust Faria to power their timezone alignments and compliance workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                id="cta-dashboard-btn"
                className="px-8 py-4 bg-[#E837AC] hover:bg-[#c92f93] text-white font-extrabold text-sm rounded-full shadow-lg shadow-[#E837AC]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Enter Faria Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  id="cta-login-btn"
                  className="px-8 py-4 bg-[#E837AC] hover:bg-[#c92f93] text-white font-extrabold text-sm rounded-full shadow-lg shadow-[#E837AC]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Authenticate Portal
                </Link>

                <button
                  onClick={handleDemoSignIn}
                  id="cta-demo-btn"
                  className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-sm rounded-full backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Explore Interactive Demo
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
