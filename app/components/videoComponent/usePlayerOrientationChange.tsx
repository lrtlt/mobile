import {useEffect, useRef} from 'react';
import useOrientation from '../../util/useOrientation';
import {PresentationMode, THEOplayer} from 'react-native-theoplayer';

interface UsePlayerOrientationChangeParams {
  player: THEOplayer | undefined;
}

const usePlayerOrientationChange = ({player}: UsePlayerOrientationChangeParams) => {
  const previousOrientation = useRef<string>(undefined);
  const orientation = useOrientation();

  useEffect(() => {
    if (!player) {
      return;
    }

    if (previousOrientation.current === 'landscape' && orientation === 'portrait') {
      player.presentationMode = PresentationMode.inline;
    }
    if (previousOrientation.current !== orientation) {
      previousOrientation.current = orientation;
    }
  }, [orientation, player]);
};

export default usePlayerOrientationChange;
