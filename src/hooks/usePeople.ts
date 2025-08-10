import { useEffect, useState } from "react";
import { Person } from "@/types";
import { api } from "@/services/api";
import { ensureDevSeed, idbBulkPut, idbDelete, idbGetAll, idbPut, queueChange } from "@/hooks/useIndexedDB";

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await ensureDevSeed();
      try {
        const data = await api.listPeople();
        setPeople(data);
        await idbBulkPut("people", data);
      } catch {
        const cached = await idbGetAll<Person>("people");
        setPeople(cached);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upsert = async (p: Partial<Person> & { id?: string }) => {
    const id = p.id ?? crypto.randomUUID();
    const merged: Person = { id, name: p.name || "Unnamed", bio: p.bio, avatarUrl: p.avatarUrl, links: p.links };
    setPeople((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const copy = [...prev];
      if (i >= 0) copy[i] = merged; else copy.unshift(merged);
      return copy;
    });
    await idbPut("people", merged);
    try {
      const saved = await api.upsertPerson(merged);
      await idbPut("people", saved);
    } catch {
      await queueChange({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), action: p.id ? "update" : "create", entity: "person", payload: merged });
    }
  };

  const remove = async (id: string) => {
    setPeople((prev) => prev.filter((x) => x.id !== id));
    await idbDelete("people", id);
    try {
      await api.deletePerson(id);
    } catch {
      await queueChange({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), action: "delete", entity: "person", payload: { id } });
    }
  };

  return { people, loading, upsert, remove };
}
