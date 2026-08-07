# Subtitle Preference overrides the stream's own default track

The subtitle language a user picks is saved app-wide and preselected on every stream that follows. Where no preference applies, subtitles are forced **off** — the `default: true` flag the API sends on side-loaded tracks is deliberately ignored, and always has been.

## Context

`usePlayerSubtitles` has always cleared `player.selectedTextTrack` shortly after the first `TEXT_TRACK_LIST` event. That was not incidental: VOD subtitle tracks come from the API as side-loaded `textTracks` (`useStream.ts`) and frequently carry `default: true`, which would otherwise turn subtitles on unrequested for every viewer. The clear looked like dead code with a mysterious 300 ms iOS timer, and is exactly the kind of thing a future reader would "fix."

Layering a remembered preference on top makes the override load-bearing rather than incidental, so it is recorded here.

## Decisions

1. **Three states, not two.** The preference is `undefined` (unset — never used the menu), `{kind: 'off'}` (explicitly disabled) or `{kind: 'language'}`. Unset and off behave identically today; they are kept distinct so that honouring the stream's `default: true` for first-time users stays available as a future choice without a storage migration. Encoded as a discriminated union rather than a `string | null | undefined` tri-state, because null-vs-undefined carrying domain meaning is collapsed by the first stray `??`.

2. **One global preference.** Not per-show, per-channel, or split live/VOD. A per-show map would do nothing on the first episode of any show — which is most playback — and needs keying and eviction. Accepted cost: a one-off choice on a single foreign-language film leaks into all later playback until the user changes it.

3. **A miss is silent.** If the preferred language is absent from a source, no subtitles are shown and the preference is left intact, so the next source that does carry it still matches. Rejected falling back to the stream's `default: true` track or to the first available track: both mean showing a language the user never asked for, and the latter picks essentially at random from manifest order.

4. **Matching compares language *names*, not codes.** Preferences store the raw `track.language` as picked, but two codes are treated as the same language when `getLanguageName` maps them to the same name. The API sends 2-letter codes (`lt`) on side-loaded tracks while manifests tend to announce 3-letter ones (`lit`), so without some folding the feature fails in exactly the cross-stream case it exists for. A dedicated alias table was rejected: it would be a *second* copy of knowledge `getLanguageName` already holds, free to drift from the list the user actually sees in the menu, and incomplete for any language nobody thought to add. Comparing names keeps one table, and unknown codes return themselves so matching degrades to exact comparison.

5. **Applied per source, via a latch — no timer.** `TEXT_TRACK_LIST` fires once *per track* (`subType: ADD_TRACK | …`), so it is not a "list complete" signal; the old code's single-shot latch plus a 300 ms iOS `setTimeout` was compensating for that. The latch now resets on `SOURCE_CHANGE` and the preference is re-evaluated on every track event until it is satisfied, with `LOADED_METADATA` as a second later pass. A manual pick also closes the latch so a late-arriving track can never override an on-screen choice.

   This incidentally fixes a bug: the old latch was a `useRef` never reset across sources, while `TheoMediaPlayer` swaps `player.source` without remounting — so the *second* stream played by one mounted player silently honoured `default: true`.

## Scope

Audio-track language (`usePlayerLanguage`) deliberately keeps its stateless behaviour: a wrong audio track means silence or the wrong language with no visual cue, whereas a wrong subtitle is merely visible and dismissible. Revisit once this has been observed in the wild.

Chromecast is unaffected — `useChromecast` loads media by URL with no `mediaTracks`, so subtitles do not exist on that path at all.

## Consequences

- The feature is invisible: the subtitles menu shows no selected state, so the only signal that the app remembered anything is that subtitles appear.
- `lrt_lt_subtitles_selected` still fires only on manual taps, so subtitle-usage figures will appear to drop after release — one setter now watches many episodes while logging a single event.
- `getLanguageName` now serves two jobs — menu labels and preference matching — so adding a language there fixes both at once, but a careless edit breaks both at once too. None of it is covered by tests; a regression makes the feature stop matching silently rather than loudly.
- Region subtags are not stripped: a track announcing `lt-LT` matches neither `lt` nor `lit`, because `getLanguageName` doesn't know the form. It would already display as `lt-LT` in the menu today, so matching is no worse than the UI — fix both together in `getLanguageName` if such a track ever turns up.
