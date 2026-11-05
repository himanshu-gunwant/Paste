import { apiClient } from "./client";
import {
  AbuseReportView,
  AdminPasteView,
  AdminStats,
  AdminUserView,
  AuditLogEntry,
  IpBanView,
} from "@/types/admin";

export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get<AdminStats>("/admin/stats");
  return res.data;
}

export async function listAdminUsers(q?: string): Promise<AdminUserView[]> {
  const res = await apiClient.get<{ data: AdminUserView[] }>("/admin/users", { params: { q } });
  return res.data.data;
}

export async function suspendUser(
  id: string,
  data: { reason: string; endsAt?: string }
): Promise<void> {
  await apiClient.post(`/admin/users/${id}/suspend`, data);
}

export async function unsuspendUser(id: string): Promise<void> {
  await apiClient.post(`/admin/users/${id}/unsuspend`);
}

export async function listAdminPastes(params?: {
  q?: string;
  deleted?: boolean;
}): Promise<AdminPasteView[]> {
  const res = await apiClient.get<{ data: AdminPasteView[] }>("/admin/pastes", { params });
  return res.data.data;
}

export async function purgePaste(id: string): Promise<void> {
  await apiClient.post(`/admin/pastes/${id}/purge`);
}

export async function listReports(
  status?: "OPEN" | "REVIEWED" | "RESOLVED" | "DISMISSED"
): Promise<AbuseReportView[]> {
  const res = await apiClient.get<{ data: AbuseReportView[] }>("/admin/reports", {
    params: { status },
  });
  return res.data.data;
}

export async function resolveReport(
  id: string,
  data: { action: "delete_paste" | "dismiss"; note?: string }
): Promise<void> {
  await apiClient.post(`/admin/reports/${id}/resolve`, data);
}

export async function listAuditLogs(
  limit = 50,
  offset = 0
): Promise<{ data: AuditLogEntry[]; total?: number }> {
  const res = await apiClient.get<{ data: AuditLogEntry[]; total?: number }>("/admin/audit-logs", {
    params: { limit, offset },
  });
  return res.data;
}

export async function listIpBans(): Promise<IpBanView[]> {
  const res = await apiClient.get<{ data: IpBanView[] }>("/admin/ip-bans");
  return res.data.data;
}

export async function createIpBan(data: {
  ip: string;
  reason: string;
  expiresAt?: string;
}): Promise<void> {
  await apiClient.post("/admin/ip-bans", data);
}

export async function deleteIpBan(id: string): Promise<void> {
  await apiClient.delete(`/admin/ip-bans/${id}`);
}
