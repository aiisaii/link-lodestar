import { MoreVertical, FolderPlus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export default function Collections() {
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
        <h1 className="text-2xl font-semibold">Collections</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Collections actions"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={addFolder}><FolderPlus className="mr-2 h-4 w-4" /> Add folder</DropdownMenuItem>
            <DropdownMenuItem onClick={addNestedFolder}><FolderTree className="mr-2 h-4 w-4" /> Add nested folder</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-muted-foreground">Organize bookmarks into collections. (Coming soon)</p>
    </main>
  );
}