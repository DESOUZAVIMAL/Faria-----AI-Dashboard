import React from "react";
import Brief from "../components/Brief";
import Tasks from "../components/Tasks";
import Inbox from "../components/Inbox";

export default function TodayPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-fade-in">
      {/* Top row: Brief Component */}
      <section className="w-full">
        <Brief />
      </section>

      {/* Main Content Area: Two-Column Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Smaller, holds Tasks (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 h-full">
          <Tasks />
        </div>

        {/* Right Column: Larger, holds Inbox (8 cols) */}
        <div className="lg:col-span-8 xl:col-span-8 h-full">
          <Inbox />
        </div>
      </section>
    </main>
  );
}
