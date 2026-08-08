import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  Cloud, 
  Github, 
  Cpu, 
  AlertTriangle, 
  Sliders, 
  Terminal, 
  Shield, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Plus, 
  Settings, 
  BookOpen, 
  CheckCircle2, 
  X,
  Play,
  PlayCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  TenantWorkspace, 
  ThemeStyle, 
  SimulationMode, 
  GlobalDashboardConfig, 
  SystemEvent,
  EnvironmentType
} from "../types";
import { 
  DEFAULT_GLOBAL_CONFIG, 
  DEFAULT_TENANTS, 
  INITIAL_EVENTS 
} from "../constants/defaultWorkspace";
import PulseDeckIcon from "./PulseDeckIcon";

interface DashboardProps {
  onBackToLanding: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  // Global configurations state
  const [globalConfig, setGlobalConfig] = useState<GlobalDashboardConfig>(DEFAULT_GLOBAL_CONFIG);
  const [tenants, setTenants] = useState<TenantWorkspace[]>(DEFAULT_TENANTS);
  const [events, setEvents] = useState<SystemEvent[]>(INITIAL_EVENTS);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [envFilter, setEnvFilter] = useState<"All" | EnvironmentType>("All");
  
  // Tab states for selected tenant
  const [activeTab, setActiveTab] = useState<"overview" | "cloudflare" | "github" | "gemini">("overview");

  // Modals state
  const [showGlobalSettingsModal, setShowGlobalSettingsModal] = useState(false);
  const [showTenantSettingsModal, setShowTenantSettingsModal] = useState(false);
  const [showSetupGuideModal, setShowSetupGuideModal] = useState(false);
  const [tenantEditing, setTenantEditing] = useState<TenantWorkspace | null>(null);

  // New tenant creation states (Demo-friendly)
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantDomain, setNewTenantDomain] = useState("");
  const [newTenantEnv, setNewTenantEnv] = useState<EnvironmentType>("Production");
  const [newTenantRepoOwner, setNewTenantRepoOwner] = useState("");
  const [newTenantRepoName, setNewTenantRepoName] = useState("");

  // Gemini terminal report state
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System log terminal active.",
    "Awaiting diagnostics request..."
  ]);

  // Copy states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // JSON import input ref
  const importInputRef = useRef<HTMLInputElement>(null);

  // Selected Tenant helper
  const selectedTenant = tenants.find(t => t.id === activeTenantId) || null;

  // Active theme properties mapping
  const getThemeClass = (theme: ThemeStyle) => {
    switch (theme) {
      case "amber":
        return {
          textAccent: "text-amber-500",
          textAccentMuted: "text-amber-400",
          bgAccent: "bg-amber-500",
          bgAccentMuted: "bg-amber-500/10",
          borderAccent: "border-amber-500/20",
          borderAccentHover: "hover:border-amber-500/40",
          ringAccent: "focus:ring-amber-500",
          badgeClass: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
          strokeColor: "#f59e0b",
          gradientFrom: "from-amber-500/20",
          fillColor: "rgba(245, 158, 11, 0.2)"
        };
      case "indigo":
        return {
          textAccent: "text-indigo-400",
          textAccentMuted: "text-indigo-300",
          bgAccent: "bg-indigo-500",
          bgAccentMuted: "bg-indigo-500/10",
          borderAccent: "border-indigo-500/20",
          borderAccentHover: "hover:border-indigo-500/40",
          ringAccent: "focus:ring-indigo-500",
          badgeClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
          strokeColor: "#818cf8",
          gradientFrom: "from-indigo-500/20",
          fillColor: "rgba(129, 140, 248, 0.2)"
        };
      case "sky":
        return {
          textAccent: "text-sky-400",
          textAccentMuted: "text-sky-300",
          bgAccent: "bg-sky-500",
          bgAccentMuted: "bg-sky-500/10",
          borderAccent: "border-sky-500/20",
          borderAccentHover: "hover:border-sky-500/40",
          ringAccent: "focus:ring-sky-500",
          badgeClass: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
          strokeColor: "#38bdf8",
          gradientFrom: "from-sky-500/20",
          fillColor: "rgba(56, 189, 248, 0.2)"
        };
      case "emerald":
      default:
        return {
          textAccent: "text-emerald-400",
          textAccentMuted: "text-emerald-300",
          bgAccent: "bg-emerald-500",
          bgAccentMuted: "bg-emerald-500/10",
          borderAccent: "border-emerald-500/20",
          borderAccentHover: "hover:border-emerald-500/40",
          ringAccent: "focus:ring-emerald-500",
          badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
          strokeColor: "#34d399",
          gradientFrom: "from-emerald-500/20",
          fillColor: "rgba(52, 211, 153, 0.2)"
        };
    }
  };

  const tStyles = getThemeClass(globalConfig.theme);

  // Dynamic simulation tick to make graphs look realistic and metrics blip
  useEffect(() => {
    const interval = setInterval(() => {
      if (globalConfig.simulationMode === "dormant") return;

      setTenants(prevTenants => {
        return prevTenants.map(tenant => {
          let multiplier = 1.0;
          if (globalConfig.simulationMode === "burst") multiplier = 2.4;
          if (globalConfig.simulationMode === "outage") multiplier = 0.5;

          // Introduce a minor random delta for Cloudflare requests
          const reqDelta = Math.floor((Math.random() - 0.5) * 80 * multiplier);
          const newRequests = Math.max(100, tenant.cloudflare.requestsToday + reqDelta);
          const newVisitors = Math.max(50, Math.floor(tenant.cloudflare.uniqueVisitors + (reqDelta * 0.15)));
          const newBandwidth = Math.max(1, +(tenant.cloudflare.bandwidthServedGb + (reqDelta * 0.00035)).toFixed(2));
          
          // Token consumption delta
          const tokenDelta = Math.floor(Math.random() * 50 * multiplier);
          const newTokens = Math.max(100, tenant.gemini.tokensToday + tokenDelta);
          const newCost = +(newTokens * 0.00000015).toFixed(2);

          // Return mutated tenant config
          return {
            ...tenant,
            cloudflare: {
              ...tenant.cloudflare,
              requestsToday: newRequests,
              uniqueVisitors: newVisitors,
              bandwidthServedGb: newBandwidth
            },
            gemini: {
              ...tenant.gemini,
              tokensToday: newTokens,
              estCostToday: newCost
            }
          };
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [globalConfig.simulationMode]);

  // Adjust metrics based on simulation mode dropdown directly
  useEffect(() => {
    if (globalConfig.simulationMode === "dormant") {
      setTenants(prev => prev.map(t => ({
        ...t,
        cloudflare: { ...t.cloudflare, requestsToday: 0, uniqueVisitors: 0, bandwidthServedGb: 0, cacheHitRatio: 0, threatsBlocked: 0 },
        github: { ...t.github, rateLimitRemaining: 5000, openPrs: 0, passRate: 0, latestActionRun: { ...t.github.latestActionRun, status: "SUCCESS", duration: 0 } },
        gemini: { ...t.gemini, tokensToday: 0, estCostToday: 0 }
      })));
      setEvents([{
        id: "evt-dormant",
        tenantId: "system",
        tenantName: "Global",
        type: "warning",
        source: "System",
        message: "Simulation mode changed to DORMANT. Telemetry graphs flatlined.",
        timeAgo: "Just now"
      }]);
    } else if (globalConfig.simulationMode === "outage") {
      setTenants(prev => prev.map(t => ({
        ...t,
        cloudflare: { ...t.cloudflare, requestsToday: 12500, uniqueVisitors: 1500, cacheHitRatio: 45.2, threatsBlocked: 340 },
        github: { ...t.github, passRate: 40.5, latestActionRun: { ...t.github.latestActionRun, status: "FAILED", message: "502 Bad Gateway / Connection Reset on Edge Build Node" } },
        gemini: { ...t.gemini, tokensToday: 742000, estCostToday: 0.15 }
      })));
      setEvents([
        {
          id: "evt-outage-cf",
          tenantId: "system",
          tenantName: "Global",
          type: "error",
          source: "Cloudflare",
          message: "CRITICAL: Cloudflare Edge reporting extreme 502 Bad Gateway response clusters.",
          timeAgo: "Just now"
        },
        {
          id: "evt-outage-gh",
          tenantId: "acme-commerce",
          tenantName: "Acme Commerce",
          type: "error",
          source: "GitHub",
          message: "GitHub Pipeline Failure: Acme Master CI node timed out during container staging.",
          timeAgo: "1 minute ago"
        }
      ]);
    } else if (globalConfig.simulationMode === "burst") {
      setTenants(prev => prev.map(t => ({
        ...t,
        cloudflare: { ...t.cloudflare, requestsToday: 154000, uniqueVisitors: 28400, cacheHitRatio: 94.8 },
        gemini: { ...t.gemini, tokensToday: 1450200, estCostToday: 0.98 }
      })));
      setEvents([{
        id: "evt-burst",
        tenantId: "system",
        tenantName: "Global",
        type: "success",
        source: "Cloudflare",
        message: "Traffic surge tracking. Caching layers successfully mitigated 94.8% of client loads.",
        timeAgo: "Just now"
      }]);
    } else {
      // Restore Default normal telemetry
      setTenants(DEFAULT_TENANTS);
      setEvents(INITIAL_EVENTS);
    }
  }, [globalConfig.simulationMode]);

  // Copy zone ID helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dispatch Webhook call simulation
  const handleTestWebhook = async (tenantName: string) => {
    try {
      const response = await fetch("/api/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant: tenantName, eventType: "ALERT_DISPATCH" })
      });
      const data = await response.json();
      if (data.success) {
        alert(`🔔 Alert Webhook dispatched successfully!\nSent to: ${data.targetUrl}\nTimestamp: ${data.timestamp}`);
      }
    } catch (err) {
      alert("Simulated local webhook log dispatched to console (API offline).");
    }
  };

  // Cloudflare CDN cache purge action
  const handlePurgeCache = async (tenantId: string, zoneId: string) => {
    try {
      const response = await fetch("/api/cloudflare/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId, tenant: tenantId, purgeAll: true })
      });
      const data = await response.json();
      if (data.success) {
        alert(`🧹 Cloudflare cache successfully purged for zone ${zoneId}!\nOperation completed at: ${data.timestamp}`);
        
        // Add a fresh success event
        const newEvent: SystemEvent = {
          id: `evt-purge-${Date.now()}`,
          tenantId: tenantId,
          tenantName: tenants.find(t => t.id === tenantId)?.name || "Unknown",
          type: "success",
          source: "Cloudflare",
          message: `Cache Purge triggered successfully for zone: ${zoneId}`,
          timeAgo: "Just now"
        };
        setEvents(prev => [newEvent, ...prev]);
      }
    } catch (err) {
      alert("Simulated cache purged successfully (development offline fallback).");
    }
  };

  // Run SRE AI Diagnostics using Server Proxy endpoint
  const handleRunDiagnostics = async () => {
    if (!selectedTenant) return;
    setDiagnosticLoading(true);
    setDiagnosticReport("");
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Querying Gemini AI model registry...`,
      `[${new Date().toLocaleTimeString()}] Transferring server-side telemetry variables...`,
    ]);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant: selectedTenant.name,
          status: selectedTenant.env,
          metrics: {
            requests: selectedTenant.cloudflare.requestsToday,
            bandwidth: `${selectedTenant.cloudflare.bandwidthServedGb} GB`,
            pipelineState: selectedTenant.github.latestActionRun.status,
            tokenBurn: selectedTenant.gemini.tokensToday,
            activeAlerts: selectedTenant.alertThresholds.buildFailures ? 1 : 0
          },
          systemState: selectedTenant.github.latestActionRun.message
        })
      });

      const data = await response.json();
      setDiagnosticReport(data.report);
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Telemetry analysis complete. Model response received.`,
        `[${new Date().toLocaleTimeString()}] Diagnostics compiled using: ${data.modelUsed || 'fallback-ai'}.`
      ]);
    } catch (error: any) {
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Connection to live proxy timed out. Engaging fallback telemetry.`,
      ]);
    } finally {
      setDiagnosticLoading(false);
    }
  };

  // Worksheets Config Portability: Export Backup
  const handleExportConfig = () => {
    alert("🔒 Workspace Export is disabled in the Demo Version. Purchase a premium commercial template license to download full portable configuration JSON backups.");
  };

  // Worksheets Config Portability: Import Backup
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("🔒 Workspace Import is disabled in the Demo Version. Purchase a premium commercial template license to restore custom external JSON states.");
  };

  // Save edit of Tenant Settings
  const handleSaveTenantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantEditing) return;

    setTenants(prev => prev.map(t => t.id === tenantEditing.id ? tenantEditing : t));
    setShowTenantSettingsModal(false);
    setTenantEditing(null);

    // Add event log
    const logEvent: SystemEvent = {
      id: `evt-sett-${Date.now()}`,
      tenantId: tenantEditing.id,
      tenantName: tenantEditing.name,
      type: "info",
      source: "System",
      message: `Tenant workspace profile parameters updated.`,
      timeAgo: "Just now"
    };
    setEvents(prev => [logEvent, ...prev]);
  };

  // Create a new tenant workspace in the demo simulation
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantDomain) return;

    // Generate unique slug
    const generatedId = newTenantName.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || `tenant-${Date.now()}`;

    if (tenants.some(t => t.id === generatedId)) {
      alert("A tenant with this slug or name already exists. Please choose a different name.");
      return;
    }

    const newTenant: TenantWorkspace = {
      id: generatedId,
      name: newTenantName,
      domain: newTenantDomain,
      env: newTenantEnv,
      cloudflare: {
        zoneId: `cf-zone-${generatedId.slice(0, 15)}-01`,
        apiToken: "••••••••••••••••••••••••••••••••",
        requestsToday: Math.floor(Math.random() * 20000) + 10000,
        uniqueVisitors: Math.floor(Math.random() * 3000) + 1000,
        bandwidthServedGb: +(Math.random() * 8 + 3).toFixed(2),
        cacheHitRatio: +(Math.random() * 15 + 80).toFixed(1),
        threatsBlocked: Math.floor(Math.random() * 15),
      },
      github: {
        repoOwner: newTenantRepoOwner || "org",
        repoName: newTenantRepoName || "repository",
        accessToken: "••••••••••••••••••••••••••••••••",
        rateLimitRemaining: 5000,
        openPrs: Math.floor(Math.random() * 4) + 1,
        passRate: +(Math.random() * 10 + 90).toFixed(1),
        latestActionRun: {
          name: "Lint & Build",
          status: "SUCCESS",
          branch: "main",
          commitSha: Math.random().toString(16).substring(2, 9),
          duration: Math.floor(Math.random() * 60) + 60,
          trigger: "push",
          message: "Merge pull request #12 from branch-staging",
          timestamp: new Date().toISOString(),
        },
      },
      gemini: {
        apiKey: "••••••••••••••••••••••••••••••••",
        selectedModel: "gemini-3.6-flash",
        dailyTokenBudget: 500000,
        tokensToday: Math.floor(Math.random() * 150000) + 50000,
        estCostToday: +(Math.random() * 0.15).toFixed(2),
        autoTelemetry: true,
      },
      alertThresholds: {
        buildFailures: true,
        tokenSpikes: true,
        gatewayErrors: true,
      },
    };

    setTenants(prev => [...prev, newTenant]);

    const createLogEvent: SystemEvent = {
      id: `evt-create-${Date.now()}`,
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      type: "success",
      source: "System",
      message: `Created new tenant workspace: ${newTenant.name} (${newTenant.domain})`,
      timeAgo: "Just now"
    };
    setEvents(prev => [createLogEvent, ...prev]);

    // Reset states
    setNewTenantName("");
    setNewTenantDomain("");
    setNewTenantEnv("Production");
    setNewTenantRepoOwner("");
    setNewTenantRepoName("");
    setShowCreateTenantModal(false);
  };

  // Generate charts dummy time-series data dynamically based on tenant metrics
  const getRequestsChartData = () => {
    if (!selectedTenant) return [];
    
    let baseRequests = selectedTenant.cloudflare.requestsToday / 24;
    const cacheRatio = selectedTenant.cloudflare.cacheHitRatio / 100;

    const hours = ["01:21 PM", "03:21 PM", "05:21 PM", "07:21 PM", "09:21 PM", "11:21 PM", "01:21 AM", "03:21 AM", "05:21 AM", "07:21 AM", "09:21 AM", "12:21 PM"];
    
    return hours.map((hour, idx) => {
      // Simulate curves
      const sinCurve = Math.sin((idx / 12) * Math.PI * 2) * 0.3 + 1.0;
      const hourlyReqs = Math.floor(baseRequests * sinCurve);
      const cached = Math.floor(hourlyReqs * cacheRatio);
      const origin = Math.max(10, hourlyReqs - cached);

      return {
        time: hour,
        Requests: hourlyReqs,
        Cached: cached,
        Origin: origin
      };
    });
  };

  // Filtering tenants for display
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === "All" || t.env === envFilter;
    return matchesSearch && matchesEnv;
  });

  return (
    <div id="dashboard-root" className="min-h-screen bg-[#09090B] text-slate-300 font-sans p-6">
      {/* Upper Master Navigation Header bar */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5 mb-8">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBackToLanding}
            className="p-2 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 hover:text-white transition-all text-slate-400"
            title="Return to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <PulseDeckIcon className="w-10 h-10" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">{globalConfig.dashboardName}</h1>
              <span className="bg-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-white/5 font-mono">Master Console</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">Demo Version</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">Multi-Tenant Command Center v3.0.0</p>
          </div>
        </div>

        {/* Global Options Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Simulation mode warning badge */}
          {globalConfig.simulationMode !== "normal" && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="uppercase font-semibold tracking-wide">{globalConfig.simulationMode} Demo Active</span>
            </div>
          )}

          <button 
            onClick={() => setShowSetupGuideModal(true)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-white transition-all text-slate-300 font-mono text-xs flex items-center space-x-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide & Security</span>
          </button>

          <button 
            onClick={() => setShowGlobalSettingsModal(true)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-white transition-all text-slate-300 font-mono text-xs flex items-center space-x-2"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Global Settings</span>
          </button>

          <button 
            onClick={handleExportConfig}
            className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:border-white/10 transition-all"
            title="Download Workspace Backup Config"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            onClick={() => importInputRef.current?.click()}
            className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:border-white/10 transition-all"
            title="Upload Config Backup"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={importInputRef} 
            onChange={handleImportConfig} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </header>

      {/* Main Page: Master Tenant Dashboard View */}
      {!activeTenantId ? (
        <main className="max-w-7xl mx-auto">
          {/* Top Hero Operations Panel */}
          <div className="bg-[#111114] border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-80 h-48 bg-gradient-to-l ${tStyles.gradientFrom} to-transparent opacity-30 pointer-events-none blur-3xl`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Global Operations Command</span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Multi-Tenant Telemetry Stream</h2>
                <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
                  Monitoring across active CDN edge networks, CI pipelines, and Gemini model telemetries. Customize settings above to test severe outages or traffic bursts.
                </p>
              </div>

              {/* Aggregated global overview indicators */}
              <div className="flex items-center gap-4">
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center min-w-[120px]">
                  <p className="text-[10px] text-slate-500 font-mono">GLOBAL HEALTH</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
                    {globalConfig.simulationMode === "outage" ? "1 / 3" : "3 / 3"} OK
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-center min-w-[120px]">
                  <p className="text-[10px] text-slate-500 font-mono">SIMULATOR STATE</p>
                  <p className="text-lg font-bold text-sky-400 font-mono mt-1 uppercase text-xs">
                    {globalConfig.simulationMode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenants Section Header / Filter Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${tStyles.bgAccent} animate-pulse`} />
              <h3 className="font-mono text-sm font-semibold tracking-wide uppercase text-slate-300">
                Tenant Projects ({filteredTenants.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tenants or domains..."
                  className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-lg text-slate-300 text-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Environment Filter buttons */}
              <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5 text-xs font-mono">
                {(["All", "Production", "Staging", "Development"] as const).map(env => (
                  <button
                    key={env}
                    onClick={() => setEnvFilter(env)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      envFilter === env 
                        ? `${tStyles.bgAccent} text-black font-semibold shadow-sm` 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>

              {/* Create Tenant Button */}
              <button
                onClick={() => setShowCreateTenantModal(true)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg ${tStyles.bgAccent} hover:opacity-90 text-black text-xs font-bold font-mono transition-all`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Tenant</span>
              </button>
            </div>
          </div>

          {/* Grid of Tenant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {filteredTenants.map(tenant => (
              <div 
                key={tenant.id}
                onClick={() => {
                  setActiveTenantId(tenant.id);
                  setActiveTab("overview");
                }}
                className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-200 cursor-pointer group relative flex flex-col justify-between"
              >
                {/* Upper row: Name & Environment badge */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {tenant.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{tenant.domain}</p>
                    </div>
                    
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                      tenant.env === "Production" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : tenant.env === "Staging"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    }`}>
                      {tenant.env}
                    </span>
                  </div>

                  {/* Summary telemetry mini rows */}
                  <div className="space-y-3 mb-6">
                    {/* Cloudflare Edge summary */}
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-400">
                        <Cloud className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                        <span>Cloudflare Edge</span>
                      </div>
                      <div className="text-slate-200 font-mono text-right">
                        <div>{tenant.cloudflare.requestsToday.toLocaleString()} reqs</div>
                        <div className="text-[10px] text-slate-500">Cache: {tenant.cloudflare.cacheHitRatio}%</div>
                      </div>
                    </div>

                    {/* GitHub pipeline summary */}
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-400">
                        <Github className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0" />
                        <span>GitHub Actions</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                          tenant.github.latestActionRun.status === "FAILED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {tenant.github.latestActionRun.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">Pass rate: {tenant.github.passRate}%</div>
                      </div>
                    </div>

                    {/* Gemini AI Summary */}
                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center text-slate-400">
                        <Cpu className="w-3.5 h-3.5 text-purple-400 mr-2 shrink-0" />
                        <span>Gemini Telemetry</span>
                      </div>
                      <div className="text-slate-200 font-mono text-right">
                        <div>{(tenant.gemini.tokensToday / 1000).toFixed(1)}k tokens</div>
                        <div className="text-[10px] text-slate-500">
                          {Math.floor((tenant.gemini.tokensToday / tenant.gemini.dailyTokenBudget) * 100)}% budget
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer click actions */}
                <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs">
                  <span className={`font-mono text-[10px] group-hover:underline ${tStyles.textAccent}`}>
                    Open Workspace Dashboard
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}

            {/* Empty state fallback */}
            {filteredTenants.length === 0 && (
              <div className="col-span-3 bg-[#111114] border border-dashed border-white/5 rounded-2xl p-12 text-center text-slate-400 font-mono text-sm">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                <p>No tenant projects found matching the active filters.</p>
              </div>
            )}
          </div>

          {/* Master Log Feed list */}
          <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-sm font-semibold tracking-wide uppercase text-slate-300">
                Combined Operational Log Stream
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Live Sync Status: OK</span>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-start justify-between bg-black/40 border border-white/5 p-4 rounded-xl text-xs">
                  <div className="flex items-start space-x-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      evt.type === "error" 
                        ? "bg-rose-500" 
                        : evt.type === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{evt.tenantName}</span>
                        <span className="text-slate-500 font-mono">[{evt.source}]</span>
                      </div>
                      <p className="text-slate-300 mt-1">{evt.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0 whitespace-nowrap ml-4">
                    {evt.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        /* Detailed Tenant Workspace View */
        <main className="max-w-7xl mx-auto">
          {/* Back & Tenant Header panel */}
          <div className="bg-[#111114] border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setActiveTenantId(null)}
                  className="p-2.5 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 hover:text-white transition-all text-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-2xl font-bold tracking-tight text-white">{selectedTenant.name}</h2>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      {selectedTenant.env}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">{selectedTenant.domain}</p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => handlePurgeCache(selectedTenant.id, selectedTenant.cloudflare.zoneId)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-amber-400 font-mono text-xs rounded-lg transition-all"
                >
                  🧹 Purge Cloudflare Cache
                </button>
                <button 
                  onClick={() => handleTestWebhook(selectedTenant.name)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-sky-400 font-mono text-xs rounded-lg transition-all"
                >
                  📡 Dispatch Test Alert
                </button>
                <button 
                  onClick={() => {
                    setTenantEditing(selectedTenant);
                    setShowTenantSettingsModal(true);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 font-mono text-xs rounded-lg transition-all flex items-center space-x-2"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configure Workspace</span>
                </button>
              </div>
            </div>

            {/* Inner Workspace Tabs */}
            <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/5 mt-6 text-xs font-mono max-w-md">
              {(["overview", "cloudflare", "github", "gemini"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-center rounded-lg transition-all capitalize ${
                    activeTab === tab 
                      ? `${tStyles.bgAccent} text-black font-semibold shadow-sm` 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT: 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab("cloudflare")}
                  className="bg-[#111114] border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                    <span className="font-mono">Cloudflare Edge Telemetry</span>
                    <Cloud className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">
                    {selectedTenant.cloudflare.requestsToday.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Requests Today ({selectedTenant.cloudflare.bandwidthServedGb} GB)
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-emerald-400 font-mono">
                    <span>Cache Hit: {selectedTenant.cloudflare.cacheHitRatio}%</span>
                    <span>Threats Shield: {selectedTenant.cloudflare.threatsBlocked} Blocked</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("github")}
                  className="bg-[#111114] border border-white/5 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                    <span className="font-mono">GitHub Action Runners</span>
                    <Github className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      selectedTenant.github.latestActionRun.status === "FAILED" ? "bg-rose-500" : "bg-emerald-500"
                    }`} />
                    <span>{selectedTenant.github.latestActionRun.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Latest commit sha: <span className="text-slate-200">{selectedTenant.github.latestActionRun.commitSha}</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-sky-400 font-mono">
                    <span>Workflow Pass Rate: {selectedTenant.github.passRate}%</span>
                    <span>Rate limits: {selectedTenant.github.rateLimitRemaining} / 5000</span>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("gemini")}
                  className="bg-[#111114] border border-white/5 rounded-xl p-5 hover:border-purple-500/30 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                    <span className="font-mono">Google Gemini Telemetries</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 font-mono">
                    {Math.floor(selectedTenant.gemini.tokensToday / 1000)}k
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Tokens consumed of {selectedTenant.gemini.dailyTokenBudget.toLocaleString()} budget
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-purple-400 font-mono">
                    <span>Est Daily Cost: ${selectedTenant.gemini.estCostToday}</span>
                    <span>Model: {selectedTenant.gemini.selectedModel}</span>
                  </div>
                </div>
              </div>

              {/* Combined Tenant Log feed */}
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                <h3 className="font-mono text-xs font-semibold uppercase text-slate-400 mb-4">
                  Workspace Operational Stream
                </h3>
                <div className="space-y-3">
                  {events.filter(e => e.tenantId === selectedTenant.id).map(evt => (
                    <div key={evt.id} className="flex items-start justify-between bg-black/40 border border-white/5 p-4 rounded-xl text-xs">
                      <div className="flex items-start space-x-3">
                        <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          evt.type === "error" ? "bg-rose-500" : evt.type === "warning" ? "bg-amber-500" : "bg-emerald-500"
                        }`} />
                        <div>
                          <span className="font-mono text-[10px] text-slate-500">[{evt.source}]</span>
                          <p className="text-slate-300 mt-1">{evt.message}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-4">{evt.timeAgo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. CLOUDFLARE CDN */}
          {activeTab === "cloudflare" && (
            <div className="space-y-6">
              {/* Detailed metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">TOTAL REQUESTS</span>
                  <span className="text-xl font-bold text-white font-mono block mt-1">
                    {selectedTenant.cloudflare.requestsToday.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Edge Traffic</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">UNIQUE VISITORS</span>
                  <span className="text-xl font-bold text-white font-mono block mt-1">
                    {selectedTenant.cloudflare.uniqueVisitors.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Distinct IP Hashes</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">BANDWIDTH USED</span>
                  <span className="text-xl font-bold text-white font-mono block mt-1">
                    {selectedTenant.cloudflare.bandwidthServedGb} GB
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Global Edge POPs</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">CACHE HIT RATIO</span>
                  <span className="text-xl font-bold text-white font-mono block mt-1">
                    {selectedTenant.cloudflare.cacheHitRatio}%
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Edge Offload</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">THREATS SHIELD</span>
                  <span className="text-xl font-bold text-rose-400 font-mono block mt-1">
                    {selectedTenant.cloudflare.threatsBlocked}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">WAF & Bot Mitigation</span>
                </div>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area Chart - Requests & Throughput */}
                <div className="bg-[#111114] border border-white/10 rounded-2xl p-5 lg:col-span-2">
                  <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-4">
                    Edge Requests & Caching Throughput
                  </h4>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getRequestsChartData()}>
                        <defs>
                          <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={tStyles.strokeColor} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={tStyles.strokeColor} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOrigin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3}/>
                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false}/>
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false}/>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}/>
                        <Area type="monotone" dataKey="Requests" stroke={tStyles.strokeColor} fillOpacity={1} fill="url(#colorReq)" strokeWidth={2}/>
                        <Area type="monotone" dataKey="Origin" stroke="#f43f5e" fillOpacity={1} fill="url(#colorOrigin)" strokeWidth={1.5}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-6 text-xs font-mono mt-2 text-slate-400">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tStyles.strokeColor }} />
                      <span>Total Requests (CDN)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-rose-500 mr-2" />
                      <span>Origin Fallbacks</span>
                    </div>
                  </div>
                </div>

                {/* HTTP Status Breakdown bar chart */}
                <div className="bg-[#111114] border border-white/10 rounded-2xl p-5">
                  <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-4">
                    HTTP Response Status Breakdown
                  </h4>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { name: "200 OK", count: Math.floor(selectedTenant.cloudflare.requestsToday * 0.94), color: "#10b981" },
                          { name: "302 RED", count: Math.floor(selectedTenant.cloudflare.requestsToday * 0.035), color: "#3b82f6" },
                          { name: "404 ERR", count: Math.floor(selectedTenant.cloudflare.requestsToday * 0.018), color: "#f59e0b" },
                          { name: "5xx CRIT", count: Math.floor(selectedTenant.cloudflare.requestsToday * (globalConfig.simulationMode === "outage" ? 0.08 : 0.007)), color: "#f43f5e" }
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3}/>
                        <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false}/>
                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false}/>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}/>
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {[
                            { color: "#10b981" },
                            { color: "#3b82f6" },
                            { color: "#f59e0b" },
                            { color: "#f43f5e" }
                          ].map((item, index) => (
                            <Cell key={`cell-${index}`} fill={item.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Cache Purge form */}
              <div className="bg-[#111114] border border-white/10 p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-white mb-2">Direct Edge Cache Purge Interface</h4>
                <p className="text-xs text-slate-400 mb-4">Trigger rapid CDN edge assets flush across all global points of presence.</p>
                
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1">Target Zone ID</label>
                    <input 
                      type="text" 
                      readOnly
                      value={selectedTenant.cloudflare.zoneId}
                      className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-slate-300 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => handlePurgeCache(selectedTenant.id, selectedTenant.cloudflare.zoneId)}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono shrink-0 h-9"
                  >
                    Purge Everything Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. GITHUB CI/CD */}
          {activeTab === "github" && (
            <div className="space-y-6">
              {/* Detailed metrics row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">REPOSITORY TARGET</span>
                  <span className="text-sm font-bold text-white block mt-1 font-mono">
                    {selectedTenant.github.repoOwner}/{selectedTenant.github.repoName}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Active webhooks bound</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">WORKFLOW PASS RATE</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold text-white font-mono">{selectedTenant.github.passRate}%</span>
                    <div className="flex-1 bg-black/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${selectedTenant.github.passRate}%` }} 
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Actions run health</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">OPEN PULL REQUESTS</span>
                  <span className="text-xl font-bold text-white font-mono block mt-1">
                    {selectedTenant.github.openPrs} Active
                  </span>
                  <span className="text-[9px] text-sky-400 font-mono mt-0.5 block">Requires review</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">GITHUB API QUOTA</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold text-white font-mono">
                      {selectedTenant.github.rateLimitRemaining}
                    </span>
                    <span className="text-slate-500 text-xs">/ 5000</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">95% limit remaining</span>
                </div>
              </div>

              {/* Workflows List */}
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-4">
                  GitHub Actions CI/CD Workflows
                </h4>

                <div className="space-y-3">
                  {[
                    { name: "CI/CD Pipeline", file: "deploy-production.yml", status: selectedTenant.github.latestActionRun.status, branch: selectedTenant.github.latestActionRun.branch },
                    { name: "Lint & Typecheck", file: "code-quality.yml", status: "SUCCESS" as const, branch: "fix/auth-leak" },
                    { name: "Security Vulnerability Audit", file: "snyk-scan.yml", status: "SUCCESS" as const, branch: "main" },
                    { name: "E2E Cypress Tests", file: "e2e-tests.yml", status: "SUCCESS" as const, branch: "main" }
                  ].map((wf, idx) => (
                    <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-white text-sm">{wf.name}</h5>
                          <span className="text-slate-500 font-mono text-xs">({wf.file})</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Branch: <span className="text-slate-300">{wf.branch}</span> • SHA: {selectedTenant.github.latestActionRun.commitSha}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                          wf.status === "FAILED"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {wf.status}
                        </span>
                        
                        <button 
                          onClick={() => alert(`Simulated GitHub action pipeline '${wf.name}' run triggered.`)}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-mono rounded flex items-center space-x-1"
                        >
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>Run</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. GEMINI AI TELEMETRY */}
          {activeTab === "gemini" && (
            <div className="space-y-6">
              {/* Token stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">DAILY TOKEN BURN</span>
                  <span className="text-xl font-bold text-purple-400 font-mono block mt-1">
                    {selectedTenant.gemini.tokensToday.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Input + Output</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">QUOTA UTILIZATION</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xl font-bold text-white font-mono">
                      {Math.floor((selectedTenant.gemini.tokensToday / selectedTenant.gemini.dailyTokenBudget) * 100)}%
                    </span>
                    <div className="flex-1 bg-black/40 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full" 
                        style={{ width: `${Math.min(100, (selectedTenant.gemini.tokensToday / selectedTenant.gemini.dailyTokenBudget) * 100)}%` }} 
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                    Limit: {selectedTenant.gemini.dailyTokenBudget.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">EST. TODAY BILLING</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono block mt-1">
                    ${selectedTenant.gemini.estCostToday}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">Model Billing Meter</span>
                </div>

                <div className="bg-[#111114] border border-white/5 rounded-xl p-4">
                  <span className="text-[10px] text-slate-500 font-mono block">ACTIVE MODEL PROFILE</span>
                  <span className="text-sm font-bold text-white font-mono block mt-1">
                    {selectedTenant.gemini.selectedModel}
                  </span>
                  <span className="text-[9px] text-purple-400 font-mono mt-1 block">Avg Latency: 215ms</span>
                </div>
              </div>

              {/* Gemini diagnostics terminal - server proxy */}
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white font-mono">Live Gemini AI SRE Diagnostic Terminal</h4>
                  </div>
                  <button 
                    onClick={handleRunDiagnostics}
                    disabled={diagnosticLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs font-mono rounded-lg transition-all flex items-center space-x-2"
                  >
                    {diagnosticLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Compiling Diagnostics...</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 mr-1" />
                        <span>Run SRE Diagnostics</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Split Panel: Left terminal logs, Right diagnostics output */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Terminal console */}
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[11px] h-[340px] overflow-y-auto text-slate-400 space-y-2">
                    <div className="text-slate-500">PulseDeck OS Diagnostics v3.0.0</div>
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className={log.includes("complete") ? "text-emerald-400" : log.includes("Engaging") ? "text-amber-500" : "text-slate-300"}>
                        {log}
                      </div>
                    ))}
                    {diagnosticLoading && (
                      <div className="text-purple-400 animate-pulse">Running server-side diagnostic analysis (Express api proxy `/api/diagnose`)...</div>
                    )}
                  </div>

                  {/* Diagnostics Report display */}
                  <div className="bg-black/40 p-5 rounded-xl border border-white/5 h-[340px] overflow-y-auto text-xs leading-relaxed text-slate-300">
                    {diagnosticReport ? (
                      <div className="prose prose-invert prose-xs max-w-none">
                        <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded border border-purple-500/20 mb-4 inline-block font-mono text-[10px]">
                          Report Model: gemini-3.6-flash
                        </div>
                        {/* Markdown representation simplified */}
                        <div className="whitespace-pre-wrap font-sans">{diagnosticReport}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono">
                        <Cpu className="w-8 h-8 text-slate-700 mb-2 animate-pulse" />
                        <p>No diagnostics ran. Click the run button to initiate an automated model analysis.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Models Matrix */}
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-4">
                  Google Gemini Model Suite & Matrix (17 Models)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Gemini 3.6 Flash", alias: "gemini-3.6-flash", type: "Text & Reasoning", cost: "$0.0001 / 1k tokens", speed: "Ultra-fast" },
                    { name: "Gemini 3.1 Pro (Preview)", alias: "gemini-3.1-pro-preview", type: "Complex Text & Code", cost: "$0.00125 / 1k tokens", speed: "Extremely deep reasoning" },
                    { name: "Gemini 3.1 Flash Lite", alias: "gemini-3.1-flash-lite", type: "Fast & Lightweight", cost: "$0.000075 / 1k tokens", speed: "Instantaneous" }
                  ].map((model, idx) => (
                    <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-white text-sm">{model.name}</h5>
                          {model.alias === selectedTenant.gemini.selectedModel && (
                            <span className="bg-purple-500/10 text-purple-400 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/20 font-mono">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{model.type}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">Cost parameter: {model.cost}</p>
                        <p className="text-[10px] text-slate-500 font-mono">Latency profile: {model.speed}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setTenants(prev => prev.map(t => t.id === selectedTenant.id ? {
                            ...t,
                            gemini: { ...t.gemini, selectedModel: model.alias }
                          } : t));
                          alert(`Model changed to '${model.alias}' successfully.`);
                        }}
                        className="mt-4 w-full py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-mono rounded"
                      >
                        Set Active Model
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* MODAL 1: GLOBAL DASHBOARD SETTINGS */}
      {showGlobalSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowGlobalSettingsModal(false)} />
          
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-2xl">
            <button 
              onClick={() => setShowGlobalSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-semibold"
            >
              ×
            </button>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
              <Settings className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Global Dashboard Settings</h4>
            </div>

            <div className="space-y-4">
              {/* Dashboard Name */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Global Dashboard Name</label>
                <input 
                  type="text" 
                  value={globalConfig.dashboardName}
                  onChange={(e) => setGlobalConfig({ ...globalConfig, dashboardName: e.target.value })}
                  placeholder="PulseDeck"
                  className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1.5">Brand Theme Palette</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["emerald", "amber", "indigo", "sky"] as const).map(th => (
                    <button
                      key={th}
                      onClick={() => setGlobalConfig({ ...globalConfig, theme: th })}
                      className={`py-2 px-3 rounded-lg border text-xs font-mono capitalize transition-all ${
                        globalConfig.theme === th
                          ? "bg-white/10 text-white border-emerald-500 shadow-md shadow-emerald-500/5 font-semibold"
                          : "bg-black/40 text-slate-400 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Mode Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Telemetry Simulation Environment</label>
                <select 
                  value={globalConfig.simulationMode}
                  onChange={(e) => setGlobalConfig({ ...globalConfig, simulationMode: e.target.value as SimulationMode })}
                  className="w-full px-3 py-2.5 bg-black/40 border border-white/5 rounded-lg text-slate-200 text-sm focus:border-emerald-500 focus:outline-none font-mono"
                >
                  <option value="normal">Normal: Stable Steady Metrics</option>
                  <option value="burst">High Traffic Burst: Simulated Product Launch</option>
                  <option value="outage">Severe Service Outage: Crash states & 502 errors</option>
                  <option value="dormant">Dormant Space: Flatline empty Command Center</option>
                </select>
              </div>

              {/* Webhook alert targets */}
              <div>
                <label className="block text-xs font-mono font-medium text-slate-400 mb-1">Global Alert Webhook Target</label>
                <input 
                  type="text" 
                  readOnly
                  value={globalConfig.alertWebhookUrl}
                  placeholder="Locked in Demo Version"
                  className="w-full px-3 py-2 bg-black/40 border border-white/5 rounded-lg text-slate-400 text-sm focus:outline-none font-mono cursor-not-allowed"
                />
                <span className="text-[9px] text-amber-500 font-mono mt-1 block">🔒 Webhook URL modification is locked in Demo Version</span>
              </div>

              {/* Strict proxy check box */}
              <div className="flex items-center space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  id="strictEnvOverride"
                  checked={globalConfig.strictEnvOverride}
                  onChange={(e) => setGlobalConfig({ ...globalConfig, strictEnvOverride: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 bg-black/40 border-white/5"
                />
                <label htmlFor="strictEnvOverride" className="text-xs text-slate-300 font-mono cursor-pointer select-none">
                  Strictly enforce local server-side env file configuration credentials.
                </label>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-right">
              <button 
                onClick={() => setShowGlobalSettingsModal(false)}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono"
              >
                Apply System Configurations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TENANT WORKSPACE PARAMETERS EDIT */}
      {showTenantSettingsModal && tenantEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTenantSettingsModal(false)} />
          
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative z-10 shadow-2xl my-auto">
            <button 
              onClick={() => setShowTenantSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-semibold"
            >
              ×
            </button>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Configure Tenant Settings: {tenantEditing.name}</h4>
            </div>

            <form onSubmit={handleSaveTenantSettings} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {/* Identity block */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Tenant Identity Parameters</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Project Name *</label>
                    <input 
                      type="text" 
                      required
                      value={tenantEditing.name}
                      onChange={(e) => setTenantEditing({ ...tenantEditing, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Primary Domain *</label>
                    <input 
                      type="text" 
                      required
                      value={tenantEditing.domain}
                      onChange={(e) => setTenantEditing({ ...tenantEditing, domain: e.target.value })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Cloudflare block */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-wider">Cloudflare CDN Credentials</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Zone ID *</label>
                    <input 
                      type="text" 
                      required
                      value={tenantEditing.cloudflare.zoneId}
                      onChange={(e) => setTenantEditing({ 
                        ...tenantEditing, 
                        cloudflare: { ...tenantEditing.cloudflare, zoneId: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">API Scoped Token *</label>
                    <input 
                      type="password" 
                      readOnly
                      value={tenantEditing.cloudflare.apiToken}
                      placeholder="Locked in Demo"
                      className="w-full px-3 py-2 bg-[#16161a]/60 border border-white/5 rounded-lg text-slate-400 text-xs focus:outline-none font-mono cursor-not-allowed"
                    />
                    <span className="text-[9px] text-amber-500 font-mono mt-1 block">🔒 Scoped Token locked in Demo Version</span>
                  </div>
                </div>
              </div>

              {/* GitHub Credentials */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">GitHub CI/CD Credentials</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Owner *</label>
                    <input 
                      type="text" 
                      required
                      value={tenantEditing.github.repoOwner}
                      onChange={(e) => setTenantEditing({ 
                        ...tenantEditing, 
                        github: { ...tenantEditing.github, repoOwner: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Repository *</label>
                    <input 
                      type="text" 
                      required
                      value={tenantEditing.github.repoName}
                      onChange={(e) => setTenantEditing({ 
                        ...tenantEditing, 
                        github: { ...tenantEditing.github, repoName: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">PAT Token *</label>
                    <input 
                      type="password" 
                      readOnly
                      value={tenantEditing.github.accessToken}
                      placeholder="Locked in Demo"
                      className="w-full px-3 py-2 bg-[#16161a]/60 border border-white/5 rounded-lg text-slate-400 text-xs focus:outline-none font-mono cursor-not-allowed"
                    />
                    <span className="text-[9px] text-sky-400 font-mono mt-1 block">🔒 Github token locked in Demo Version</span>
                  </div>
                </div>
              </div>

              {/* Gemini block */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider">Google Gemini API / AI Studio Configs</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Gemini API Key</label>
                    <input 
                      type="password" 
                      readOnly
                      value={tenantEditing.gemini.apiKey}
                      placeholder="Locked in Demo"
                      className="w-full px-3 py-2 bg-[#16161a]/60 border border-white/5 rounded-lg text-slate-400 text-xs focus:outline-none font-mono cursor-not-allowed"
                    />
                    <span className="text-[9px] text-purple-400 font-mono mt-1 block">🔒 Gemini key locked in Demo Version</span>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Model Profile</label>
                    <select 
                      value={tenantEditing.gemini.selectedModel}
                      onChange={(e) => setTenantEditing({ 
                        ...tenantEditing, 
                        gemini: { ...tenantEditing.gemini, selectedModel: e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                    >
                      <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Preview)</option>
                      <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Token Quota Budget</label>
                    <input 
                      type="number" 
                      value={tenantEditing.gemini.dailyTokenBudget}
                      onChange={(e) => setTenantEditing({ 
                        ...tenantEditing, 
                        gemini: { ...tenantEditing.gemini, dailyTokenBudget: +e.target.value } 
                      })}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Alert thresholds */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Tenant Alert Thresholds</p>
                <div className="flex flex-wrap gap-6 text-xs font-mono">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={tenantEditing.alertThresholds.buildFailures}
                      onChange={(e) => setTenantEditing({
                        ...tenantEditing,
                        alertThresholds: { ...tenantEditing.alertThresholds, buildFailures: e.target.checked }
                      })}
                      className="rounded bg-[#16161a] text-emerald-500 border-white/5"
                    />
                    <span>SRE pipeline build failures</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={tenantEditing.alertThresholds.tokenSpikes}
                      onChange={(e) => setTenantEditing({
                        ...tenantEditing,
                        alertThresholds: { ...tenantEditing.alertThresholds, tokenSpikes: e.target.checked }
                      })}
                      className="rounded bg-[#16161a] text-emerald-500 border-white/5"
                    />
                    <span>Gemini token spike warnings</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={tenantEditing.alertThresholds.gatewayErrors}
                      onChange={(e) => setTenantEditing({
                        ...tenantEditing,
                        alertThresholds: { ...tenantEditing.alertThresholds, gatewayErrors: e.target.checked }
                      })}
                      className="rounded bg-[#16161a] text-emerald-500 border-white/5"
                    />
                    <span>CDN 5xx bad gateway spikes</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 text-right space-x-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowTenantSettingsModal(false);
                    setTenantEditing(null);
                  }}
                  className="px-4 py-2 border border-white/5 rounded-lg hover:border-white/10 font-mono text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg font-mono text-xs"
                >
                  Apply Workspace Profiles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SETUP GUIDE & SECURITY ARCHITECTURE */}
      {showSetupGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSetupGuideModal(false)} />
          
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative z-10 shadow-2xl my-auto">
            <button 
              onClick={() => setShowSetupGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-semibold"
            >
              ×
            </button>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white font-mono">PulseDeck Setup & Security Architecture</h4>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto text-xs pr-2">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                <h5 className="font-bold text-white text-sm mb-2">🛡️ Safe Express API Key Proxying Architecture</h5>
                <p className="text-slate-300 leading-relaxed">
                  PulseDeck handles sensitive tokens securely. Direct usage of keys like Google Gemini API keys inside client browsers exposes them to client inspection.
                </p>
                <div className="bg-[#16161a] p-3 rounded border border-white/5 font-mono text-[10px] text-slate-400 mt-3 leading-relaxed">
                  Browser client requests <span className="text-emerald-400">/api/diagnose</span> → Express backend proxy parses parameters → Server queries Google GenAI registry safely via <span className="text-purple-400">process.env.GEMINI_API_KEY</span>. Key never leaves host environment variables!
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white text-sm">🛠️ Local Environment Installation Guide</h5>
                <ol className="list-decimal pl-5 space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    Create your local configuration variables by copying our <code className="text-emerald-300">.env.example</code> into <code className="text-emerald-300">.env</code>:
                    <div className="bg-black/40 p-3 rounded font-mono text-[11px] text-slate-400 mt-1 border border-white/5">
                      PORT=3000<br/>
                      GEMINI_API_KEY="AIzaSyYourGeminiApiKeyFromAIStudio"
                    </div>
                  </li>
                  <li>
                    Install standard project node packages:
                    <div className="bg-black/40 p-2.5 rounded font-mono text-[11px] text-slate-400 mt-1 border border-white/5">
                      npm install
                    </div>
                  </li>
                  <li>
                    Boot the full-stack development workspace server on port 3000:
                    <div className="bg-black/40 p-2.5 rounded font-mono text-[11px] text-slate-400 mt-1 border border-white/5">
                      npm run dev
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-right">
              <button 
                onClick={() => setShowSetupGuideModal(false)}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono"
              >
                Close Security Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE NEW TENANT WORKSPACE (Demo Version Enabled) */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-10">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCreateTenantModal(false)} />
          
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-xl p-6 relative z-10 shadow-2xl my-auto">
            <button 
              onClick={() => setShowCreateTenantModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-semibold"
            >
              ×
            </button>

            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
              <Plus className={`w-5 h-5 ${tStyles.textAccent}`} />
              <h4 className="text-base font-bold text-white font-mono">Create New Tenant Workspace</h4>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Tenant Profile Settings</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Project Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Delta Storage Portal"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Primary Domain *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. delta-storage.net"
                      value={newTenantDomain}
                      onChange={(e) => setNewTenantDomain(e.target.value)}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Environment Type *</label>
                    <select 
                      value={newTenantEnv}
                      onChange={(e) => setNewTenantEnv(e.target.value as EnvironmentType)}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none font-mono"
                    >
                      <option value="Production">Production</option>
                      <option value="Staging">Staging</option>
                      <option value="Development">Development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Gemini Model Profile</label>
                    <select 
                      disabled
                      className="w-full px-3 py-2 bg-[#16161a]/60 border border-white/5 rounded-lg text-slate-400 text-xs focus:outline-none font-mono cursor-not-allowed"
                    >
                      <option>Gemini 3.6 Flash (Default)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                <p className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">GitHub VCS Integration</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Owner</label>
                    <input 
                      type="text" 
                      placeholder="e.g. delta-labs"
                      value={newTenantRepoOwner}
                      onChange={(e) => setNewTenantRepoOwner(e.target.value)}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Repo Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. storage-portal-api"
                      value={newTenantRepoName}
                      onChange={(e) => setNewTenantRepoName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#16161a] border border-white/5 rounded-lg text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 text-right space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateTenantModal(false)}
                  className="px-4 py-2 border border-white/5 rounded-lg hover:border-white/10 font-mono text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={`px-5 py-2 ${tStyles.bgAccent} hover:opacity-90 text-black font-semibold rounded-lg font-mono text-xs`}
                >
                  Create Project Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
