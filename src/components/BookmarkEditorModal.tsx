import { useEffect, useState } from "react";
import { Bookmark } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BookmarkEditorModal({ trigger, initial, onSave }: { trigger: React.ReactNode; initial?: Partial<Bookmark>; onSave: (b: Partial<Bookmark>) => void; }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Bookmark>>(initial || { type: "standard", title: "" } as any);

  useEffect(() => {
    setDraft(initial || { type: "standard", title: "" } as any);
  }, [initial]);

  const set = (k: string, v: any) => setDraft((d) => ({ ...d, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{draft?.id ? "Edit Bookmark" : "New Bookmark"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="type">Type</Label>
              <select id="type" className="w-full border rounded-md h-9 px-2 bg-background" value={draft.type as any} onChange={(e) => set("type", e.target.value as any)} aria-label="Type">
                <option value="standard">Standard</option>
                <option value="person">Person</option>
                <option value="torrent">Torrent</option>
              </select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={draft.title || ""} onChange={(e) => set("title", e.target.value)} required />
            </div>
          </div>

          {draft.type === "standard" && (
            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={(draft as any).url || ""} onChange={(e) => set("url", e.target.value)} required />
            </div>
          )}

          {draft.type === "person" && (
            <div>
              <Label htmlFor="personId">Person ID</Label>
              <Input id="personId" value={(draft as any).personId || ""} onChange={(e) => set("personId", e.target.value)} />
            </div>
          )}

          {draft.type === "torrent" && (
            <div>
              <Label htmlFor="magnet">Magnet Link</Label>
              <Input id="magnet" value={(draft as any).magnet || ""} onChange={(e) => set("magnet", e.target.value)} />
            </div>
          )}

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={(draft.tags || []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={draft.notes || ""} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
