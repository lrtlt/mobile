import React, {useCallback, useMemo, useState} from 'react';
import {MediaBaseData, MediaType, PlayerContext, PlayerContextType} from './PlayerContext';
import {useTheme} from '../../../Theme';
import MiniPlayerVideo from './miniPlayerVideo/MiniPlayerVideo';
import MiniPlayerAudio from './miniPlayerAudio/MiniPlayerAudio';
import {View} from 'react-native';

const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [currentMedia, setCurrentMedia] = useState<MediaBaseData>();

  const {colors} = useTheme();

  const handleClose = useCallback(() => {
    setCurrentMedia(undefined);
  }, []);

  const renderMiniPlayer = useCallback(() => {
    if (!currentMedia) {
      return null;
    }
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        {currentMedia.mediaType === MediaType.VIDEO ? <MiniPlayerVideo /> : <MiniPlayerAudio />}
      </View>
    );
  }, [colors, currentMedia]);

  const context: PlayerContextType = useMemo(
    () => ({
      mediaData: currentMedia,
      setMediaData: (data: MediaBaseData) => {
        console.log('setMediaData', data);
        setCurrentMedia(data);
      },
      close: handleClose,
    }),
    [currentMedia, setCurrentMedia, handleClose],
  );

  return (
    <PlayerContext.Provider value={context}>
      {props.children}
      {renderMiniPlayer()}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
