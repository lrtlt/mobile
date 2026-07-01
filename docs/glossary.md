# Glossary

Shared vocabulary for the LRT app domain. Terms are cross-referenced from ADRs.

## History

The per-user list of most-recently-opened articles shown on `HistoryScreen`. For **authenticated** users it is server-backed (`GET /authrz/user/history/{page}`) and can exceed the local cap; for **unauthenticated** users it is local-only (`useArticleStorageStore.history`), hard-capped at 50 items (`ARTICLE_HISTORY_COUNT`). See ADR-0002.

## History-ID page

One page of the two-stage history fetch: `GET /authrz/user/history/{page}` returns a list of `{ articleId, added_at }` — IDs only, not full articles. Its length is the signal for end-of-list detection. See ADR-0002.

## Search-hydration

Turning a list of article IDs into full `ArticleSearchItem`s via the search endpoint (`useSearchArticlesByIds`, `GET /api/json/search?ids=…`). The search endpoint returns items in its own (date) order, so the caller reorders results to match the requested ID order.

## Empty-page sentinel

The end-of-list rule for history paging: keep fetching pages until a History-ID page returns **0 items**, then stop. Chosen because the response has no `total`/`hasMore` and the server page size is unverified. See ADR-0002.

## Terminal page

A page for which `getNextPageParam` returns `undefined`, so no "load more" is possible. Unauthenticated history is always a single terminal page. See ADR-0002.
