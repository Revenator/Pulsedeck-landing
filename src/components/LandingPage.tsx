import React, { useState } from "react";
import { 
  Activity, 
  Shield, 
  Cpu, 
  Github, 
  Cloud, 
  Lock, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Terminal, 
  DollarSign, 
  RefreshCw,
  Sliders,
  Download,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import PulseDeckIcon from "./PulseDeckIcon";

interface LandingPageProps {
  onLaunchDemo: () => void;
}

export default function LandingPage({ onLaunchDemo }: LandingPageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const faqs = [
    {
      q: "What is PulseDeck?",
      a: "PulseDeck is a self-hosted, privacy-first DevOps and SRE command center web application that aggregates real-time metrics from Cloudflare CDN edge infrastructure, GitHub Actions CI/CD workflows, and Google Gemini AI token consumption into a unified dashboard."
    },
    {
      q: "How does PulseDeck monitor Cloudflare edge traffic and purge caches?",
      a: "PulseDeck integrates with the Cloudflare API via secure server-side Express proxies, providing live visibility into edge requests, unique visitors, bandwidth delivered, DNS query surges, and instant one-click cache purging per zone."
    },
    {
      q: "How does PulseDeck monitor GitHub Actions pipelines?",
      a: "PulseDeck connects to GitHub repository workflows to display real-time commit statuses, build pass rates, open pull requests, and automated failure detection with webhook alerts."
    },
    {
      q: "How does Gemini AI token observability and incident reporting work?",
      a: "PulseDeck tracks Gemini model token burn, daily budget thresholds, and cost estimations, providing automated server-side AI incident analysis reports during build or traffic anomalies."
    },
    {
      q: "Is PulseDeck self-hosted and private?",
      a: "Yes. PulseDeck is 100% self-hosted with no external telemetry collection or third-party middleman servers. All API credentials remain protected server-side behind Express proxy routes."
    },
    {
      q: "What is included in the £50 commercial license?",
      a: "The £50 single purchase license grants full commercial access to the React, Express, and Recharts source code, multi-tenant workspace architecture, 4 brand color themes, offline simulation control room, and lifetime updates with no recurring subscription fees."
    }
  ];

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        // Automatically launch demo with premium features unlocked!
        onLaunchDemo();
      }, 2000);
    }, 1800);
  };

  return (
    <div id="landing-root" className="min-h-screen bg-[#09090B] text-slate-300 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Navbar */}
      <header id="landing-header" className="border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <PulseDeckIcon className="w-11 h-11" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono uppercase italic">PulseDeck</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-medium">
                  v3.0.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono">DevOps & AI Infrastructure</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors font-mono">Features</a>
            <a href="#v3-upgrades" className="hover:text-emerald-400 transition-colors font-mono">Specs</a>
            <a href="#privacy" className="hover:text-emerald-400 transition-colors font-mono">Privacy</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors font-mono">FAQ</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors font-mono">Pricing</a>
            <span className="text-white bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 text-xs font-mono">Self-Hosted</span>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLaunchDemo}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:border-white/10 transition-all font-mono text-xs flex items-center space-x-2 group"
            >
              <span>Explore Demo Console</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all text-xs font-mono shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Get PulseDeck (£50)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <PulseDeckIcon className="w-28 h-28" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8">
            Next-Gen DevOps Command Center
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] max-w-4xl mx-auto">
            Master Your Cloud <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">Privately.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The all-in-one dashboard for Cloudflare traffic, GitHub pipelines, and Gemini AI telemetry. Self-hosted, secure, and blazingly fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-3 group"
            >
              <span>Launch Live Command Center (Demo Version)</span>
              <Terminal className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex gap-4 items-center bg-white/5 border border-white/5 px-6 py-3 rounded-lg">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="text-white hover:text-emerald-400 transition-all font-bold text-sm font-mono uppercase"
              >
                Buy Template License — £50
              </button>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase text-slate-500">Payment by</span>
                <span className="text-white font-bold tracking-wider text-xs">STRIPE</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#111114] p-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm group">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl opacity-20 pointer-events-none"></div>
            {/* Window controls */}
            <div className="flex justify-between items-center px-4 pb-3 border-b border-white/5 relative z-10">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono bg-black/40 px-3 py-1 rounded border border-white/5">
                <Lock className="w-3 h-3 text-emerald-500 mr-1" />
                <span>pulsedeck.local/console/master</span>
              </div>
              <div className="w-12 h-3" />
            </div>

            {/* Dashboard Mockup Representation */}
            <div className="bg-[#09090B] rounded-b-xl overflow-hidden p-6 text-left relative min-h-[420px] z-10">
              {/* Header inside Mockup */}
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Global Operations Center</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-1">PulseDeck Global Operations</h3>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                  <span className="text-xs text-slate-400 font-mono">Global Health:</span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono font-mono">2 / 3 Healthy</span>
                </div>
              </div>

              {/* Stat grid inside mockup */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-mono">Combined Edge Traffic</span>
                    <Cloud className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">109,194</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">19,654 Unique (42.5 GB)</div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-mono">Gemini Token Burn</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-purple-400 font-mono">1679.6k</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Daily token quota limit tracking</div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-mono">CI/CD Pipeline Runs</span>
                    <Github className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">3 Active Repos</div>
                  <div className="text-[10px] text-rose-400 font-mono mt-1">⚠️ 1 build failure detected</div>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-mono">Active SRE Alerts</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono">3 Events</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Webhook Dispatch: Enabled</div>
                </div>
              </div>

              {/* Overlay with CTA in mockup */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/90 to-transparent flex flex-col items-center justify-end pb-12 px-6 text-center z-20">
                <div className="max-w-md bg-[#111114]/90 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                  <p className="text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">Fully Interactive Demo</p>
                  <h4 className="text-lg font-bold text-white mb-2">Experience the Command Center Now</h4>
                  <p className="text-slate-400 text-xs mb-5">
                    Click the live sandbox to experience theme customization, telemetry failure simulation, config porting, and the live diagnostics portal.
                  </p>
                  <button 
                    onClick={onLaunchDemo}
                    className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm font-mono flex items-center space-x-2 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <span>Launch Demo Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 px-6 border-t border-white/5 bg-[#09090B] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-widest mb-3">Enterprise Core</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Command Center Feature Modules</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every system and service is brought into high alignment with real-time feedback loops and intelligent analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cloudflare Traffic */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-8 hover:border-emerald-500/30 hover:bg-white/10 transition-colors duration-300 group">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 w-12 h-12 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Edge Traffic</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Monitor live DNS query surges, caching hit ratios, and bandwidth delivery curves. Includes an integrated resting API Cache Purging interface to flush edge files globally instantly.
              </p>
              <div className="border-t border-white/5 pt-4 flex items-center text-xs text-emerald-400 font-mono">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Zone ID & Token Configured</span>
              </div>
            </div>

            {/* GitHub CI/CD */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-8 hover:border-indigo-500/30 hover:bg-white/10 transition-colors duration-300 group">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 w-12 h-12 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <Github className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">CI/CD Status</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Integrate repo workflows to monitor pull requests, build states, and deploy timelines. Get immediate alerts upon pipeline crashes, trace error logs, and dispatch fallback triggers.
              </p>
              <div className="border-t border-white/5 pt-4 flex items-center text-xs text-indigo-400 font-mono">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Automated SRE Alerts</span>
              </div>
            </div>

            {/* Gemini AI Diagnostics */}
            <div className="bg-white/5 border border-white/5 rounded-xl p-8 hover:border-blue-500/30 hover:bg-white/10 transition-colors duration-300 group">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 w-12 h-12 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">AI Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Avoid API budget overruns. Track token burn across standard model aliases. Get server-side automated diagnostic reports during system events, powered by Gemini-powered health checks and automated insights.
              </p>
              <div className="border-t border-white/5 pt-4 flex items-center text-xs text-blue-400 font-mono">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Interactive AI SRE Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Version 3.0.0 Specs */}
      <section id="v3-upgrades" className="py-24 px-6 border-t border-white/5 bg-[#09090B] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300 tracking-wide font-mono uppercase">Version 3.0.0 Feature Specs</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-6">
                Now Upgraded: A Premium Commercial-Grade SaaS Template
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                PulseDeck v3.0.0 is engineered with premium features that make it instantly ready as a highly valuable digital asset, white-labelable, sellable, or portable:
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mr-4 mt-0.5">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Theme-Ready White-Labeling</h5>
                    <p className="text-slate-400 text-xs mt-1">Select from 4 built-in theme presets: Emerald Neon, Amber Warning, Indigo Corporate, and Sky Tech. Dynamic variables update button borders, active glows, and charts.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mr-4 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Offline Telemetry Control Room</h5>
                    <p className="text-slate-400 text-xs mt-1">Deliver pitch-perfect demos or client meetings. Simulation environments (Normal, Traffic Spike, Service Outage, and Dormant Space) inject realistic metric states offline.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mr-4 mt-0.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Portable JSON Workspace Backups</h5>
                    <p className="text-slate-400 text-xs mt-1">Export your customized layouts, API configurations, and alert settings to a JSON file. Drag-and-drop any saved backup to instantly configure new environments.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111114] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 bg-emerald-500/10 text-emerald-400 text-xs rounded-bl-xl font-mono border-l border-b border-white/5">
                defaultWorkspace.ts
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-4 font-mono">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>DevOps Configuration Blueprint</span>
              </div>
              
              <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto bg-black/40 p-4 rounded-xl border border-white/5">
                {`// src/constants/defaultWorkspace.ts
export const DEFAULT_GLOBAL_CONFIG = {
  dashboardName: "PulseDeck",
  theme: "emerald", // 'emerald' | 'amber' | 'indigo' | 'sky'
  simulationMode: "normal", // 'normal' | 'burst' | 'outage'
  alertWebhookUrl: "https://api.cloudflare.com/.../alerts",
};

export const DEFAULT_TENANTS = [
  {
    id: "acme-commerce",
    name: "Acme Commerce",
    domain: "acme-shop.io",
    cloudflare: { zoneId: "cf-zone-acme-prod-01", ... },
    github: { repoName: "acme-commerce-portal", ... },
    gemini: { selectedModel: "gemini-3.6-flash", ... }
  }
];`}
              </pre>
              <p className="text-slate-400 text-xs mt-4 italic">
                Abstractions facilitate seamless buyer distribution. Customize defaults once and sell globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Benefits */}
      <section id="privacy" className="py-24 px-6 border-t border-white/5 bg-[#09090B] relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#111114] to-transparent border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl">
              <div className="p-4 flex flex-col justify-center items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/10 text-center w-36 mb-8">
                <div className="bg-emerald-500/20 p-2 rounded-full mb-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                </div>
                <span className="text-white font-bold text-xs">Privacy First</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Zero Data Collection</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Self-Hosted. Uncompromising Privacy.
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                Unlike closed-source telemetry aggregators that process and resell your operational data, PulseDeck is 100% self-hosted on your infrastructure. Your API scoped tokens, zone certificates, and diagnostic logs remain inside your firewall at all times.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-white font-semibold text-sm flex items-center">
                    <Lock className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                    <span>Zero Data Collection</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">We never run centralized databases. Your metrics are retrieved directly on demand.</p>
                </div>

                <div>
                  <div className="text-white font-semibold text-sm flex items-center">
                    <Shield className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                    <span>Express Security Proxy</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Credentials never touch the browser. All requests are authenticated securely server-side.</p>
                </div>

                <div>
                  <div className="text-white font-semibold text-sm flex items-center">
                    <Terminal className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                    <span>100% Audit-Ready</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">The source code is fully transparent, allowing fast compliance approvals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Crawlable & Rich Results Optimized) */}
      <section id="faq" className="py-24 px-6 border-t border-white/5 bg-[#09090B] relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Everything You Need to Know About PulseDeck
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Answers to technical architecture, telemetry capabilities, self-hosting privacy, and commercial licensing questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? "bg-[#111114] border-emerald-500/30 shadow-lg shadow-emerald-500/5" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span className="font-bold text-white text-base leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div 
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-white/5"
                    >
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5 bg-[#09090B] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-widest mb-3">Simple Commercial License</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">PulseDeck Single Purchase</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              No subscription models. Secure full commercial access to the PulseDeck v3.0.0 SaaS template, server-side Express proxies, and lifetime simulation modules.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#111114] border-2 border-emerald-500/40 rounded-3xl p-8 relative shadow-xl shadow-emerald-500/5">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black font-semibold font-mono text-[10px] uppercase tracking-wider">
              Lifetime Commercial Access
            </div>

            <div className="text-center pb-8 border-b border-white/5">
              <h4 className="text-xl font-bold text-white mb-2">PulseDeck v3.0.0 Template</h4>
              <p className="text-slate-400 text-xs">Full React, Express & Recharts Source Repository</p>
              
              <div className="mt-6 flex items-baseline justify-center">
                <span className="text-white font-extrabold text-5xl">£50</span>
                <span className="text-slate-400 text-sm ml-2 font-mono">/ single payment</span>
              </div>
            </div>

            <ul className="py-8 space-y-4 text-sm text-slate-300">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>Full React + Express Source Files</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>4 Dynamic Brand Themes included</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>Offline Simulation Control Room</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>Google Gemini AI Telemetry proxies</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>Portable JSON workspace backups</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                <span>No recurring license subscriptions</span>
              </li>
            </ul>

            {/* Simulated Stripe Payment Form */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all text-center flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <span>Stripe Instant Buy (£50)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Secured by Stripe SSL Encryption.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <p>© 2026 PulseDeck DevOps SRE command center. Open-source commercial template under Apache 2.0 license.</p>
          <div className="flex space-x-6">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#v3-upgrades" className="hover:text-emerald-400 transition-colors">Specs</a>
            <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#landing-root" className="hover:text-emerald-400 transition-colors">Back to top</a>
          </div>
        </div>
      </footer>

      {/* Stripe Payment Modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-semibold text-lg"
            >
              ×
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-emerald-500 text-black rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white font-mono">Stripe Checkout</h4>
                <p className="text-xs text-slate-400">Secure Payment Portal</p>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h5 className="text-lg font-bold text-white mb-2 font-mono">License Activated!</h5>
                <p className="text-slate-300 text-sm">
                  Welcome to PulseDeck Premium. Launching your custom command center...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400">Order: PulseDeck v3.0.0 SaaS Template</p>
                    <p className="text-sm font-bold text-white mt-1">Single Commercial License</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Price</p>
                    <p className="text-lg font-extrabold text-emerald-400 font-mono">£50.00</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-400 leading-relaxed py-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Included with your purchase:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Full React/Express code</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>4 Brand Color Themes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>SRE Simulation Modules</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Lifetime Core Updates</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a 
                    href="https://buy.stripe.com/5kQeVe5Y91tme0Q8rf4Rq00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:scale-[1.01]"
                  >
                    <span>Proceed to Secure Stripe Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-mono uppercase">or evaluate offline</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    setIsProcessingPayment(true);
                    setTimeout(() => {
                      setIsProcessingPayment(false);
                      setPaymentSuccess(true);
                      setTimeout(() => {
                        setShowPaymentModal(false);
                        setPaymentSuccess(false);
                        onLaunchDemo();
                      }, 2000);
                    }, 1200);
                  }}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs border border-white/5 rounded-lg transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Unlocking demo environment...</span>
                    </>
                  ) : (
                    <span>Unlock Offline Demo (Instant Preview)</span>
                  )}
                </button>

                <p className="text-[10px] text-slate-500 text-center font-mono mt-3">
                  Clicking the primary button will securely redirect you to Stripe's payment page. Securely processed under full TLS/SSL protocols.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
