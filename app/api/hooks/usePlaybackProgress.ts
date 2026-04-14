import {useMemo} from 'react';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useAuth0} from 'react-native-auth0';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {
  PlaybackMediaType,
  PlaybackProgressEntry,
  usePlaybackProgressStore,
} from '../../state/playback_progress_store';

const QUERY_KEY = 'playbackProgress';
const FLUSH_INTERVAL_MS = 1000 * 30; // push every 30s if dirty
const URL = 'https://www.lrt.lt/servisai/dev-authrz/api/v1/user/watch-history';

type PlaybackProgressResponse = {
  list: PlaybackProgressEntry[];
};

/**
 * Fetches remote progress and merges into the local store.
 * Returns the (always-local) list immediately; remote response only updates the store.
 */
type PlaybackProgressSyncOptions = {
  mediaType: PlaybackMediaType;
  count: number;
};

export const usePlaybackProgress = (options: PlaybackProgressSyncOptions) => {
  const {mediaType, count} = options;
  const {user} = useAuth0();

  // Subscribe to the raw entries map so we re-render on any local change.
  const entriesMap = usePlaybackProgressStore((s) => s.entries);

  const query = useQuery({
    queryKey: [QUERY_KEY, mediaType ?? 'all', count ?? 'all'],
    queryFn: async ({signal}) => {
      const path = [URL, mediaType, count].join('/');
      const response = await HttpClient.get<PlaybackProgressResponse>(path, {signal});
      const remote = response.list ?? [];
      usePlaybackProgressStore.getState().mergeRemoteEntries(remote);
      return remote;
    },
    enabled: !!user,
  });

  // Derive the returned list from the store on every render so local
  // upserts/removes/dirty updates reflect immediately, while the query keeps
  // the remote side in sync.
  const data = useMemo(() => {
    return usePlaybackProgressStore.getState().getEntries({mediaType, count});
  }, [entriesMap, mediaType, count]);

  return {...query, data};
};

export const usePushPlaybackProgress = () =>
  useMutation({
    mutationFn: async (entries: PlaybackProgressEntry[]) => {
      const syncedAt = Date.now();
      if (entries.length === 0) {
        return {syncedAt, ids: [] as number[]};
      }
      await HttpClient.put(URL, {list: entries});
      return {syncedAt, ids: entries.map((e) => e.articleId)};
    },
    onSuccess: ({syncedAt, ids}) => {
      if (ids.length === 0) return;
      usePlaybackProgressStore.getState().markSynced(ids, syncedAt);
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
  });

export const useDeletePlaybackProgress = () =>
  useMutation({
    mutationFn: async (articleId: number) => {
      await HttpClient.del(`${URL}/${articleId}`);
      return articleId;
    },
    onSuccess: (articleId) => {
      usePlaybackProgressStore.getState().removeProgress(articleId);
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
    },
    retry: 3,
    retryDelay: 2000,
  });

/**
 * Periodically flushes dirty entries to the backend.
 * Mount once near the app root (alongside the GET sync hook).
 *
 * Uses useQuery with refetchInterval so react-query handles scheduling,
 * online/offline pause, and dedupe with other listeners.
 */
export const usePeriodicPlaybackProgressFlush = (intervalMs: number = FLUSH_INTERVAL_MS) => {
  const {user} = useAuth0();

  return useQuery({
    queryKey: [QUERY_KEY, 'flush'],
    queryFn: async () => {
      const dirty = usePlaybackProgressStore.getState().getDirtyEntries();
      if (dirty.length === 0) return {syncedAt: Date.now(), ids: [] as number[]};
      const syncedAt = Date.now();
      await HttpClient.put(URL, {list: dirty});
      const ids = dirty.map((e) => e.articleId);
      usePlaybackProgressStore.getState().markSynced(ids, syncedAt);
      queryClient.invalidateQueries({queryKey: [QUERY_KEY]});
      return {syncedAt, ids};
    },
    enabled: !!user,
    refetchInterval: intervalMs,
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 0,
  });
};
