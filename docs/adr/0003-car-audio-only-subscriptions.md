# Car: audio-only subscriptions

`Prenumeratos` in CarPlay and Android Auto shows only subscriptions to audio (radioteka) categories. Video (mediateka) subscriptions are filtered out.

## Context

The subscriptions endpoint (`GET /authrz/api/v1/users/subscriptions`) is shared with the phone app, where following a TV show is a legitimate thing to do. Its payload is `{ subscription_key, is_active, name }` and nothing else — the key is a bare `category-<id>`, so a podcast subscription and a TV-show subscription are indistinguishable without resolving the id.

Both cars were showing every active subscription. Tapping a video one lands the driver in an episode list for content the car cannot present.

## Decisions

1. **Classify by catalogue membership.** `api/json/search/categories?type=audio` returns exactly the radioteka id set (verified 2026-08-06: 523 ids, identical to the `radioteka-laidos` show list), and `type=video` returns exactly the mediateka set (3742). The two are **disjoint and exhaustive**, so membership in the audio set settles the type on its own — no second request, and no per-category lookup.

   Rejected alternatives:
   - The two A–Z show lists (`mediateka-laidos` / `radioteka-laidos`), which is how the phone app does it in `useFollowedSubscriptions`. Two large payloads instead of one, for the same answer.
   - `category_info.url` (`/mediateka/…` vs `/radioteka/…`) on the per-category episodes response, which both cars already fetch for cover art — zero extra requests, but it only classifies a category *after* paying for its cover, which is the request we most want to skip.
   - The article-level `is_video` flag. **Unusable**: it is `1` on radioteka episodes too. (`is_video_item` / `article_is_video` do discriminate, but are per-episode rather than per-category.)

2. **Own file per platform, not inline at the call site.** `CategoryMediaTypeResolver` in `android/auto/…/data/CategoryMediaTypes.kt` and `ios/lrtApp/api/CategoryMediaType.swift`. Both expose the full classification — `mediaTypeOf(categoryId)` returning audio/video — and `keepAudio(subscriptions)` on top of it. Only `keepAudio` has a caller today; `mediaTypeOf` is deliberately kept because **the video half is expected back**: labelling a mixed list, or a video section once the car UI has somewhere to put one. Kept out of `LRTAutoRepository` / `CarPlayService`, which are plain data sources.

3. **Fail open.** An unresolvable catalogue — failed fetch with nothing cached, or a response truncated by `count` — returns the subscription list untouched rather than empty, and `mediaTypeOf` returns null rather than guessing video. Hiding a podcast the driver actually subscribed to is a worse failure than briefly showing a show that turns out to be video.

4. **Reject truncated catalogues outright.** The endpoint's `count` truncates silently: `total_found` reports the real size while `items` holds only the first `count`. A short list would classify every missing podcast as video — precisely the fail-closed case decision 3 avoids — so a response with `items.count < total_found` is discarded and the previous set (or nil) is kept. `count=2000` against ~500 categories keeps this a guard rather than the normal path.

5. **Filter before covers.** Both platforms borrow each subscription's artwork from its newest episode — one request per subscription. Filtering first means a dropped video tile costs no request. Applied at the browse call site (`loadManoLRT` / `activeSubscriptions`) rather than inside the subscriptions fetch, so the raw list stays available for whatever needs it later.

## Assumptions

- The audio and video category sets stay disjoint. If a category ever appeared in both, it would be classified audio — the safe direction.
- `search/categories` keeps reporting `total_found` alongside `items`. Without it the truncation guard silently stops guarding (`total` is optional in both models, and a nil `total` skips the check).

## Consequences

- One extra request per car session per platform, cached 4 hours.
- A driver following only video shows now sees no `Prenumeratos` section at all, rather than a section of dead ends.
- The phone app is untouched — `useFollowedSubscriptions` keeps classifying via the show lists and keeps showing both kinds.
