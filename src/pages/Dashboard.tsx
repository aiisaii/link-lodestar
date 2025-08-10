import { useEffect } from "react";
import { BookmarkCard } from "@/components/cards/BookmarkCard";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkEditorModal } from "@/components/BookmarkEditorModal";

export default function Dashboard() {
  const { latest, createOrUpdate } = useBookmarks();

  useEffect(() => {
    document.title = "Nimbus — Dashboard";
  }, []);

  return (
    <main className="container py-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Recent Bookmarks</h1>
        <BookmarkEditorModal
          onSave={createOrUpdate}
          trigger={<Button><BookmarkPlus className="h-4 w-4 mr-2" /> New</Button>}
        />
      </header>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {latest.map((b) => (
          <BookmarkCard key={b.id} b={b} onEdit={(bk) => createOrUpdate(bk)} onTag={() => {}} />
        ))}
      </section>
    </main>
  );
}
