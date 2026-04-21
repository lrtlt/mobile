import {useEffect, useState} from 'react';
import {PlayerEventType, PresentationMode, THEOplayer} from 'react-native-theoplayer';

interface UsePlayerStateParams {
  player: THEOplayer | undefined;
}

export type PlayerState = {
  seekerStart: number;
  seekerEnd: number;
  duration: number;
  isFullScreen: boolean;
  isBuffering: boolean;
  isLiveStream: boolean;
  isSeekerEnabled: boolean;
  isOnStart: boolean;
  isEnding: boolean;
  isPaused: boolean;
  isMuted: boolean;
};

const usePlayerState = ({player}: UsePlayerStateParams) => {
  const [seekerStart, setSeekerStart] = useState(0);
  const [seekerEnd, setSeekerEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [isSeekerEnabled, setIsSeekerEnabled] = useState(true);
  const [isOnStart, setIsOnStart] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!player) return;

    // Compute seekable/duration/isLiveStream/isSeekerEnabled from the player's
    // current state. For live streams the seekable window grows over time, so
    // we need to re-evaluate this on TIME_UPDATE as well, not only on
    // LOADED_DATA / LOADED_METADATA. Otherwise the seekbar would be hidden
    // because the DVR window wasn't reported yet at load time on iOS.
    const syncSeekable = () => {
      const start = (player.seekable[0]?.start ?? 1) / 1000;
      const end = (player.seekable[0]?.end ?? 1) / 1000;
      const dur = (player.duration === Infinity ? 0 : player.duration ?? 0) / 1000;

      setSeekerStart(start);
      setSeekerEnd(end);
      setDuration(dur);
      const isLive = isNaN(dur) || !isFinite(dur) || dur <= 0;
      setIsLiveStream(isLive);
      const enabled = (!isLive || end - start > 60) && !isNaN(player.currentTime);
      setIsSeekerEnabled(enabled);
    };

    const handleTimeUpdate = () => {
      const curr = (player?.currentTime ?? 0) / 1000;
      const dur = (player.duration === Infinity ? 0 : player.duration ?? 0) / 1000;
      const end = (player.seekable[0]?.end ?? 1) / 1000;
      const isLive = isNaN(dur) || !isFinite(dur) || dur <= 0;
      const isOnStart = !isLive && curr <= 1;
      setIsOnStart(isOnStart);
      const isEnding = !isLive && end - curr <= 1;
      setIsEnding(isEnding);
      setIsBuffering(player.seeking && !player.paused);
      // For live streams, keep the seekable window fresh as it advances.
      syncSeekable();
    };

    const handleFullScreenChange = () => {
      setIsFullScreen(player.presentationMode === PresentationMode.fullscreen);
    };

    const handleSeeking = () => {
      setIsBuffering(player.seeking && !player.paused);
    };

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleVolumeChange = () => setIsMuted(player.muted);

    player.addEventListener(PlayerEventType.PLAY, handlePlay);
    player.addEventListener(PlayerEventType.PAUSE, handlePause);
    player.addEventListener(PlayerEventType.VOLUME_CHANGE, handleVolumeChange);
    player.addEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);
    player.addEventListener(PlayerEventType.LOADED_DATA, syncSeekable);
    player.addEventListener(PlayerEventType.LOADED_METADATA, syncSeekable);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, syncSeekable);
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, handleFullScreenChange);
    player.addEventListener(PlayerEventType.SEEKING, handleSeeking);

    // Set initial values
    syncSeekable();
    setIsMuted(player.muted);
    setIsPaused(player.paused);
    setIsFullScreen(player.presentationMode === PresentationMode.fullscreen);

    return () => {
      player.removeEventListener(PlayerEventType.PLAY, handlePlay);
      player.removeEventListener(PlayerEventType.PAUSE, handlePause);
      player.removeEventListener(PlayerEventType.VOLUME_CHANGE, handleVolumeChange);
      player.removeEventListener(PlayerEventType.TIME_UPDATE, handleTimeUpdate);
      player.removeEventListener(PlayerEventType.LOADED_DATA, syncSeekable);
      player.removeEventListener(PlayerEventType.LOADED_METADATA, syncSeekable);
      player.removeEventListener(PlayerEventType.DURATION_CHANGE, syncSeekable);
      player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, handleFullScreenChange);
      player.removeEventListener(PlayerEventType.SEEKING, handleSeeking);
    };
  }, [player]);

  return {
    seekerStart,
    seekerEnd,
    duration,
    isFullScreen,
    isBuffering,
    isLiveStream,
    isSeekerEnabled,
    isOnStart,
    isEnding,
    isPaused,
    isMuted,
  };
};

export default usePlayerState;
