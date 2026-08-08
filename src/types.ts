export type EnvironmentType = 'Production' | 'Staging' | 'Development';

export interface CloudflareTelemetry {
  zoneId: string;
  apiToken: string;
  requestsToday: number;
  uniqueVisitors: number;
  bandwidthServedGb: number;
  cacheHitRatio: number;
  threatsBlocked: number;
}

export interface GitHubActionRun {
  name: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  branch: string;
  commitSha: string;
  duration: number; // in seconds
  trigger: string; // e.g. "push", "pull_request"
  message: string;
  timestamp: string;
}

export interface GitHubTelemetry {
  repoOwner: string;
  repoName: string;
  accessToken: string;
  latestActionRun: GitHubActionRun;
  rateLimitRemaining: number;
  openPrs: number;
  passRate: number; // e.g. 87.5
}

export interface GeminiTelemetry {
  apiKey: string;
  selectedModel: string;
  dailyTokenBudget: number;
  tokensToday: number;
  estCostToday: number;
  autoTelemetry: boolean;
}

export interface AlertThresholds {
  buildFailures: boolean;
  tokenSpikes: boolean;
  gatewayErrors: boolean;
}

export interface TenantWorkspace {
  id: string;
  name: string;
  domain: string;
  env: EnvironmentType;
  cloudflare: CloudflareTelemetry;
  github: GitHubTelemetry;
  gemini: GeminiTelemetry;
  alertThresholds: AlertThresholds;
}

export type ThemeStyle = 'emerald' | 'amber' | 'indigo' | 'sky';

export type SimulationMode = 'normal' | 'burst' | 'outage' | 'dormant';

export interface GlobalDashboardConfig {
  dashboardName: string;
  theme: ThemeStyle;
  simulationMode: SimulationMode;
  strictEnvOverride: boolean;
  alertWebhookUrl: string;
}

export interface SystemEvent {
  id: string;
  tenantId: string;
  tenantName: string;
  type: 'info' | 'success' | 'warning' | 'error';
  source: 'Cloudflare' | 'GitHub' | 'Gemini' | 'System';
  message: string;
  timeAgo: string;
}
