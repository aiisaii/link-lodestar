import { apiFetch } from "@/hooks/useApi";
import { Bookmark, Person, TorrentBookmark } from "@/types";

export const api = {
  async listBookmarks(): Promise<Bookmark[]> {
    return apiFetch<Bookmark[]>("/bookmarks");
  },
  async getBookmark(id: string): Promise<Bookmark> {
    return apiFetch<Bookmark>(`/bookmarks/${id}`);
  },
  async upsertBookmark(b: Partial<Bookmark> & { id?: string }): Promise<Bookmark> {
    const method = b.id ? "PUT" : "POST";
    const path = b.id ? `/bookmarks/${b.id}` : "/bookmarks";
    return apiFetch<Bookmark>(path, { method, body: JSON.stringify(b) });
  },
  async deleteBookmark(id: string): Promise<{ id: string }> {
    return apiFetch<{ id: string }>(`/bookmarks/${id}`, { method: "DELETE" });
  },

  async listPeople(): Promise<Person[]> {
    return apiFetch<Person[]>("/people");
  },
  async getPerson(id: string): Promise<Person> {
    return apiFetch<Person>(`/people/${id}`);
  },
  async upsertPerson(p: Partial<Person> & { id?: string }): Promise<Person> {
    const method = p.id ? "PUT" : "POST";
    const path = p.id ? `/people/${p.id}` : "/people";
    return apiFetch<Person>(path, { method, body: JSON.stringify(p) });
  },
  async deletePerson(id: string): Promise<{ id: string }> {
    return apiFetch<{ id: string }>(`/people/${id}`, { method: "DELETE" });
  },

  async listTorrents(): Promise<TorrentBookmark[]> {
    return apiFetch<TorrentBookmark[]>("/torrents");
  },
  async markTorrentDownloaded(id: string): Promise<TorrentBookmark> {
    return apiFetch<TorrentBookmark>(`/torrents/${id}/downloaded`, { method: "POST" });
  },
};
