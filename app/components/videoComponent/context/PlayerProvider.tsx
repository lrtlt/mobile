import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import useOrientation from '../../../util/useOrientation';
import {MediaBaseData, MediaType, PlayerContext} from './PlayerContext';
import TheoMediaPlayer from '../TheoMediaPlayer';
import Draggable from '@ngenux/react-native-draggable-view';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {IconClose} from '../../svg';
import {themeLight} from '../../../Theme';
import Text from '../../text/Text';

const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [playerData, setPlayerData] = useState<MediaBaseData>();

  const draggableRef = React.useRef<Draggable>(null);

  const orientation = useOrientation();
  const {width, height} = useWindowDimensions();

  const handleClose = useCallback(() => {
    setPlayerData(undefined);
  }, []);

  useEffect(() => {
    draggableRef.current?.resetPosition();
  }, [orientation]);

  const {colors, strings} = themeLight;

  const renderMiniPlayer = useCallback(() => {
    if (!playerData) {
      return null;
    }

    return (
      <Draggable
        ref={draggableRef}
        orientation={orientation}
        width={width * 2}
        height={height * 2}
        shouldStartDrag={true}
        childrenHeight={240}
        childrenWidth={135}
        edgeSpacing={4}>
        <View style={{padding: 2, alignItems: 'flex-end'}}>
          <TouchableDebounce onPress={handleClose} hitSlop={12}>
            <View
              style={{
                ...styles.closeButtonContainer,
                backgroundColor: colors.card,
              }}>
              <Text style={{letterSpacing: 0, textTransform: 'uppercase', fontSize: 12}}>
                {strings.close}
              </Text>
              <IconClose size={8} color={'red'} />
            </View>
          </TouchableDebounce>
          <View key={`${playerData.uri}-${playerData.startTime}`} style={styles.videoContainerPortrait}>
            <TheoMediaPlayer
              isLiveStream={!!playerData.isLiveStream}
              mediaType={playerData.mediaType ?? MediaType.VIDEO}
              poster={playerData.poster}
              title={playerData.title}
              streamUri={playerData.uri!}
              startTime={playerData.startTime}
              autoStart={true}
              isFloating={true}
            />
          </View>
        </View>
      </Draggable>
    );
  }, [orientation, playerData, width, height, colors, strings]);

  return (
    <PlayerContext.Provider
      value={{
        setPlayerData,
        close: handleClose,
      }}>
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
