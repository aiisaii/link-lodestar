import { useEffect } from "react";
import { useTorrents } from "@/hooks/useTorrents";
import { TorrentCard } from "@/components/cards/TorrentCard";

export default function Torrents() {
  const { torrents, markDownloaded } = useTorrents();
  useEffect(() => { document.title = "Nimbus — Torrents"; }, []);
  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">Torrents</h1>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {torrents.map((t) => (<TorrentCard key={t.id} t={t} onMarkDownloaded={markDownloaded} />))}
      </section>
    </main>
  );
}
