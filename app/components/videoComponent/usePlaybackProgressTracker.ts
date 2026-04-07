import {useEffect, useRef} from 'react';
import {THEOplayer, PlayerEventType} from 'react-native-theoplayer';
import {MediaType} from './context/PlayerContext';
import {usePlaybackProgressStore} from '../../state/playback_progress_store';
import {PLAYBACK_PROGRESS_MIN_POSITION_SEC, PLAYBACK_PROGRESS_SAVE_INTERVAL_MS} from '../../constants';

export type PlaybackTrackingMeta = {
  articleId: number;
  category_id?: number;
};

interface Params {
  player: THEOplayer | undefined;
  meta?: PlaybackTrackingMeta;
  mediaType: MediaType;
  isLiveStream: boolean;
}

/**
 * Tracks playback position for on-demand audio/video articles and persists it to
 * `usePlaybackProgressStore` so the user can continue playing later.
 *
 * Writes are throttled to at most one per PLAYBACK_PROGRESS_SAVE_INTERVAL_MS and
 * flushed on PAUSE / SEEKED / ENDED / unmount.
 */
const usePlaybackProgressTracker = ({player, meta, mediaType, isLiveStream}: Params) => {
  const lastSaveAtRef = useRef(0);

  useEffect(() => {
    if (!player) return;
    if (!meta?.articleId) return;
    if (isLiveStream) return;

    const {articleId, category_id} = meta;

    const persist = (completed: boolean) => {
      const positionSec = (player.currentTime ?? 0) / 1000;
      const rawDuration = player.duration;
      const durationSec =
        rawDuration === Infinity || !isFinite(rawDuration) || isNaN(rawDuration)
          ? 0
          : (rawDuration ?? 0) / 1000;

      // Skip very early positions — nothing to resume yet. We still allow
      // completed:true to fall through so ENDED clears/marks the entry.
      if (!completed && positionSec < PLAYBACK_PROGRESS_MIN_POSITION_SEC) return;

      usePlaybackProgressStore.getState().upsertProgress({
        articleId,
        mediaType: mediaType === MediaType.AUDIO ? 'audio' : 'video',
        category_id,
        positionSec,
        durationSec,
        completed,
      });
      lastSaveAtRef.current = Date.now();
    };

    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastSaveAtRef.current < PLAYBACK_PROGRESS_SAVE_INTERVAL_MS) return;
      persist(false);
    };

    const onPause = () => persist(false);
    const onSeeked = () => persist(false);
    const onEnded = () => persist(true);

    player.addEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdate);
    player.addEventListener(PlayerEventType.PAUSE, onPause);
    player.addEventListener(PlayerEventType.SEEKED, onSeeked);
    player.addEventListener(PlayerEventType.ENDED, onEnded);

    return () => {
      player.removeEventListener(PlayerEventType.TIME_UPDATE, onTimeUpdate);
      player.removeEventListener(PlayerEventType.PAUSE, onPause);
      player.removeEventListener(PlayerEventType.SEEKED, onSeeked);
      player.removeEventListener(PlayerEventType.ENDED, onEnded);
      // Final flush on unmount.
      persist(false);
    };
  }, [
    player,
    meta?.articleId,
    meta?.category_id,
    mediaType,
    isLiveStream,
  ]);
};

export default usePlaybackProgressTracker;
