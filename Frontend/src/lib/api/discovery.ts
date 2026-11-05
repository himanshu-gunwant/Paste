import { apiClient } from "./client";
import { LanguageFacet, PaginatedResult, PasteSummary } from "@/types/paste";
import { CollectionView } from "@/types/collection";

export async function getPublicPastes(params?: {
  sort?: "latest" | "popular" | "trending";
  language?: string;
  username?: string;
  cursor?: string;
  limit?: number;
}): Promise<PaginatedResult<PasteSummary>> {
  const res = await apiClient.get<PaginatedResult<PasteSummary>>("/pastes", { params });
  return res.data;
}

export async function searchPublicPastes(params: {
  q: string;
  language?: string;
  username?: string;
  cursor?: string;
  limit?: number;
}): Promise<PaginatedResult<PasteSummary>> {
  const res = await apiClient.get<PaginatedResult<PasteSummary>>("/search", { params });
  return res.data;
}

export async function getLanguages(): Promise<LanguageFacet[]> {
  const res = await apiClient.get<{ data: LanguageFacet[] }>("/languages");
  return res.data.data;
}

export async function getUserPublicPastes(
  username: string,
  params?: { sort?: "latest" | "popular"; language?: string; cursor?: string; limit?: number }
): Promise<PaginatedResult<PasteSummary>> {
  const res = await apiClient.get<PaginatedResult<PasteSummary>>(`/users/${username}/pastes`, { params });
  return res.data;
}

export async function getUserPublicCollections(username: string): Promise<CollectionView[]> {
  const res = await apiClient.get<{ data: CollectionView[] }>(`/users/${username}/collections`);
  return res.data.data;
}
