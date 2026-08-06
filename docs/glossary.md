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

## Up-next playlist

The queue that next/previous walks after a car row is tapped — from the steering wheel, the Now Playing screen, or the dashboard widget. The rule is **the section you tapped in becomes the playlist**: the `Klausykite toliau` rows queue those, the list behind that section's `Daugiau` queues the full continue-playing list, an episode list queues that category. On CarPlay it is held in `Playlist.shared`, which only ever sets the array and its index together through `setQueue`; on Android Auto the equivalent is `MediaItemTree.sectionSiblings`, which matches on the `parent_id` and `section_id` a row carries in its extras. See carplay-ui.md §6 and androidauto-ui.md §6.

## Utility row

A CarPlay row that navigates or refreshes rather than plays — `Atnaujinti`, `Daugiau`. Built by `CarSceneDelegate.makeUtilityRow`, never a member of an Up-next playlist, and therefore never able to shift `currentIndex`. `Daugiau` appears twice on Home, once per section that has more behind it. See carplay-ui.md §6.

## Continue-playing host

A CarPlay tab or Android Auto browsable that renders a `Klausykite toliau` section. Both `Siūlome` and `Mano LRT` are hosts on both platforms, and both repaint off one signal — `watchHistoryUpdated` on iOS, `notifyContinuePlayingChanged()` on Android. Neither pair of hosts can share row instances: a `CPListItem` belongs to one section at a time, and an Android media ID maps to exactly one node holding one child list. So each host gets its own rows (its own media ID space on Android) built from the same cached array — on iOS a host stores the closure that rebuilds its sections *around* the continue-playing section, and shares only the cover images. See carplay-ui.md §8 and androidauto-ui.md §6.

## Tab restore migration

Mapping a persisted CarPlay tab title onto the tab that replaced or renamed it — `Naujausi` → `Siūlome`, `ManoLRT` → `Mano LRT` — in `CarPlayTab.migrating(title:)`. `Laidos` needs no mapping: it is still a tab and still holds the A–Z browse. Unrecognised values, and `Mano LRT` while logged out, fall back to the first tab. Restore stays keyed on the title rather than a stable id, though the case for keeping it there narrowed once analytics moved off the title onto `CarPlayTab.analyticsKey`. `CarPlayCache` is in-memory only, so no migration can actually fire across a release. See carplay-ui.md §7.

## Recommendation grid

The `Siūlome` section on Home, drawn as a `CPListImageRowItem` — one list row holding a grid of cover tiles — rather than one row per recommendation. CarPlay has no grid *section*: `CPGridTemplate` is a whole template, so an image row is the only way to put a grid beside other sections. Items whose cover failed to download are absent, and iOS below 26 caps tiles at `CPMaximumNumberOfGridImages`, so the Up-next playlist is built from what was rendered rather than what was fetched. See carplay-ui.md §2.

## Row budget

How many rows a CarPlay tab's one open-ended section may use. `CPListTemplate` trims **silently** past its runtime `maximumItemCount`, working from the end, where every Utility row sits — so a tab with an unbounded section has to reserve its fixed rows and cap the rest. **Nothing needs one today**: turning both `Naujausi` and `Prenumeratos` into a Recommendation grid left every tab bounded by construction, and `CarPlayUIManager.contentRowBudget(reserving:)` was removed with a comment marking where. Bring it back if a section ever grows unbounded again — grids are a layout choice that could be reversed. Android Auto paginates rather than trimming, so it has no counterpart. See carplay-ui.md §10.

## Episode queue window

The resolved slice of a podcast or subscription episode list that Android Auto's player actually holds. An episode's stream URL lives only in its article payload, and ExoPlayer rejects a `MediaItem` without a URI, so CarPlay's approach — queue the whole list unresolved, fill each entry in on arrival — has no Android equivalent. The queue starts at the tapped episode alone and grows by two ahead on every transition. Costs the car's "up next" view its full length and puts earlier episodes out of skip-previous reach. See androidauto-ui.md §6.1.

## Category media type

Whether a show category publishes audio (radioteka) or video (mediateka) episodes. Not carried by any subscription payload — a subscription is a bare `category-<id>` key — so it is derived by resolving the id against `api/json/search/categories?type=audio`, whose id set is exactly the radioteka half and disjoint from the `type=video` half. Held by `CategoryMediaTypeResolver` on both platforms; `keepAudio` is the half in use, filtering video subscriptions out of `Prenumeratos`, and `mediaTypeOf` is kept for the video half that is expected back. Resolves to *unknown* rather than video when the catalogue is unavailable or truncated, and every caller fails open on that. See ADR-0003.

## Content style hint

The Android Auto extras that decide whether a row draws as a list entry or a cover tile — `CONTENT_STYLE_SINGLE_ITEM_HINT` per row, over the `CONTENT_STYLE_BROWSABLE_HINT`/`PLAYABLE_HINT` defaults the root declares, and ignored altogether unless the root also sets `CONTENT_STYLE_SUPPORTED`. Android's answer to CarPlay's `CPListImageRowItem`, and the reason `Klausykite toliau` stays a list on both platforms: a tile has nowhere to put a progress bar. `CONTENT_STYLE_GROUP_TITLE_HINT` is the related extra that gives a row its section header. See androidauto-ui.md §2.1.
