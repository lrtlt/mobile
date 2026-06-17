# History ordering: local store overlaid on server list

For authenticated users, the reading **History** list is ordered by most-recently-opened. The order is driven by the local device store overlaid on the server's history list — not purely by the server — because the backend's `PUT /authrz/user/history/{id}` bump behavior (whether re-opening an already-stored article refreshes its `added_at`) is unverified. The local store (`useArticleStorageStore`) is updated on every article open, so overlaying its recency order guarantees a just-opened article jumps to the top on the device the user is tapping, regardless of how the backend orders its response.

## Consequences

- Local and server can momentarily disagree (e.g. an article opened on another device sorts by its server timestamp, not "now"); invisible for single-device use.
- IDs beyond the local cap or only present server-side keep their server order.
- If the backend is later confirmed to bump `added_at`, the overlay and server converge — the overlay stays correct either way, so it's safe to keep.
