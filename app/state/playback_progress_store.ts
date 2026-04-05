import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {useShallow} from 'zustand/react/shallow';
import {zustandStorage} from './mmkv';
import {
  PLAYBACK_PROGRESS_COMPLETED_PCT,
  PLAYBACK_PROGRESS_MAX_ENTRIES,
} from '../constants';

export type PlaybackMediaType = 'audio' | 'video';

export type PlaybackProgressEntry = {
  // Identity
  id: number;
  url?: string;
  mediaType: PlaybackMediaType;

  // Display
  title: string;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  photo?: string;

  // Progress
  positionSec: number;
  durationSec: number;
  progressPct: number;
  completed: boolean;
  updatedAt: number;
};

export type UpsertProgressInput = {
  id: number;
  url?: string;
  mediaType: PlaybackMediaType;
  title: string;
  subtitle?: string;
  category_title?: string;
  category_id?: number;
  photo?: string;
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
    next[e.id] = e;
  });
  return next;
};

export const usePlaybackProgressStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      upsertProgress: (input) => {
        const existing = get().entries[input.id];
        const progressPct = computeProgress(input.positionSec, input.durationSec);
        const completed =
          input.completed === true || progressPct >= PLAYBACK_PROGRESS_COMPLETED_PCT;
        const entry: PlaybackProgressEntry = {
          id: input.id,
          url: input.url ?? existing?.url,
          mediaType: input.mediaType,
          title: input.title ?? existing?.title,
          subtitle: input.subtitle ?? existing?.subtitle,
          category_title: input.category_title ?? existing?.category_title,
          category_id: input.category_id ?? existing?.category_id,
          photo: input.photo ?? existing?.photo,
          positionSec: completed ? 0 : input.positionSec,
          durationSec: input.durationSec,
          progressPct: completed ? 1 : progressPct,
          completed,
          updatedAt: Date.now(),
        };
        set((state) => ({
          entries: trimToMax({...state.entries, [input.id]: entry}),
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
            if (!e.completed) next[e.id] = e;
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
    }),
    {
      name: 'playback-progress',
      version: 1,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

const sortByUpdatedAtDesc = (a: PlaybackProgressEntry, b: PlaybackProgressEntry) =>
  b.updatedAt - a.updatedAt;

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
      Object.values(state.entries).filter((e) => !e.completed).sort(sortByUpdatedAtDesc),
    ),
  );

export const useResumableEntry = (id: number | undefined): PlaybackProgressEntry | undefined =>
  usePlaybackProgressStore((state) => (id != null ? state.entries[id] : undefined));
