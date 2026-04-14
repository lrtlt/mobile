import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {useShallow} from 'zustand/react/shallow';
import {zustandStorage} from './mmkv';
import {PLAYBACK_PROGRESS_COMPLETED_PCT, PLAYBACK_PROGRESS_MAX_ENTRIES} from '../constants';

export type PlaybackMediaType = 'audio' | 'video';

export type PlaybackProgressEntry = {
  // Identity
  articleId: number;
  mediaType: PlaybackMediaType;
  category_id?: number;

  // Progress
  positionSec: number;
  durationSec: number;
  progressPct: number;
  completed: boolean;
  updatedAt: number;

  // Sync
  dirty?: boolean;
};

export type UpsertProgressInput = {
  articleId: number;
  mediaType: PlaybackMediaType;
  category_id?: number;
  positionSec: number;
  durationSec: number;
  completed?: boolean;
};

type State = {
  entries: Record<number, PlaybackProgressEntry>;
};

type Actions = {
  upsertProgress: (input: UpsertProgressInput) => void;
  removeProgress: (id: number) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  getEntry: (id: number) => PlaybackProgressEntry | undefined;
  getEntries: (options?: {mediaType?: PlaybackMediaType; count?: number}) => PlaybackProgressEntry[];
  getDirtyEntries: () => PlaybackProgressEntry[];
  markSynced: (ids: number[], syncedAt: number) => void;
  mergeRemoteEntries: (remote: PlaybackProgressEntry[]) => void;
};

type Store = State & Actions;

const initialState: State = {
  entries: {},
};

const computeProgress = (positionSec: number, durationSec: number): number => {
  if (!durationSec || durationSec <= 0) return 0;
  const pct = positionSec / durationSec;
  if (pct < 0) return 0;
  if (pct > 1) return 1;
  return pct;
};

const trimToMax = (entries: Record<number, PlaybackProgressEntry>) => {
  const ids = Object.keys(entries);
  if (ids.length <= PLAYBACK_PROGRESS_MAX_ENTRIES) return entries;
  const sorted = ids
    .map((id) => entries[Number(id)])
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, PLAYBACK_PROGRESS_MAX_ENTRIES);
  const next: Record<number, PlaybackProgressEntry> = {};
  sorted.forEach((e) => {
    next[e.articleId] = e;
  });
  return next;
};

export const usePlaybackProgressStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      upsertProgress: (input) => {
        if (!input.articleId || !input.durationSec) return;
        const existing = get().entries[input.articleId];
        const positionSec = Math.round(input.positionSec);
        const durationSec = Math.round(input.durationSec);
        const progressPct = Math.round(computeProgress(positionSec, durationSec) * 100) / 100;
        const completed = input.completed === true || progressPct >= PLAYBACK_PROGRESS_COMPLETED_PCT;
        const entry: PlaybackProgressEntry = {
          articleId: input.articleId,
          mediaType: input.mediaType,
          category_id: input.category_id ?? existing?.category_id,
          positionSec: completed ? 0 : positionSec,
          durationSec,
          progressPct: completed ? 1 : progressPct,
          completed,
          updatedAt: Date.now(),
          dirty: true,
        };
        set((state) => ({
          entries: trimToMax({...state.entries, [input.articleId]: entry}),
        }));
      },
      removeProgress: (id) => {
        set((state) => {
          if (!(id in state.entries)) return state;
          const next = {...state.entries};
          delete next[id];
          return {entries: next};
        });
      },
      clearCompleted: () => {
        set((state) => {
          const next: Record<number, PlaybackProgressEntry> = {};
          Object.values(state.entries).forEach((e) => {
            if (!e.completed) next[e.articleId] = e;
          });
          return {entries: next};
        });
      },
      clearAll: () => {
        set({entries: {}});
      },
      getEntry: (id) => {
        return get().entries[id];
      },
      getEntries: (options) => {
        const {mediaType, count} = options ?? {};
        let result = Object.values(get().entries).filter((e) => !e.completed);
        if (mediaType) {
          result = result.filter((e) => e.mediaType === mediaType);
        }
        result.sort(sortByUpdatedAtDesc);
        if (count != null) {
          result = result.slice(0, count);
        }
        return result;
      },
      getDirtyEntries: () => {
        return Object.values(get().entries).filter((e) => e.dirty);
      },
      markSynced: (ids, syncedAt) => {
        set((state) => {
          const next = {...state.entries};
          ids.forEach((id) => {
            const e = next[id];
            // Only clear dirty if nothing newer happened after the push was fired
            if (e && e.dirty && e.updatedAt <= syncedAt) {
              next[id] = {...e, dirty: false};
            }
          });
          return {entries: next};
        });
      },
      mergeRemoteEntries: (remote) => {
        set((state) => {
          let next = {...state.entries};
          remote.forEach((r) => {
            if (!r || !r.articleId) {
              return;
            }

            const local = next[r.articleId];
            if (!local) {
              next[r.articleId] = {...r, dirty: false};
              return;
            }
            // Remote wins if strictly newer (covers cross-device updates even when local is dirty).
            if (r.updatedAt > local.updatedAt) {
              next[r.articleId] = {...r, dirty: false};
              return;
            }
            // Otherwise keep local dirty/unsynced changes; sync non-dirty locals up to remote.
            if (!local.dirty && r.updatedAt === local.updatedAt) {
              next[r.articleId] = {...r, dirty: false};
            }
          });
          // Rebuild the map in sorted order so Object.values() iteration matches the sort.
          const trimmed = trimToMax(next);
          const sorted: Record<number, PlaybackProgressEntry> = {};
          Object.values(trimmed)
            .sort(sortByUpdatedAtDesc)
            .forEach((e) => {
              sorted[e.articleId] = e;
            });
          next = sorted;
          return {entries: next};
        });
      },
    }),
    {
      name: 'playback-progress',
      version: 2,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

const sortByUpdatedAtDesc = (a: PlaybackProgressEntry, b: PlaybackProgressEntry) => b.updatedAt - a.updatedAt;

export const useResumableAudio = (): PlaybackProgressEntry[] =>
  usePlaybackProgressStore(
    useShallow((state) =>
      Object.values(state.entries)
        .filter((e) => !e.completed && e.mediaType === 'audio')
        .sort(sortByUpdatedAtDesc),
    ),
  );

export const useResumableVideo = (): PlaybackProgressEntry[] =>
  usePlaybackProgressStore(
    useShallow((state) =>
      Object.values(state.entries)
        .filter((e) => !e.completed && e.mediaType === 'video')
        .sort(sortByUpdatedAtDesc),
    ),
  );

export const useResumableAll = (): PlaybackProgressEntry[] =>
  usePlaybackProgressStore(
    useShallow((state) =>
      Object.values(state.entries)
        .filter((e) => !e.completed)
        .sort(sortByUpdatedAtDesc),
    ),
  );

export const useResumableEntry = (id: number | undefined): PlaybackProgressEntry | undefined =>
  usePlaybackProgressStore((state) => (id != null ? state.entries[id] : undefined));
