import {useEffect, useState} from 'react';
import {PlayerEventType, PresentationMode, THEOplayer, Event} from 'react-native-theoplayer';

interface UsePlayerFullscreenParams {
  player: THEOplayer | undefined;
}

const usePlayerFullScreen = ({player}: UsePlayerFullscreenParams) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!player) return;

    const onPresentationModeChange = (_: Event<PlayerEventType.PRESENTATIONMODE_CHANGE>) => {
      setIsFullScreen(player.presentationMode === PresentationMode.fullscreen);
    };

    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, onPresentationModeChange);
    return () => {
      player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, onPresentationModeChange);
    };
  }, [player]);

  return {isFullScreen};
};

export default usePlayerFullScreen;
