# History screen: infinite paging (load-more on scroll)

`HistoryScreen` loads more reading-history articles as the user scrolls to the bottom, instead of showing only the first page.

## Context

`HistoryScreen` previously called `useHistoryUserArticles(1)` with the page hard-coded to `1`, so only the first server page was ever shown. History is fetched in two stages: `GET /authrz/user/history/{page}` returns article IDs, which are then hydrated to full articles via the search endpoint (`useSearchArticlesByIds`).

## Decisions

1. **Authenticated users only.** Unauthenticated history is local-only and hard-capped at 50 items (`ARTICLE_HISTORY_COUNT`), all of which already load in one shot — there is nothing beyond page 1 to fetch. For unauthenticated users the list renders as a single terminal page with no "load more."

2. **One `useInfiniteQuery`, page = "history-ID page + search-hydrate."** Each page's `queryFn` fetches the history-ID page **and** hydrates those IDs, returning ready `ArticleSearchItem`s. The screen flat-maps `pages`. This keeps IDs and article details co-located per page and keeps the `?ids=…` search URL bounded (rejected: accumulating all IDs into one ever-growing search call).

3. **New hook, not a rewrite.** Added `useHistoryUserArticlesInfinite` for the History screen; the existing `useHistoryUserArticles(page, count?)` is left untouched because `UserHistory` (6-item widget) and `useHistoryCategories` (50-item derivation) depend on its single-page signature and shape. The shared search-hydration is factored into `searchArticlesByIds`.

4. **Pure server order — no local overlay.** History is ordered entirely by the server list (authenticated) or the local store (unauthenticated, its only data source). An earlier design overlaid the local device's recency order onto page 1 so a just-opened article bubbled to the top; it was dropped as unnecessary complexity — it added a reactive re-sort that could itself shift page-1 rows while viewing.

5. **End detected by empty-page sentinel.** The history response carries no `total`/`hasMore`, and the server page size is unverified, so `getNextPageParam` keeps paging until a page returns **0 items**, then stops. End-of-list is judged from the raw history-ID page length (the `articles` array), **not** the hydrated item count — a page of IDs that all fail to hydrate must not be mistaken for the end. Cost: one extra empty trailing request. Rejected a hard-coded `PAGE_SIZE` short-page heuristic because a wrong constant would silently truncate history.

6. **Load-more UX.** `onEndReached` (threshold ≈ 0.5) calls `fetchNextPage()`, guarded to a no-op while `isFetchingNextPage` or `!hasNextPage`. A footer spinner shows while a next page loads. A next-page fetch error leaves the already-loaded list intact (footer spinner stops); the full-screen `<ScreenError>` still guards only the initial load.

7. **Grouping page-by-page.** Each page is formatted independently (`pages.flatMap(page => formatArticles(-1, page, false))`) and the row groups concatenated. *Originally* decided as a single `formatArticles` over the whole accumulated list (for even rows across seams), but in practice appending a page reflowed the previous page's row grouping — existing rows changed content/identity, `keyExtractor` keys shifted, and the list **visibly jumped** on scroll. Formatting per page keeps already-loaded rows stable on append. Accepted cost: a page whose item count isn't a multiple of the row size leaves a partial trailing row at the seam (preferred over the jump).

## Assumptions

- `GET /authrz/user/history/{page}` is a fixed-size page slice that returns an empty `articles` array once history is exhausted. This paging behavior and the server page size are **unverified in code**; the empty-page sentinel is chosen specifically to be robust to an unknown page size.

## Consequences

- One extra (empty) request is made to discover the end of history.
- If the backend ever returns everything on page 1 regardless of `page`, the sentinel still terminates correctly (page 2 comes back empty).
- Unauthenticated behavior is unchanged.
