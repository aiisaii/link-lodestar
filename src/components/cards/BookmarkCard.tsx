import { Bookmark } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Tag } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export function BookmarkCard({ b, onEdit, onTag }: { b: Bookmark; onEdit?: (b: Bookmark) => void; onTag?: (b: Bookmark) => void; }) {
  const href = (b.type === "standard" && b.url) ? b.url : undefined;
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{b.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          {(b.tags || []).slice(0, 6).map((t) => (
            <span key={t} className="rounded-full border px-2 py-0.5 text-xs">#{t}</span>
          ))}
        </div>
        <div className="mt-2 text-xs">{formatDate(b.createdAt)}</div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {href && (
          <Button asChild variant="secondary" size="sm" aria-label="Open bookmark">
            <a href={href} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
          </Button>
        )}
        {onEdit && <Button variant="outline" size="sm" onClick={() => onEdit(b)} aria-label="Edit bookmark"><Pencil className="h-4 w-4" /></Button>}
        {onTag && <Button variant="outline" size="sm" onClick={() => onTag(b)} aria-label="AI tag suggestions"><Tag className="h-4 w-4" /></Button>}
      </CardFooter>
    </Card>
  );
}
