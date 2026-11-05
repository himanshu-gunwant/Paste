import { apiClient } from "./client";
import {
  ApiKeyView,
  ApiUsageResponse,
  CreateApiKeyResponse,
  PasteStats,
  UserAnalytics,
} from "@/types/analytics";

export async function getUserAnalytics(): Promise<UserAnalytics> {
  const res = await apiClient.get<UserAnalytics>("/users/me/analytics");
  return res.data;
}

export async function getPasteStats(pasteId: string): Promise<PasteStats> {
  const res = await apiClient.get<{ stats: PasteStats }>(`/pastes/${pasteId}/stats`);
  return res.data.stats;
}

export async function getMyApiUsage(): Promise<ApiUsageResponse> {
  const res = await apiClient.get<ApiUsageResponse>("/users/me/api-usage");
  return res.data;
}

export async function listApiKeys(): Promise<ApiKeyView[]> {
  const res = await apiClient.get<{ data: ApiKeyView[] }>("/api-keys");
  return res.data.data;
}

export async function createApiKey(data: {
  name: string;
  expiresAt?: string;
}): Promise<CreateApiKeyResponse["apiKey"]> {
  const res = await apiClient.post<CreateApiKeyResponse>("/api-keys", data);
  return res.data.apiKey;
}

export async function revokeApiKey(id: string): Promise<void> {
  await apiClient.delete(`/api-keys/${id}`);
}
