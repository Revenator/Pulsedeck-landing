import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isDemoActive, setIsDemoActive] = useState(false);

  useEffect(() => {
    if (isDemoActive) {
      document.title = "PulseDeck Console | Live SRE Telemetry & Cloudflare Command Center";
    } else {
      document.title = "PulseDeck | Next-Gen DevOps SRE Command Center & Cloud Telemetry";
    }
  }, [isDemoActive]);

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
