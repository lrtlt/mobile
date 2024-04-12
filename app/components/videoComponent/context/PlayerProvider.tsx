import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MediaBaseData, MediaType, PlayerContext, PlayerContextType} from './PlayerContext';
import TheoMediaPlayer, {PlayerAction} from '../TheoMediaPlayer';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {IconClose} from '../../svg';
import {themeDark} from '../../../Theme';
import Text from '../../text/Text';
import {uniqueId} from 'lodash';
import {EventRegister} from 'react-native-event-listeners';

const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [playerData, setPlayerData] = useState<MediaBaseData>();
  const uuid = useRef<string>(uniqueId('player-'));

  const handleClose = useCallback(() => {
    setPlayerData(undefined);
  }, []);

  const handleFullScreen = useCallback(() => {
    const action: PlayerAction = 'setFullScreen';
    EventRegister.emit(uuid.current, action);
  }, [uuid]);

  const renderMiniPlayer = useCallback(() => {
    if (!playerData) {
      return null;
    }

    return (
      <TouchableDebounce onPress={handleFullScreen}>
        <View
          style={{
            height: 48,
            flexDirection: 'row',
            backgroundColor: 'black',
            alignItems: 'center',
            gap: 12,
          }}>
          <View key={`${playerData.uri}-${playerData.startTime}`} style={styles.videoContainer}>
            <TheoMediaPlayer
              uuid={uuid.current}
              isLiveStream={!!playerData.isLiveStream}
              mediaType={playerData.mediaType ?? MediaType.VIDEO}
              poster={playerData.poster}
              title={playerData.title}
              streamUri={playerData.uri!}
              startTime={playerData.startTime}
              autoStart={true}
              isFloating={true}
              controls={false}
            />
          </View>
          <View style={{flex: 1, gap: 4}}>
            <Text
              style={{color: themeDark.colors.text, fontSize: 14, width: '100%'}}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {playerData.title}
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, flexDirection: 'row', gap: 16, alignItems: 'center'}}>
            <TouchableDebounce onPress={handleClose} hitSlop={12}>
              <IconClose size={16} color={'white'} />
            </TouchableDebounce>
          </View>
        </View>
      </TouchableDebounce>
    );
  }, [playerData, uuid]);

  const context: PlayerContextType = useMemo(
    () => ({
      setPlayerData,
      close: handleClose,
    }),
    [setPlayerData, handleClose],
  );

  return (
    <PlayerContext.Provider value={context}>
      {props.children}
      {renderMiniPlayer()}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;

const BORDER_WIDTH = 0;

const styles = StyleSheet.create({
  videoContainerPortrait: {
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
    overflow: 'hidden',
    borderRadius: 8,
    //Aspect ratio 16:9
    width: 240 - BORDER_WIDTH * 2,
    height: 135,
    // aspectRatio: 16 / 9,

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  videoContainer: {
    overflow: 'hidden',
    //Aspect ratio 16:9
    height: '100%',
    aspectRatio: 16 / 9,
  },
  closeButtonContainer: {
    // width: 24,
    // height: 28,
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
