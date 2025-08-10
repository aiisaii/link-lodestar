import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { idbGetAll } from "@/hooks/useIndexedDB";
import { Bookmark, TorrentBookmark } from "@/types";

export default function TorrentDetail() {
  const { id } = useParams();
  const [t, setT] = useState<TorrentBookmark | null>(null);
  useEffect(() => { document.title = "Nimbus — Torrent"; }, []);
  useEffect(() => {
    (async () => {
      const all = await idbGetAll<Bookmark>("bookmarks");
      const found = all.find((b) => b.id === id && b.type === "torrent") as TorrentBookmark | undefined;
      setT(found || null);
    })();
  }, [id]);

  if (!t) return <main className="container py-6"><p>Loading...</p></main>;

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-2">{t.title}</h1>
      <div className="text-muted-foreground mb-4">Status: {t.status}</div>
      <div className="space-y-2">
        {(t.files || []).map((f, i) => (
          <div key={i} className="flex justify-between border rounded-md p-2">
            <span className="truncate mr-4">{f.name}</span>
            <span className="text-sm">{(f.sizeBytes / (1024*1024)).toFixed(1)} MB</span>
          </div>
        ))}
      </div>
    </main>
  );
}
