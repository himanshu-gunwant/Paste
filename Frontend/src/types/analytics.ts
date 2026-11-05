export interface DailyStat {
  day: string;
  views: number;
  uniqueVisitors: number;
}

export interface PasteStats {
  totals: {
    views: string;
    uniqueVisitors: string;
  };
  daily: DailyStat[];
}

export interface UserAnalytics {
  totals: {
    pastes: number;
    storageUsed: string;
    views: string;
    uniqueVisitors: string;
  };
  daily: DailyStat[];
}

export interface ApiUsageSummaryItem {
  endpoint: string;
  method: string;
  statusCode: number;
  requestCount: number;
  avgLatencyMs: number;
}

export interface ApiUsageResponse {
  data: ApiUsageSummaryItem[];
  quota: {
    dailyLimit: number;
    window: string;
  };
  windowDays: number;
}

export interface ApiKeyView {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKeyView & {
    apiKey: string; // One-time disclosure
  };
}
