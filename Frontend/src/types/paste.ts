export type Visibility = "public" | "unlisted" | "private";

export interface PasteSummary {
  id: string;
  title: string | null;
  description: string | null;
  language: string | null;
  detectedLanguage: string | null;
  visibility: Visibility;
  viewCount: string;
  authorUsername: string | null;
  createdAt: string;
}

export interface PasteView {
  id: string;
  title: string | null;
  description: string | null;
  language: string | null;
  detectedLanguage: string | null;
  visibility: Visibility;
  author: { username: string } | null;
  forkOfId: string | null;
  contentSize: number;
  burnAfterRead: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  content?: string;
  viewCount?: number;
  maxViews?: number | null;
  burnedAt?: string | null;
  deletedAt?: string | null;
}

export interface CreatePasteInput {
  content: string;
  title?: string;
  description?: string;
  language?: string;
  visibility?: Visibility;
  password?: string;
  expiresIn?: "10min" | "1h" | "1d" | "1w" | "1m";
  expiresAt?: string;
  maxViews?: number;
  burnAfterRead?: boolean;
  customSlug?: string;
}

export interface CreatePasteResponse {
  paste: PasteView;
  managementToken?: string;
}

export interface UpdatePasteInput {
  content?: string;
  title?: string;
  description?: string;
  language?: string;
  visibility?: Visibility;
  password?: string | null;
  expiresIn?: "10min" | "1h" | "1d" | "1w" | "1m";
  expiresAt?: string | null;
  maxViews?: number | null;
  burnAfterRead?: boolean;
}

export interface RevisionMetadata {
  revisionNo: number;
  title: string | null;
  description: string | null;
  language: string | null;
  contentSize: number;
  createdAt: string;
}

export interface RevisionSnapshot {
  revisionNo: number;
  title: string | null;
  description: string | null;
  language: string | null;
  content: string;
  contentSize: number;
  createdAt: string;
}

export interface RevisionDiff {
  from: number;
  to: number;
  diff: string;
}

export interface KeysetPagination {
  cursor?: string;
  hasMore: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: KeysetPagination;
}

export interface LanguageFacet {
  language: string;
  count: number;
}
