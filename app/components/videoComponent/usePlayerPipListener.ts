import {useEffect} from 'react';
import {
  PlayerEventType,
  PresentationModeChangeEvent,
  PresentationModeChangePipContext,
  THEOplayer,
} from 'react-native-theoplayer';
import {log, getCrashlytics} from '@react-native-firebase/crashlytics';

interface UsePlayerPipListenerParams {
  player: THEOplayer | undefined;
}

/**
 * Stops playback when the user explicitly dismisses the PiP window,
 * otherwise audio keeps playing due to backgroundAudioConfiguration.
 */
const usePlayerPipListener = ({player}: UsePlayerPipListenerParams) => {
  useEffect(() => {
    if (!player) return;

    const onPresentationModeChange = (event: PresentationModeChangeEvent) => {
      if (event.context?.pip === PresentationModeChangePipContext.CLOSED) {
        log(getCrashlytics(), 'TheoMediaPlayer: PiP window dismissed, stopping playback');
        player.pause();
      }
    };

    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, onPresentationModeChange);
    return () => {
      player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, onPresentationModeChange);
    };
  }, [player]);
};

export default usePlayerPipListener;
