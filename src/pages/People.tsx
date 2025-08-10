import { useEffect } from "react";
import { usePeople } from "@/hooks/usePeople";
import { PeopleCard } from "@/components/cards/PeopleCard";

export default function People() {
  const { people } = usePeople();
  useEffect(() => { document.title = "Nimbus — People"; }, []);
  return (
    <main className="container py-6">
      <h1 className="text-2xl font-semibold mb-4">People</h1>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (<PeopleCard key={p.id} p={p} />))}
      </section>
    </main>
  );
}
