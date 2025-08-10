import { TorrentBookmark } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TorrentCard({ t, onMarkDownloaded }: { t: TorrentBookmark; onMarkDownloaded?: (id: string) => void; }) {
  const size = t.sizeBytes ? `${(t.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB` : "";
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-sm text-muted-foreground">
        <div className="space-y-1">
          {t.magnet && <div className="truncate" title={t.magnet}>{t.magnet}</div>}
          <div>Status: <span className="font-medium text-foreground">{t.status || "unknown"}</span></div>
          {size && <div>Size: {size}</div>}
        </div>
      </CardContent>
      <CardFooter>
        {onMarkDownloaded && t.status !== "downloaded" && (
          <Button size="sm" onClick={() => onMarkDownloaded(t.id)} aria-label="Mark as downloaded">Mark Downloaded</Button>
        )}
      </CardFooter>
    </Card>
  );
}
