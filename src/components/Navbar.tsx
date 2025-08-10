import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, WifiOff, Wifi } from "lucide-react";
import { pingApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    const interval = setInterval(async () => setApiOnline(await pingApi()), 8000);
    pingApi().then(setApiOnline).catch(() => setApiOnline(false));
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      clearInterval(interval);
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-3">
        <SidebarTrigger />
        <Link to="/" className="font-semibold">Nimbus</Link>
        <form onSubmit={onSubmit} className="ml-auto flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search bookmarks" placeholder="Search bookmarks..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        <div className="ml-2 flex items-center gap-2" aria-live="polite" aria-atomic>
          {online ? <Wifi className="h-4 w-4 text-primary" /> : <WifiOff className="h-4 w-4 text-destructive" />}
          <span className="text-sm text-muted-foreground">{apiOnline ? "API" : "API offline"}</span>
        </div>
      </div>
      {!online || !apiOnline ? (
        <div role="status" className="w-full bg-destructive/10 text-destructive-foreground text-center text-sm py-1">
          You are offline or the backend is unreachable. Working in cached mode.
        </div>
      ) : null}
    </header>
  );
}
