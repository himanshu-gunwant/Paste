import { apiClient } from "./client";
import { BookmarkItem, CollectionDetail, CollectionView } from "@/types/collection";

export async function createCollection(data: {
  title: string;
  description?: string;
  slug?: string;
  visibility?: "public" | "unlisted" | "private";
}): Promise<CollectionView> {
  const res = await apiClient.post<{ collection: CollectionView }>("/collections", data);
  return res.data.collection;
}

export async function listOwnCollections(): Promise<CollectionView[]> {
  const res = await apiClient.get<{ data: CollectionView[] }>("/collections");
  return res.data.data;
}

export async function getCollection(id: string): Promise<CollectionDetail> {
  const res = await apiClient.get<CollectionDetail>(`/collections/${id}`);
  return res.data;
}

export async function updateCollection(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    slug?: string;
    visibility?: "public" | "unlisted" | "private";
  }
): Promise<CollectionView> {
  const res = await apiClient.patch<{ collection: CollectionView }>(`/collections/${id}`, data);
  return res.data.collection;
}

export async function deleteCollection(id: string): Promise<void> {
  await apiClient.delete(`/collections/${id}`);
}

export async function addPasteToCollection(
  id: string,
  pasteId: string
): Promise<{ collectionId: string; pasteId: string; position: number }> {
  const res = await apiClient.post<{ collectionId: string; pasteId: string; position: number }>(
    `/collections/${id}/pastes`,
    { pasteId }
  );
  return res.data;
}

export async function reorderCollection(
  id: string,
  positions: { pasteId: string; position: number }[]
): Promise<void> {
  await apiClient.patch(`/collections/${id}/pastes`, { positions });
}

export async function removePasteFromCollection(id: string, pasteId: string): Promise<void> {
  await apiClient.delete(`/collections/${id}/pastes/${pasteId}`);
}

// Bookmarks
export async function addBookmark(pasteId: string): Promise<void> {
  await apiClient.put(`/pastes/${pasteId}/bookmark`);
}

export async function removeBookmark(pasteId: string): Promise<void> {
  await apiClient.delete(`/pastes/${pasteId}/bookmark`);
}

export async function listBookmarks(): Promise<BookmarkItem[]> {
  const res = await apiClient.get<{ data: BookmarkItem[] }>("/users/me/bookmarks");
  return res.data.data;
}
