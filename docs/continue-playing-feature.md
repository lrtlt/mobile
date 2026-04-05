# Continue Playing — Implementation Plan

Feature: persist user playback progress for audio/video media so the user can resume where they left off. Expose resumable items in Mediateka (video) and Radioteka (audio).

- Scope of "media" here = on-demand articles (`is_video = 1` or `is_audio = 1`). Live streams, radio streams, and TV channels are explicitly out of scope.
- Storage is **internal (on-device) only** for now. A server-synced backend will be added later; the storage layer is isolated so it can be swapped without touching call sites.
- CarPlay / Android Auto integration is deferred until the backend lands, so both sides can read from the same server-synced source of truth.
- Progress is kept per `article_id` and represents seconds into the item's stream.

---

## 1. Data Model

### 1.1 New Zustand store: `usePlaybackProgressStore`

File: `app/state/playback_progress_store.ts`

```ts
export type PlaybackProgressEntry = {
  // Identity
  id: number;                 // article id (media article)
  url?: string;               // article url (deep link fallback)
  mediaType: 'audio' | 'video';

  // Display
  title: string;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  photo?: string;             // article.main_photo.path

  // Progress
  positionSec: number;        // last known playback position (seconds)
  durationSec: number;        // total duration if known, else 0
  progressPct: number;        // positionSec / durationSec, 0..1 (0 if unknown)
  completed: boolean;         // true once >= COMPLETED_THRESHOLD_PCT
  updatedAt: number;          // epoch ms — used for sorting
};

type State = {
  entries: Record<number, PlaybackProgressEntry>;  // keyed by article id
};

type Actions = {
  upsertProgress: (input: UpsertInput) => void;    // merges + updates updatedAt
  removeProgress: (id: number) => void;
  clearCompleted: () => void;
  clearAll: () => void;

  // Selectors (exported as hooks)
  getEntry: (id: number) => PlaybackProgressEntry | undefined;
};
```

Constants (add to `app/constants/index.ts`):

```ts
export const PLAYBACK_PROGRESS_MAX_ENTRIES = 50;      // trim LRU on write
export const PLAYBACK_PROGRESS_MIN_POSITION_SEC = 10; // ignore scrubs under this
export const PLAYBACK_PROGRESS_COMPLETED_PCT = 0.95;  // treat as finished
export const PLAYBACK_PROGRESS_SAVE_INTERVAL_MS = 5000;
```

Persistence: use `zustandStorage` (MMKV) with `persist` middleware, key `playback-progress`, following `article_storage_store.ts` conventions. Include a `version` field on the persist config to support future migrations (especially when the backend is introduced).

Trim logic on `upsertProgress`: if `Object.keys(entries).length > PLAYBACK_PROGRESS_MAX_ENTRIES`, drop the oldest `updatedAt`.

### 1.2 Derived selector hooks

```ts
// Sorted by updatedAt desc, filters out completed entries.
export const useResumableAudio = () => ...;
export const useResumableVideo = () => ...;
export const useResumableEntry = (id: number) => ...;
```

These power the carousels and the "resume" decision inside the player.

### 1.3 Backend readiness

Keep all reads/writes funneled through the store actions — no component should call MMKV directly. Later the persistence layer can be replaced with a sync adapter (pull on app start, push on upsert, reconcile by `updatedAt`). The shape of `PlaybackProgressEntry` is deliberately JSON-friendly for that future sync.

---

## 2. Capturing Progress

### 2.1 New hook: `usePlaybackProgressTracker`

File: `app/components/videoComponent/usePlaybackProgressTracker.ts`

Responsibilities:
- Subscribe to THEOplayer `TIME_UPDATE`, `PAUSE`, `SEEKED`, `ENDED` events.
- Throttle writes to store to at most one per `PLAYBACK_PROGRESS_SAVE_INTERVAL_MS` AND on PAUSE / SEEKED / ENDED / unmount.
- Ignore live streams (`isLiveStream === true`).
- Ignore updates where `player.currentTime / 1000 < PLAYBACK_PROGRESS_MIN_POSITION_SEC`.
- Mark `completed = true` when `positionSec / durationSec >= 0.95` OR on `ENDED`.
- On ENDED/completed, set `positionSec = 0` so the UI shows "finished" but a re-resume starts from beginning.

Signature:
```ts
usePlaybackProgressTracker({
  player: THEOplayer | undefined,
  articleId: number,
  articleUrl?: string,
  mediaType: MediaType,
  isLiveStream: boolean,
  title: string,
  meta: { subtitle?; category_title?; category_id?; photo?; },
});
```

### 2.2 Wire tracker into player

Call sites to update:
- `app/components/videoComponent/TheoMediaPlayer.tsx` — add tracker alongside `usePlayerTracking`. The player already has `player`, `streamUri`, `mediaType`, `isLiveStream`, `startTime`.
- Article context already knows `article_id`, `article_url`, `main_photo`, etc. Extend `MediaBaseData` (`PlayerContext.ts`) with:
  ```ts
  articleId?: number;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  ```
- Update all call sites that build `MediaBaseData` (grep `setMediaData` / `setPlaylist`) to pass article metadata. Likely files:
  - `app/screens/article/*`
  - `app/components/videoComponent/context/playlist/*`
  - `app/screens/channel`, `app/screens/podcast`, `app/screens/vodcast`
- `TheoMediaPlayer` receives these through the same `MediaBaseData` flow and forwards them to the tracker.

### 2.3 Resume on open

In `VideoComponent.tsx` (or `TheoMediaPlayer`):
- Before computing `startTime`, check `usePlaybackProgressStore.getState().entries[articleId]`.
- If entry exists, not `completed`, and `positionSec > PLAYBACK_PROGRESS_MIN_POSITION_SEC`, use it as `startTime` **unless** an explicit `startTime` prop is passed.
- Keep existing fallback to `data.offset` from stream API.

---

## 3. UI Surfaces

### 3.1 Mediateka ("Tęsti žiūrėjimą")

- New row component: `app/components/continueRow/ContinueRow.tsx` (shared between Mediateka & Radioteka).
- Data source: `useResumableVideo()`.
- Visual: horizontal `MyFlatList`, cards with poster + title + progress bar (`progressPct`) at bottom.
- Injection point: top of Mediateka screen (identify exact screen from `useNavigationStore` menu route; mediateka is loaded via `mediatekaGetV2`).
- Hide the whole row when list is empty.
- Tap → navigate to article (reuse `pushArticle` from `app/util/NavigationUtils`). The player will auto-resume via §2.3.
- Long-press → bottom sheet with "Remove from continue watching" → `removeProgress(id)`.

### 3.2 Radioteka ("Tęsti klausymą")

- Mirrors §3.1 but uses `useResumableAudio()`.
- Rendered at top of Radioteka home screen (`radiotekaGet` consumer).
- Same component as §3.1, parametrized with `mediaType`.

### 3.3 User screen / History integration

- Add a "Tęsti" section above "Istorija" on the user/profile screen (`app/screens/user`) showing combined resumable list, capped at 10 items.
- Include "Clear all" action calling `clearAll()` in user settings under existing clear-history controls.

### 3.4 Localization

Add strings to `app/theme/` locale files:
- `continueWatching` → "Tęsti žiūrėjimą"
- `continueListening` → "Tęsti klausymą"
- `removeFromContinue` → "Pašalinti iš tęsimo"
- `clearContinueList` → "Išvalyti tęsimo sąrašą"

---

## 4. Phases & Sequencing

### Phase 1 — Core store + tracker (JS only)
1. Add constants to `app/constants/index.ts`.
2. Create `app/state/playback_progress_store.ts` with persistence (`version: 1`).
3. Extend `MediaBaseData` with article metadata; update all `setMediaData`/`setPlaylist` call sites.
4. Add `usePlaybackProgressTracker` and wire it into `TheoMediaPlayer.tsx`.
5. Implement resume-from-position logic in `VideoComponent.tsx` / `TheoMediaPlayer`.
6. Manual QA: play audio article, close, reopen — verify resume; watch video → finish → verify removed from resumable.

### Phase 2 — UI surfaces
1. Build `ContinueRow` shared component with progress bar card.
2. Inject into Mediateka screen (video) and Radioteka screen (audio).
3. Add "Tęsti" section to user/profile screen.
4. Add long-press remove + "Clear all" in settings.
5. Add localization strings.

### Phase 3 — Polish & telemetry
1. Firebase Analytics events: `continue_item_shown`, `continue_item_tapped`, `continue_item_resumed`, `continue_item_removed`, `continue_item_completed`.
2. Crashlytics breadcrumbs around store hydration and tracker edge cases.
3. Migration safety: wrap store hydration in try/catch; reset store on schema mismatch.
4. QA matrix: iOS foreground/background, Android foreground/background, airplane mode resume (no stream fetch), expired stream URL, app kill/relaunch mid-playback.

### Phase 4 (future) — Backend sync + CarPlay / Android Auto
- Out of scope for this iteration. When the backend lands, swap `zustandStorage` for a sync adapter and extend CarPlay (`ios/lrtApp/` native side) and Android Auto (`android/auto/`) to read resumable audio from the same store. Keep the `PlaybackProgressEntry` shape stable so this is a drop-in extension.

---

## 5. Edge Cases & Decisions

- **Live streams / channels**: excluded (tracker exits early when `isLiveStream`).
- **Playlist items**: treat each item independently — track by its own `articleId`.
- **Chromecast**: progress is not tracked while casting (THEOplayer `currentTime` unreliable); do not clear existing progress while cast session active.
- **Multiple devices**: out of scope for now — local-only, newest write wins per device. Backend will resolve this later.
- **Privacy**: clearing history in existing `useArticleStorageStore` should NOT clear playback progress automatically (different concept). Offer a separate clear action.
- **Stream URL changes**: we only store `articleId` + article url; on resume we refetch stream via existing `useStreamInfo`, so URL rotation is safe.
- **Unknown duration** (`player.duration === Infinity`): store `durationSec = 0`, show spinner/no-bar, never mark completed automatically — only mark on `ENDED`.

---

## 6. Files to Create

```
app/state/playback_progress_store.ts
app/components/videoComponent/usePlaybackProgressTracker.ts
app/components/continueRow/ContinueRow.tsx
```

## 7. Files to Modify

```
app/constants/index.ts
app/components/videoComponent/context/PlayerContext.ts
app/components/videoComponent/context/PlayerProvider.tsx
app/components/videoComponent/TheoMediaPlayer.tsx
app/components/videoComponent/VideoComponent.tsx
app/components/audioComponent/AudioComponent.tsx
app/screens/article/* (setMediaData call sites)
app/screens/podcast/*
app/screens/vodcast/*
app/screens/category/CategoryScreen.tsx          (Mediateka injection)
app/screens/user/*                                (Tęsti section)
app/theme/strings.*                               (localization)
```
