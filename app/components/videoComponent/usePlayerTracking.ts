import {useEffect, useRef} from 'react';
import {THEOplayer, PlayerEventType, Event} from 'react-native-theoplayer';
import useMediaTracking from './useMediaTracking';

interface UsePlayerTrackingParams {
  player: THEOplayer | undefined;
  streamUri: string;
  startTime?: number;
}

/**
 * Hook that sets up media analytics tracking for a THEOplayer instance.
 * Automatically tracks play, pause, seek, buffer, and complete events.
 */
const usePlayerTracking = ({player, streamUri, startTime}: UsePlayerTrackingParams) => {
  const {trackPlay, trackPause, trackSeek, trackBuffer, trackComplete, trackClose} = useMediaTracking();
  const hasTrackedInitialPlay = useRef(false);

  useEffect(() => {
    if (!player) return;

    const handlePlay = (_: Event<PlayerEventType.PLAY>) => {
      if (player?.currentTime && player.currentTime > 0) {
        trackPlay(streamUri, player.currentTime / 1000);
      } else if (!hasTrackedInitialPlay.current) {
        trackPlay(streamUri, startTime ?? 0);
        hasTrackedInitialPlay.current = true;
      }
    };

    const handlePause = (_: Event<PlayerEventType.PAUSE>) => {
      trackPause(streamUri, player.currentTime / 1000);
    };

    const handleSeek = (_: Event<PlayerEventType.SEEKED>) => {
      trackSeek(streamUri, player.currentTime / 1000);
    };

    const handleEnded = (_: Event<PlayerEventType.ENDED>) => {
      trackComplete(streamUri, player.currentTime / 1000);
    };

    // Track buffering when seeking
    let previousSeekingState = player.seeking;
    const handleSeekingChange = () => {
      if (player.seeking && !previousSeekingState) {
        trackBuffer(streamUri, player.currentTime / 1000);
      }
      previousSeekingState = player.seeking;
    };

    // Set up event listeners
    player.addEventListener(PlayerEventType.PLAY, handlePlay);
    player.addEventListener(PlayerEventType.PAUSE, handlePause);
    player.addEventListener(PlayerEventType.SEEKED, handleSeek);
    player.addEventListener(PlayerEventType.ENDED, handleEnded);
    player.addEventListener(PlayerEventType.SEEKING, handleSeekingChange);

    // Cleanup on unmount
    return () => {
      player.removeEventListener(PlayerEventType.PLAY, handlePlay);
      player.removeEventListener(PlayerEventType.PAUSE, handlePause);
      player.removeEventListener(PlayerEventType.SEEKED, handleSeek);
      player.removeEventListener(PlayerEventType.ENDED, handleEnded);
      player.removeEventListener(PlayerEventType.SEEKING, handleSeekingChange);

      // Track close when component unmounts
      trackClose(streamUri, player.currentTime / 1000);
    };
  }, [
    player,
    streamUri,
    startTime,
    trackPlay,
    trackPause,
    trackSeek,
    trackBuffer,
    trackComplete,
    trackClose,
  ]);
};

export default usePlayerTracking;
