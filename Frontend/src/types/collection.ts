import { Visibility } from "./paste";

export interface CollectionView {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  visibility: Visibility;
  ownerUsername: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  position: number;
  addedAt: string;
  paste?: {
    id: string;
    title: string | null;
    language: string | null;
    visibility: Visibility;
    author: { username: string } | null;
  };
  restricted?: boolean;
}

export interface CollectionDetail {
  collection: CollectionView;
  items: CollectionItem[];
}

export interface BookmarkItem {
  pasteId: string;
  title: string | null;
  language: string | null;
  createdAt: string;
  addedAt: string;
}
