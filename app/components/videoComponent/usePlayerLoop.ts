import {useEffect} from 'react';
import {PlayerEventType, PresentationMode, THEOplayer, Event} from 'react-native-theoplayer';

interface UsePlayerLoopParams {
  player: THEOplayer | undefined;
  loop: boolean;
}

const usePlayerLoop = ({player, loop}: UsePlayerLoopParams) => {
  useEffect(() => {
    if (!player) return;

    const onEnded = (_: Event<PlayerEventType.ENDED>) => {
      if (loop) {
        setTimeout(() => {
          player.play();
        }, 200);
      } else {
        if (player.presentationMode === PresentationMode.fullscreen) {
          player.presentationMode = PresentationMode.inline;
        }
      }
    };

    player.addEventListener(PlayerEventType.ENDED, onEnded);
    return () => {
      player.removeEventListener(PlayerEventType.ENDED, onEnded);
    };
  }, [player, loop]);
};

export default usePlayerLoop;
