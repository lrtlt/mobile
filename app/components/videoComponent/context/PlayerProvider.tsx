import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {MediaBaseData, MediaType, PlayerContext, PlayerContextType} from './PlayerContext';
import TheoMediaPlayer, {PlayerAction} from '../TheoMediaPlayer';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {IconClose} from '../../svg';
import {useTheme} from '../../../Theme';
import Text from '../../text/Text';
import {uniqueId} from 'lodash';
import {EventRegister} from 'react-native-event-listeners';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [playlist, setPlaylist] = useState<MediaBaseData[]>([]);
  const [currentMedia, setCurrentMedia] = useState<MediaBaseData>();
  const uuid = useRef<string>(uniqueId('player-'));

  const {colors, dark} = useTheme();
  const {bottom} = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    setPlaylist([]);
    setCurrentMedia(undefined);
  }, []);

  const handleFullScreen = useCallback(() => {
    const action: PlayerAction = 'setFullScreen';
    EventRegister.emit(uuid.current, action);
  }, [uuid]);

  const playNext = useCallback(() => {
    console.log('playNext', playlist.length);
    if (playlist.length === 0) {
      return;
    }
    const nextIndex = playlist.findIndex((item) => item === currentMedia) + 1;
    if (nextIndex >= playlist.length) {
      if (playlist.length === 1) {
        handleClose();
      } else {
        setCurrentMedia(playlist[0]);
      }
    } else {
      setCurrentMedia(playlist[nextIndex]);
    }
  }, [playlist, currentMedia]);

  const playPrevious = useCallback(() => {
    console.log('playPrevious', playlist.length);
    if (playlist.length === 0) {
      return;
    }
    const nextIndex = playlist.findIndex((item) => item === currentMedia) - 1;
    if (nextIndex < 0) {
      setCurrentMedia(playlist[playlist.length - 1]);
    } else {
      setCurrentMedia(playlist[nextIndex]);
    }
  }, [playlist, currentMedia]);

  const renderMiniPlayer = useCallback(() => {
    if (!currentMedia) {
      return null;
    }
    return (
      <TouchableDebounce onPress={handleFullScreen}>
        <View
          style={{
            height: 56,
            // borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            flexDirection: 'row',
            backgroundColor: colors.greyBackground,
            alignItems: 'center',
            paddingEnd: 8,
            zIndex: 4,
            gap: 10,

            shadowColor: '#00000066',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.27,
            shadowRadius: 3.65,
          }}>
          <View style={styles.videoContainer}>
            <TheoMediaPlayer
              uuid={uuid.current}
              isLiveStream={!!currentMedia.isLiveStream}
              mediaType={currentMedia.mediaType ?? MediaType.VIDEO}
              poster={currentMedia.poster}
              title={currentMedia.title}
              streamUri={currentMedia.uri!}
              startTime={currentMedia.startTime}
              autoStart={true}
              isFloating={true}
              controls={false}
              onEnded={playNext}
            />
          </View>
          <View style={{flex: 1, gap: 4}}>
            <Text
              style={{color: colors.text, fontSize: 14.3, width: '100%'}}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {currentMedia.title}
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, flexDirection: 'row', gap: 16, alignItems: 'center'}}>
            <TouchableDebounce onPress={handleClose} hitSlop={12}>
              <IconClose size={16} color={colors.text} />
            </TouchableDebounce>
          </View>
        </View>
        <View style={{height: bottom - 8, backgroundColor: colors.background}} />
      </TouchableDebounce>
    );
  }, [uuid, colors, dark, handleFullScreen, currentMedia, playNext]);

  const context: PlayerContextType = useMemo(
    () => ({
      setPlaylist: (playlist: MediaBaseData[], current?: number) => {
        setPlaylist(playlist);
        if (current) {
          setCurrentMedia(playlist[current]);
        } else if (playlist.length > 0) {
          setCurrentMedia(playlist[0]);
        } else {
          setCurrentMedia(undefined);
        }
      },
      playNext: playNext,
      playPrevious: playPrevious,
      close: handleClose,
    }),
    [setPlaylist, handleClose, playNext, playPrevious, playlist],
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
