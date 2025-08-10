import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { usePeople } from "@/hooks/usePeople";
import { idbGetAll } from "@/hooks/useIndexedDB";
import { Bookmark, Person } from "@/types";
import { useState } from "react";
import { BookmarkCard } from "@/components/cards/BookmarkCard";

export default function PersonDetail() {
  const { id } = useParams();
  const { people } = usePeople();
  const [person, setPerson] = useState<Person | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    document.title = `Nimbus — Person`;
  }, []);

  useEffect(() => {
    const p = people.find((x) => x.id === id);
    if (p) setPerson(p);
    (async () => {
      const all = await idbGetAll<Bookmark>("bookmarks");
      setBookmarks(all.filter((b) => b.type === "person" && (b as any).personId === id));
    })();
  }, [id, people]);

  if (!person) return (
    <main className="container py-6">
      <p className="text-muted-foreground">Loading...</p>
    </main>
  );

  return (
    <main className="container py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{person.name}</h1>
        {person.bio && <p className="text-muted-foreground mt-1">{person.bio}</p>}
        <div className="flex gap-3 mt-2 flex-wrap">
          {(person.links || []).map((l) => (
            <a key={l.url} className="underline text-primary" href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </div>
      </header>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bookmarks.map((b) => (<BookmarkCard key={b.id} b={b} />))}
      </section>
    </main>
  );
}
