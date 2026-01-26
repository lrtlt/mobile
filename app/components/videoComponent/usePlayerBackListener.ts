import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {PresentationMode, THEOplayer} from 'react-native-theoplayer';

interface UsePlayerBackListenerParams {
  player: THEOplayer | undefined;
}

const usePlayerBackListener = ({player}: UsePlayerBackListenerParams) => {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (player && player.presentationMode === PresentationMode.fullscreen) {
        player.presentationMode = PresentationMode.inline;
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [player]);
};

export default usePlayerBackListener;
