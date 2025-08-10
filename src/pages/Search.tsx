import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { idbGetAll } from "@/hooks/useIndexedDB";
import { Bookmark } from "@/types";
import { BookmarkCard } from "@/components/cards/BookmarkCard";

export default function Search() {
  const location = useLocation();
  const [results, setResults] = useState<Bookmark[]>([]);
  const q = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  useEffect(() => { document.title = `Nimbus — Search`; }, [q]);
  useEffect(() => {
    (async () => {
      const all = await idbGetAll<Bookmark>("bookmarks");
      const filtered = all.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
      setResults(filtered);
    })();
  }, [q]);

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((b) => (<BookmarkCard key={b.id} b={b} />))}
      </section>
    </main>
  );
}
