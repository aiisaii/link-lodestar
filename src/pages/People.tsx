import { useEffect, useRef } from "react";
import { usePeople } from "@/hooks/usePeople";
import { PeopleCard } from "@/components/cards/PeopleCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, FolderPlus, FolderTree, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BookmarkEditorModal } from "@/components/BookmarkEditorModal";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function People() {
  const { people } = usePeople();
  const { createOrUpdate } = useBookmarks();
  const personBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { document.title = "Nimbus — People"; }, []);
  const addFolder = () => {
    const name = window.prompt("Folder name?");
    if (name) toast({ title: "Folder created", description: name });
  };
  const addNestedFolder = () => {
    const parent = window.prompt("Parent folder?");
    const name = window.prompt("Nested folder name?");
    if (parent && name) toast({ title: "Nested folder created", description: `${parent} / ${name}` });
  };
  return (
    <main className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">People</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="People actions"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => personBtnRef.current?.click()}><UserPlus className="mr-2 h-4 w-4" /> Add person</DropdownMenuItem>
            <DropdownMenuItem onClick={addFolder}><FolderPlus className="mr-2 h-4 w-4" /> Add folder</DropdownMenuItem>
            <DropdownMenuItem onClick={addNestedFolder}><FolderTree className="mr-2 h-4 w-4" /> Add nested folder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <BookmarkEditorModal
          trigger={<button ref={personBtnRef} className="hidden" />}
          initial={{ type: "person", title: "" } as any}
          onSave={(b) => createOrUpdate(b)}
        />
      </div>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (<PeopleCard key={p.id} p={p} />))}
      </section>
    </main>
  );
}
