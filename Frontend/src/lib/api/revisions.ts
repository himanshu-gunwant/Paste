import { apiClient } from "./client";
import { RevisionDiff, RevisionMetadata, RevisionSnapshot } from "@/types/paste";

export async function listRevisions(
  id: string,
  options?: { shareToken?: string; password?: string }
): Promise<{ data: RevisionMetadata[]; latestRevisionNo: number }> {
  const params: Record<string, string> = {};
  if (options?.shareToken) params["share_token"] = options.shareToken;
  const headers: Record<string, string> = {};
  if (options?.password) headers["x-paste-password"] = options.password;

  const res = await apiClient.get<{ data: RevisionMetadata[]; latestRevisionNo: number }>(
    `/pastes/${id}/revisions`,
    { params, headers }
  );
  return res.data;
}

export async function getRevision(
  id: string,
  no: number,
  options?: { shareToken?: string; password?: string }
): Promise<RevisionSnapshot> {
  const params: Record<string, string> = {};
  if (options?.shareToken) params["share_token"] = options.shareToken;
  const headers: Record<string, string> = {};
  if (options?.password) headers["x-paste-password"] = options.password;

  const res = await apiClient.get<{ revision: RevisionSnapshot }>(
    `/pastes/${id}/revisions/${no}`,
    { params, headers }
  );
  return res.data.revision;
}

export async function diffRevisions(
  id: string,
  from: number,
  to: number,
  options?: { shareToken?: string; password?: string }
): Promise<RevisionDiff> {
  const params: Record<string, string | number> = { to };
  if (options?.shareToken) params["share_token"] = options.shareToken;
  const headers: Record<string, string> = {};
  if (options?.password) headers["x-paste-password"] = options.password;

  const res = await apiClient.get<RevisionDiff>(`/pastes/${id}/revisions/${from}/diff`, {
    params,
    headers,
  });
  return res.data;
}

export async function restoreRevision(
  id: string,
  no: number,
  managementToken?: string
): Promise<{ restored: boolean; latestRevisionNo: number }> {
  const headers: Record<string, string> = {};
  if (managementToken) headers["x-management-token"] = managementToken;

  const res = await apiClient.post<{ restored: boolean; latestRevisionNo: number }>(
    `/pastes/${id}/revisions/${no}/restore`,
    {},
    { headers }
  );
  return res.data;
}
