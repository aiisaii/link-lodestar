import { useEffect, useMemo, useState } from "react";
import { Bookmark } from "@/types";
import { api } from "@/services/api";
import { ensureDevSeed, idbBulkPut, idbDelete, idbGetAll, idbPut, queueChange } from "@/hooks/useIndexedDB";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await ensureDevSeed();
      try {
        const data = await api.listBookmarks();
        setBookmarks(data);
        await idbBulkPut("bookmarks", data);
      } catch {
        // offline fallback
        const cached = await idbGetAll<Bookmark>("bookmarks");
        setBookmarks(cached);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createOrUpdate = async (b: Partial<Bookmark>) => {
    const id = b.id ?? crypto.randomUUID();
    const now = new Date().toISOString();
    const merged: Bookmark = {
      tags: [],
      notes: "",
      title: b.title || "Untitled",
      createdAt: now,
      ...(b as any),
      id,
      updatedAt: now,
    } as Bookmark;

    setBookmarks((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = merged;
        return copy;
      }
      return [merged, ...prev];
    });

    await idbPut("bookmarks", merged);

    try {
      const saved = await api.upsertBookmark(merged);
      await idbPut("bookmarks", saved);
    } catch {
      await queueChange({ id: crypto.randomUUID(), createdAt: now, action: b.id ? "update" : "create", entity: "bookmark", payload: merged });
    }
  };

  const remove = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await idbDelete("bookmarks", id);
    const now = new Date().toISOString();
    try {
      await api.deleteBookmark(id);
    } catch {
      await queueChange({ id: crypto.randomUUID(), createdAt: now, action: "delete", entity: "bookmark", payload: { id } });
    }
  };

  const latest = useMemo(() => [...bookmarks].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)), [bookmarks]);

  return { bookmarks, latest, loading, error, createOrUpdate, remove };
}
