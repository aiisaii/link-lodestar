import { Bookmark } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

function suggestTags(b: Bookmark): string[] {
  const base = new Set<string>(b.tags || []);
  const add = (w: string) => base.add(w.toLowerCase());
  if (b.type === "standard" && (b as any).url) {
    try {
      const u = new URL((b as any).url);
      u.hostname.split(".").forEach(add);
      u.pathname.split("/").filter(Boolean).slice(0, 3).forEach(add);
    } catch {}
  }
  if (b.title) b.title.split(/\s+/).filter((x) => x.length > 3).slice(0, 3).forEach(add);
  return Array.from(base).slice(0, 10);
}

export function TagEditorWidget({ bookmark, onApply }: { bookmark: Bookmark; onApply: (tags: string[]) => void; }) {
  const suggestions = useMemo(() => suggestTags(bookmark), [bookmark]);
  const [selected, setSelected] = useState<string[]>(bookmark.tags || []);

  const toggle = (t: string) => {
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((t) => (
          <button key={t} aria-pressed={selected.includes(t)} onClick={() => toggle(t)} className={`px-2 py-1 rounded-full border text-xs ${selected.includes(t) ? "bg-accent" : ""}`}>
            #{t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => onApply(selected)}>Apply</Button>
      </div>
    </div>
  );
}
