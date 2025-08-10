import { useEffect, useMemo, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { TagEditorWidget } from "@/components/TagEditorWidget";
import { Bookmark } from "@/types";

export default function TagEditor() {
  const { bookmarks, createOrUpdate } = useBookmarks();
  const [selected, setSelected] = useState<Bookmark | null>(null);
  useEffect(() => { document.title = "Nimbus — Tag Editor"; }, []);
  const allTags = useMemo(() => Array.from(new Set(bookmarks.flatMap((b) => b.tags || []))).sort(), [bookmarks]);

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">AI Tag Editor</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {(bookmarks.slice(0, 20)).map((b) => (
            <div key={b.id} className={`p-3 rounded-md border ${selected?.id === b.id ? "ring-2 ring-primary" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{b.title}</div>
                <button className="text-sm underline" onClick={() => setSelected(b)}>Edit tags</button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{(b.tags || []).map((t) => `#${t}`).join(" ")}</div>
            </div>
          ))}
        </div>
        <aside className="lg:col-span-1 border rounded-md p-4">
          <h2 className="font-semibold mb-2">Suggestions</h2>
          {selected ? (
            <TagEditorWidget bookmark={selected} onApply={(tags) => { createOrUpdate({ ...selected, tags }); }} />
          ) : (
            <p className="text-muted-foreground">Select a bookmark to see suggestions.</p>
          )}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">All tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => (<span key={t} className="text-xs border rounded-full px-2 py-0.5">#{t}</span>))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
