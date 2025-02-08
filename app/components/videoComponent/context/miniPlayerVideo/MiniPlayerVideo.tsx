import {useCallback, useRef} from 'react';
import {PresentationMode, THEOplayer} from 'react-native-theoplayer';
import {useTheme} from '../../../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TheoMediaPlayer from '../../TheoMediaPlayer';
import TouchableDebounce from '../../../touchableDebounce/TouchableDebounce';
import {IconClose} from '../../../svg';
import {useMediaPlayer} from '../useMediaPlayer';

const MiniPlayerVideo: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const playerRef = useRef<THEOplayer>();

  const {mediaData, close} = useMediaPlayer();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();

  const handleFullScreen = useCallback(() => {
    if (playerRef.current) {
      playerRef.current!.presentationMode = PresentationMode.fullscreen;
    }
  }, []);

  if (!mediaData) {
    return null;
  }

  return (
    <View
      style={{
        ...styles.layout,
        marginBottom: bottom,
        backgroundColor: colors.greyBackground,
        borderColor: colors.border,
      }}>
      <TouchableOpacity onPress={handleFullScreen} activeOpacity={0.8}>
        <View style={styles.videoContainer} pointerEvents="none">
          <TheoMediaPlayer
            isLiveStream={!!mediaData.isLiveStream}
            mediaType={mediaData.mediaType}
            poster={mediaData.poster}
            title={mediaData.title}
            streamUri={mediaData.uri!}
            startTime={mediaData.startTime}
            tracks={mediaData.tracks}
            autoStart={true}
            isMini={true}
            controls={false}
            onEnded={close}
            onPlayerReadyCallback={(player) => {
              playerRef.current = player;
            }}
          />
        </View>
      </TouchableOpacity>
      <View style={{flex: 1, gap: 4}}>
        <Text
          style={{color: colors.darkIcon, fontSize: 13, width: '100%'}}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {mediaData.title}
        </Text>
      </View>
      <View style={{paddingHorizontal: 10, flexDirection: 'row', gap: 16, alignItems: 'center'}}>
        <TouchableDebounce onPress={close} hitSlop={12}>
          <IconClose size={14} color={colors.text} />
        </TouchableDebounce>
      </View>
    </View>
  );
};

export default MiniPlayerVideo;

const styles = StyleSheet.create({
  layout: {
    height: 56,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
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
  },
  videoContainer: {
    overflow: 'hidden',
    height: '100%',
    aspectRatio: 16 / 9,
  },
});
