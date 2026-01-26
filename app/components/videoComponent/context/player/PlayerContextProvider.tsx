import React, {useEffect, useMemo, useState} from 'react';
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

const CONTROLS_TIMEOUT_MS = 2500;

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
        setVisible(false);
      }, CONTROLS_TIMEOUT_MS),
    [],
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
          player.currentTime = time * 1000;
          castClient?.seek({position: time});
        }
        resetControlsTimeout();
      },

      seekBy: (delta: number) => {
        if (player) {
          const newTime = player.currentTime + delta * 1000;
          player.currentTime = newTime;
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
      visible: visible || state.isOnStart || state.isEnding,
    }),
    [visible, state],
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
