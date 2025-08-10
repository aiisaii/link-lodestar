import { useEffect, useMemo, useState } from "react";
import { Bookmark, TorrentBookmark } from "@/types";
import { api } from "@/services/api";
import { ensureDevSeed, idbBulkPut, idbPut } from "@/hooks/useIndexedDB";

export function useTorrents() {
  const [torrents, setTorrents] = useState<TorrentBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await ensureDevSeed();
      try {
        const data = await api.listTorrents();
        setTorrents(data);
        await idbBulkPut("bookmarks", data as any);
      } catch {
        const all = await (await import("@/hooks/useIndexedDB")).idbGetAll<Bookmark>("bookmarks");
        setTorrents(all.filter((b): b is TorrentBookmark => b.type === "torrent"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markDownloaded = async (id: string) => {
    setTorrents((prev) => prev.map((t) => (t.id === id ? { ...t, status: "downloaded" } as TorrentBookmark : t)));
    const updated = torrents.find((t) => t.id === id);
    if (updated) await idbPut("bookmarks", { ...updated, status: "downloaded" } as any);
    try {
      const saved = await api.markTorrentDownloaded(id);
      await idbPut("bookmarks", saved as any);
    } catch {
      // leave as local-only until sync
    }
  };

  const stats = useMemo(() => ({
    total: torrents.length,
    downloaded: torrents.filter((t) => t.status === "downloaded").length,
  }), [torrents]);

  return { torrents, loading, markDownloaded, stats };
}
