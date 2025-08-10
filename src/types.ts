export type BookmarkType = "standard" | "person" | "torrent";

export interface BaseBookmark {
  id: string;
  type: BookmarkType;
  title: string;
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date
  tags?: string[];
  notes?: string;
}

export interface StandardBookmark extends BaseBookmark {
  type: "standard";
  url: string;
  faviconUrl?: string;
}

export interface PersonBookmark extends BaseBookmark {
  type: "person";
  personId: string; // references Person.id
}

export interface TorrentBookmark extends BaseBookmark {
  type: "torrent";
  magnet?: string;
  torrentFileUrl?: string;
  sizeBytes?: number;
  status?: "queued" | "downloading" | "downloaded" | "error";
  files?: { name: string; sizeBytes: number }[];
}

export type Bookmark = StandardBookmark | PersonBookmark | TorrentBookmark;

export interface Person {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  links?: { label: string; url: string }[];
}
