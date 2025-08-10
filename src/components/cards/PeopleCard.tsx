import { Person } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function PeopleCard({ p }: { p: Person }) {
  return (
    <Link to={`/people/${p.id}`} aria-label={`Open ${p.name}`}>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={p.avatarUrl} alt={`${p.name} avatar`} />
            <AvatarFallback>{p.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="line-clamp-1">{p.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{p.bio}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
