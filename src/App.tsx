import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import TodayPage from "./pages/TodayPage";
import MatrixPage from "./pages/MatrixPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import { DashboardProvider } from "./lib/DashboardContext";
import { AuthProvider, useAuth } from "./lib/AuthContext";

// Simple ProtectedRoute wrapper checking authentication context
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Router>
          <div className="min-h-screen bg-[#391638] text-white selection:bg-[#E837AC]/20 selection:text-[#E837AC] font-sans antialiased relative overflow-hidden flex flex-col">
            {/* Sleek Faria "Tracks" design concept in the background representing forward momentum */}
            <div className="absolute top-0 right-0 w-full max-w-2xl h-[600px] pointer-events-none opacity-10 md:opacity-15" aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* High-momentum track 1 */}
                <path
                  d="M100 50 C 300 50, 450 250, 750 250"
                  stroke="url(#faria-track-grad)"
                  strokeWidth="48"
                  strokeLinecap="round"
                />
                {/* High-momentum track 2 */}
                <path
                  d="M50 200 C 250 200, 350 450, 800 450"
                  stroke="url(#faria-track-grad)"
                  strokeWidth="36"
                  strokeLinecap="round"
                />
                {/* High-momentum track 3 */}
                <path
                  d="M300 100 C 450 150, 500 400, 700 550"
                  stroke="url(#faria-track-grad)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <defs>
                  <linearGradient id="faria-track-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F78843" />
                    <stop offset="50%" stopColor="#E837AC" />
                    <stop offset="100%" stopColor="#F7D35F" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Top Navigation Bar */}
            <TopBar />

            {/* Primary Page Layout Container */}
            <div className="flex-1 relative z-10">
              <Routes>
                {/* Public Landing View */}
                <Route path="/" element={<LandingPage />} />

                {/* Public Login View */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Dashboard Route */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <TodayPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Compliance Matrix Route */}
                <Route
                  path="/matrix"
                  element={
                    <ProtectedRoute>
                      <MatrixPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Public Landing Page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Dynamic, human-centric footer matching Faria's voice */}
            <footer className="w-full py-6 mt-12 bg-[#391638] text-[#F0EBEB]/60 text-xs border-t border-white/5 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F7D35F]">Faria</span> Education Group
                </div>
                <div>
                  &copy; {new Date().getFullYear()} Faria Education Group. All rights reserved. Deliberated in British English.
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </DashboardProvider>
    </AuthProvider>
  );
}
