import { apiClient } from "./client";
import {
  CreatePasteInput,
  CreatePasteResponse,
  PasteView,
  UpdatePasteInput,
} from "@/types/paste";

export async function createPaste(
  data: CreatePasteInput,
  options?: { idempotencyKey?: string; captchaToken?: string }
): Promise<CreatePasteResponse> {
  const headers: Record<string, string> = {};
  if (options?.idempotencyKey) {
    headers["idempotency-key"] = options.idempotencyKey;
  }
  if (options?.captchaToken) {
    headers["x-captcha-token"] = options.captchaToken;
  }

  const res = await apiClient.post<CreatePasteResponse>("/pastes", data, { headers });
  return res.data;
}

export async function getPaste(
  id: string,
  options?: { shareToken?: string; managementToken?: string }
): Promise<PasteView> {
  const params: Record<string, string> = {};
  if (options?.shareToken) {
    params["share_token"] = options.shareToken;
  }
  const headers: Record<string, string> = {};
  if (options?.managementToken) {
    headers["x-management-token"] = options.managementToken;
  }

  const res = await apiClient.get<{ paste: PasteView }>(`/pastes/${id}`, {
    params,
    headers,
  });
  return res.data.paste;
}

export async function unlockPaste(
  id: string,
  password: string,
  options?: { shareToken?: string }
): Promise<PasteView> {
  const params: Record<string, string> = {};
  if (options?.shareToken) {
    params["share_token"] = options.shareToken;
  }

  const res = await apiClient.post<{ paste: PasteView }>(
    `/pastes/${id}/unlock`,
    { password },
    { params }
  );
  return res.data.paste;
}

export async function updatePaste(
  id: string,
  data: UpdatePasteInput,
  managementToken?: string
): Promise<PasteView> {
  const headers: Record<string, string> = {};
  if (managementToken) {
    headers["x-management-token"] = managementToken;
  }

  const res = await apiClient.patch<{ paste: PasteView }>(`/pastes/${id}`, data, { headers });
  return res.data.paste;
}

export async function deletePaste(id: string, managementToken?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (managementToken) {
    headers["x-management-token"] = managementToken;
  }
  await apiClient.delete(`/pastes/${id}`, { headers });
}

export async function forkPaste(
  id: string,
  options?: { password?: string; shareToken?: string }
): Promise<CreatePasteResponse> {
  const params: Record<string, string> = {};
  if (options?.shareToken) {
    params["share_token"] = options.shareToken;
  }

  const res = await apiClient.post<CreatePasteResponse>(
    `/pastes/${id}/fork`,
    options?.password ? { password: options.password } : {},
    { params }
  );
  return res.data;
}

export function getRawPasteUrl(id: string, shareToken?: string): string {
  const qs = shareToken ? `?share_token=${encodeURIComponent(shareToken)}` : "";
  return `/api/v1/pastes/${id}/raw${qs}`;
}

export function getDownloadPasteUrl(id: string, shareToken?: string): string {
  const qs = shareToken ? `?share_token=${encodeURIComponent(shareToken)}` : "";
  return `/api/v1/pastes/${id}/download${qs}`;
}

export async function createShareToken(
  id: string,
  data?: { expiresAt?: string; maxUses?: number }
): Promise<{ token: string; expiresAt?: string; maxUses?: number }> {
  const res = await apiClient.post<{ token: string; expiresAt?: string; maxUses?: number }>(
    `/pastes/${id}/share-tokens`,
    data ?? {}
  );
  return res.data;
}

export async function revokeShareToken(id: string, tokenId: string): Promise<void> {
  await apiClient.delete(`/pastes/${id}/share-tokens/${tokenId}`);
}

export async function createAbuseReport(data: {
  pasteId: string;
  reason: "SPAM" | "MALWARE" | "HARASSMENT" | "COPYRIGHT" | "OTHER";
  details?: string;
}): Promise<{ id: string; status: string; createdAt: string }> {
  const res = await apiClient.post<{ id: string; status: string; createdAt: string }>("/reports", data);
  return res.data;
}
