export interface AdminStats {
  users: number;
  activeUsers?: number;
  livePastes?: number;
  activePastes?: number;
  tombstones?: number;
  openReports: number;
  apiKeys?: number;
  activeBans?: number;
}

export interface AdminUserView {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  storageUsed: string;
  createdAt: string;
}

export interface AdminPasteView {
  id: string;
  title: string | null;
  language: string | null;
  visibility: string;
  contentSize: number;
  authorUsername: string | null;
  deletedAt: string | null;
  createdAt: string;
}

export interface AbuseReportView {
  id: string;
  pasteId: string;
  reporterUsername: string | null;
  reason: "SPAM" | "MALWARE" | "HARASSMENT" | "COPYRIGHT" | "OTHER";
  details: string | null;
  status: "OPEN" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  resolutionNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface AuditLogEntry {
  id: string;
  actorType: string;
  actorName: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
}

export interface IpBanView {
  id: string;
  ipHash: string;
  reason: string;
  createdByName?: string;
  expiresAt: string | null;
  createdAt: string;
}
