import { Bookmark, Person } from "@/types";

// Basic IndexedDB helper without extra deps
const DB_NAME = "nimbus_bookmarks_db";
const DB_VERSION = 1;
const STORES = ["bookmarks", "people", "torrents", "queue"] as const;

export type StoreName = typeof STORES[number];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) {
          const store = db.createObjectStore(s, { keyPath: "id" });
          if (s === "bookmarks") store.createIndex("type", "type");
          if (s === "queue") store.createIndex("createdAt", "createdAt");
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(storeName: StoreName, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => void): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let result: any;
    tx.oncomplete = () => resolve(result as T);
    tx.onerror = () => reject(tx.error);
    fn(store);
  });
}

export async function idbGetAll<T>(store: StoreName): Promise<T[]> {
  return withStore<T[]>(store, "readonly", (s) => {
    const req = s.getAll();
    req.onsuccess = () => {};
  });
}

export async function idbPut<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
  return withStore<void>(store, "readwrite", (s) => {
    s.put(value);
  });
}

export async function idbBulkPut<T extends { id: string }>(store: StoreName, values: T[]): Promise<void> {
  return withStore<void>(store, "readwrite", (s) => {
    values.forEach((v) => s.put(v));
  });
}

export async function idbGetById<T>(store: StoreName, id: string): Promise<T | undefined> {
  return withStore<T | undefined>(store, "readonly", (s) => {
    s.get(id);
  });
}

export async function idbDelete(store: StoreName, id: string): Promise<void> {
  return withStore<void>(store, "readwrite", (s) => {
    s.delete(id);
  });
}

export type QueueItem = {
  id: string;
  createdAt: string;
  action: "create" | "update" | "delete";
  entity: "bookmark" | "person" | "torrent";
  payload: any;
};

export async function queueChange(item: QueueItem): Promise<void> {
  return idbPut("queue", item);
}

export async function getQueue(): Promise<QueueItem[]> {
  return idbGetAll<QueueItem>("queue");
}

export async function clearQueue(): Promise<void> {
  const items = await getQueue();
  return withStore<void>("queue", "readwrite", (s) => {
    items.forEach((i) => s.delete(i.id));
  });
}

// Simple dev seed data
export async function ensureDevSeed() {
  if (import.meta.env.MODE !== "development") return;
  const existing = await idbGetAll<Bookmark>("bookmarks");
  if (existing.length > 0) return;

  const now = new Date().toISOString();
  const people: Person[] = [
    { id: "p1", name: "Ada Lovelace", bio: "Math pioneer.", links: [{ label: "Wikipedia", url: "https://wikipedia.org/wiki/Ada_Lovelace" }], avatarUrl: "https://i.pravatar.cc/150?img=1" },
    { id: "p2", name: "Linus Torvalds", bio: "Creator of Linux.", links: [{ label: "Wikipedia", url: "https://wikipedia.org/wiki/Linus_Torvalds" }], avatarUrl: "https://i.pravatar.cc/150?img=2" },
    { id: "p3", name: "Grace Hopper", bio: "COBOL, compilers.", links: [{ label: "Wikipedia", url: "https://wikipedia.org/wiki/Grace_Hopper" }], avatarUrl: "https://i.pravatar.cc/150?img=3" },
  ];

  const bookmarks: Bookmark[] = [
    { id: "b1", type: "standard", title: "MDN Web Docs", url: "https://developer.mozilla.org/", tags: ["web", "docs"], createdAt: now },
    { id: "b2", type: "standard", title: "Vite", url: "https://vitejs.dev", tags: ["build", "tools"], createdAt: now },
    { id: "b3", type: "standard", title: "TailwindCSS", url: "https://tailwindcss.com", tags: ["css"], createdAt: now },
    { id: "b4", type: "person", title: "Ada Lovelace", personId: "p1", tags: ["math"], createdAt: now },
    { id: "b5", type: "person", title: "Linus Torvalds", personId: "p2", tags: ["linux"], createdAt: now },
    { id: "b6", type: "torrent", title: "Ubuntu ISO", magnet: "magnet:?xt=urn:btih:abcdef", status: "queued", tags: ["linux", "iso"], createdAt: now, sizeBytes: 2_000_000_000 },
    { id: "b7", type: "torrent", title: "Debian ISO", magnet: "magnet:?xt=urn:btih:123456", status: "downloading", tags: ["linux", "iso"], createdAt: now, sizeBytes: 3_000_000_000 },
    { id: "b8", type: "standard", title: "React", url: "https://react.dev", tags: ["react"], createdAt: now },
  ];

  await idbBulkPut("people", people);
  await idbBulkPut("bookmarks", bookmarks);
}
