import React, {useEffect, useMemo, useState} from 'react';
import {AccessibilityInfo} from 'react-native';
import {PresentationMode, THEOplayer} from 'react-native-theoplayer';
import {MediaPlayerState} from 'react-native-google-cast';
import {debounce} from 'lodash';
import {MediaType} from '../PlayerContext';
import {
  PlayerContext,
  PlayerControlActions,
  PlayerContextType,
  ControlsVisibilityState,
  ControlsVisibilityActions,
} from './PlayerContext';
import useChromecast from '../../useChromecast';
import usePlayerState from '../../ui/usePlayerState';
import {CONTROLS_TIMEOUT_MS} from '../../ui/MediaControls.constants';

interface PlayerContextProviderProps {
  player: THEOplayer | undefined;
  streamUri: string;
  isLiveStream: boolean;
  mediaType: MediaType;
  title?: string;
  poster: string;
  controlsEnabled: boolean;
  children: React.ReactNode;
}

export const PlayerContextProvider: React.FC<PlayerContextProviderProps> = ({
  player,
  streamUri,
  isLiveStream,
  mediaType,
  title,
  poster,
  controlsEnabled,
  children,
}) => {
  const [visible, setVisible] = useState(controlsEnabled);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setScreenReaderEnabled);
    return () => sub.remove();
  }, []);

  // Set up chromecast integration
  const {client: castClient, mediaStatus: castMediaStatus} = useChromecast({
    player,
    streamUri,
    isLiveStream,
    mediaType,
    title,
    poster,
  });

  // Player state
  const state = usePlayerState({player});

  // Debounced hide controls function
  const resetControlsTimeout = useMemo(
    () =>
      debounce(() => {
        if (screenReaderEnabled && controlsEnabled) {
          return;
        }
        setVisible(false);
      }, CONTROLS_TIMEOUT_MS),
    [screenReaderEnabled, controlsEnabled],
  );

  // Initialize timeout on mount
  useEffect(() => {
    if (controlsEnabled) {
      resetControlsTimeout();
    }
  }, [controlsEnabled, resetControlsTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetControlsTimeout.cancel();
    };
  }, [resetControlsTimeout]);

  // Visibility actions
  const visibilityActions: ControlsVisibilityActions = useMemo(
    () => ({
      showControls: () => {
        setVisible(true);
        resetControlsTimeout();
      },
      hideControls: () => {
        setVisible(false);
      },
      resetVisibilityTimeout: () => {
        resetControlsTimeout();
      },
    }),
    [resetControlsTimeout],
  );

  // Player control actions
  const actions: PlayerControlActions = useMemo(
    () => ({
      play: () => {
        if (castClient) {
          castClient.play();
        } else if (player) {
          player.play();
        }
        resetControlsTimeout();
      },

      playPause: () => {
        if (castClient) {
          if (castMediaStatus?.playerState === MediaPlayerState.PLAYING) {
            castClient.pause();
            player?.pause();
          } else {
            castClient.play();
          }
        } else if (player) {
          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
        }
        resetControlsTimeout();
      },

      toggleMute: () => {
        if (player) {
          player.muted = !player.muted;
        }
        resetControlsTimeout();
      },

      toggleFullScreen: () => {
        if (player) {
          if (player.presentationMode === PresentationMode.fullscreen) {
            player.presentationMode = PresentationMode.inline;
          } else {
            player.presentationMode = PresentationMode.fullscreen;
          }
        }
        resetControlsTimeout();
      },

      seek: (time: number) => {
        if (player) {
          const seekerStart = (player.seekable[0]?.start ?? 0) / 1000;
          const seekerEnd = (player.seekable[0]?.end ?? Infinity) / 1000;
          const clamped = Math.max(seekerStart, Math.min(time, seekerEnd));
          player.currentTime = clamped * 1000;
          castClient?.seek({position: clamped});
        }
        resetControlsTimeout();
      },

      seekBy: (delta: number) => {
        if (player) {
          const currentTime = player.currentTime / 1000;
          const seekerStart = (player.seekable[0]?.start ?? 0) / 1000;
          const seekerEnd = (player.seekable[0]?.end ?? Infinity) / 1000;
          const target = Math.max(seekerStart, Math.min(currentTime + delta, seekerEnd));
          player.currentTime = target * 1000;
          castClient?.seek({position: delta, relative: true});
        }
        resetControlsTimeout();
      },
      seekToLive: () => {
        if (player) {
          const end = (player.seekable[0]?.end ?? 1) / 1000;
          player.currentTime = end * 1000;
          castClient?.seek({position: end});
        }
      },
    }),
    [player, castClient, castMediaStatus, resetControlsTimeout],
  );

  // Visibility state
  const visibility: ControlsVisibilityState = useMemo(
    () => ({
      visible:
        visible ||
        state.isOnStart ||
        state.isEnding ||
        (screenReaderEnabled && controlsEnabled),
    }),
    [visible, state, screenReaderEnabled, controlsEnabled],
  );

  const contextValue: PlayerContextType = useMemo(
    () => ({
      player,
      actions,
      visibility,
      visibilityActions,
      state,
    }),
    [player, actions, visibility, visibilityActions, state],
  );

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};
