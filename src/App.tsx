import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isDemoActive, setIsDemoActive] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-slate-300 font-sans flex flex-col border-4 border-[#1e1e2e]">
      {isDemoActive ? (
        <Dashboard onBackToLanding={() => setIsDemoActive(false)} />
      ) : (
        <LandingPage onLaunchDemo={() => setIsDemoActive(true)} />
      )}
    </div>
  );
}
