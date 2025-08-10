# Nimbus — Raindrop‑inspired Bookmark Manager (Frontend)

Modern, self-hosted bookmark manager UI for standard links, people profiles, and torrents. Built with Vite + React + Tailwind. Offline-first with IndexedDB.

## Setup

1. Install deps

```
npm i
```

2. Run dev server

```
npm run dev
```

3. Configure backend endpoint (optional)

Create .env in project root:

```
VITE_API_BASE=http://localhost:4000
```

Defaults to http://localhost:4000 if not set.

## Features
- Dashboard grid of latest bookmarks with quick actions
- People directory and detail with related bookmarks
- Torrents list and detail with Mark Downloaded
- AI-like Tag Editor with local suggestions
- Offline cache via IndexedDB; sync queue for changes
- Persistent Sidebar + Navbar with global search and network status

## Notes
- This repo is frontend-only and will try to read/write to the API when available, otherwise it uses the local cache and queues changes for sync.
- Includes small dev seed data (8 bookmarks, 3 people) loaded into IndexedDB on first run in development.
