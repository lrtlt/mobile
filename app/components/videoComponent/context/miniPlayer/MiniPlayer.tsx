import {useCallback, useEffect, useState} from 'react';
import {PlayerEventType, PresentationMode, THEOplayer} from 'react-native-theoplayer';
import {useTheme} from '../../../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import TheoMediaPlayer from '../../TheoMediaPlayer';
import TouchableDebounce from '../../../touchableDebounce/TouchableDebounce';
import {
  IconPlayerClose,
  IconPlayerForward,
  IconPlayerNext,
  IconPlayerPauseV2,
  IconPlayerPlayV2,
  IconPlayerPrevious,
  IconPlayerRewind,
} from '../../../svg';
import {useMediaPlayer} from '../useMediaPlayer';
import PlayerSekBar from './PlayerSeekBar';
import {MediaType} from '../PlayerContext';
import {Pressable} from 'react-native-gesture-handler';
import PlayerPlaybackRatio from './PlayerPlaybackRatio';

const PLAYER_HEIGHT = 80;
const PADDING = 8;
const BORDER_RADIUS = 8;

interface Props {
  onEnded: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MiniPlayerAudio: React.FC<React.PropsWithChildren<Props>> = ({onEnded, onNext, onPrevious}) => {
  const [player, setPlayer] = useState<THEOplayer>();
  const [isPlaying, setPlaying] = useState(false);

  const {mediaData, close} = useMediaPlayer();
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    if (player) {
      const onPlay = () => {
        setPlaying(true);
      };

      const onPause = () => {
        setPlaying(false);
      };

      player.addEventListener(PlayerEventType.PLAY, onPlay);
      player.addEventListener(PlayerEventType.PAUSE, onPause);
      return () => {
        player.removeEventListener(PlayerEventType.PLAY, onPlay);
        player.removeEventListener(PlayerEventType.PAUSE, onPause);
      };
    }
  }, [player]);

  const handlePlayPause = useCallback(() => {
    if (player) {
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [player]);

  const handleSeekBy = useCallback(
    (seconds: number) => {
      if (player) {
        const newTime = player.currentTime + seconds * 1000;
        player.currentTime = newTime;
      }
    },
    [player],
  );

  const handleFullScreen = useCallback(() => {
    if (player) {
      player.presentationMode = PresentationMode.fullscreen;
    }
  }, [player]);

  if (!mediaData) {
    return null;
  }

  const playerAspectRatio = mediaData.mediaType === MediaType.AUDIO ? 1 : 16 / 9;

  return (
    <View
      style={{
        marginHorizontal: PADDING + 4,
        marginVertical: PADDING,
      }}>
      <View
        style={{
          ...styles.layout,
          marginBottom: bottom,
          backgroundColor: 'white',
          borderRadius: BORDER_RADIUS,
          padding: PADDING,
          gap: PADDING,
          borderColor: colors.border,
        }}>
        <View
          style={[
            styles.videoContainer,
            {
              aspectRatio: playerAspectRatio,
            },
          ]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleFullScreen}>
            <TheoMediaPlayer
              key={mediaData.uri}
              isLiveStream={!!mediaData.isLiveStream}
              mediaType={mediaData.mediaType}
              poster={mediaData.poster}
              title={mediaData.title}
              streamUri={mediaData.uri}
              startTime={mediaData.startTime}
              tracks={mediaData.tracks}
              autoStart={true}
              isMini={true}
              aspectRatio={playerAspectRatio}
              controls={false}
              onEnded={onEnded}
              onPlayerReadyCallback={setPlayer}
            />
          </Pressable>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingHorizontal: PADDING}}>
          <View style={{flex: 1, maxWidth: 340}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableDebounce onPress={onPrevious} hitSlop={12}>
                <IconPlayerPrevious size={22} color={colors.darkIcon + (onPrevious ? '' : '33')} />
              </TouchableDebounce>
              <TouchableDebounce onPress={() => handleSeekBy(-10)} hitSlop={12}>
                <IconPlayerRewind size={22} color={colors.darkIcon} />
              </TouchableDebounce>
              <TouchableDebounce onPress={handlePlayPause} hitSlop={12}>
                {isPlaying ? (
                  <IconPlayerPauseV2 size={22} color={colors.playerIcons} />
                ) : (
                  <IconPlayerPlayV2 size={22} color={colors.playerIcons} />
                )}
              </TouchableDebounce>
              <TouchableDebounce onPress={() => handleSeekBy(10)} hitSlop={12}>
                <IconPlayerForward size={22} color={colors.darkIcon} />
              </TouchableDebounce>
              <TouchableDebounce onPress={onNext} hitSlop={12}>
                <IconPlayerNext size={22} color={colors.darkIcon + (onNext ? '' : '33')} />
              </TouchableDebounce>
            </View>
            {player ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 4,
                }}>
                <PlayerSekBar style={{width: '100%'}} player={player} />
                {mediaData?.isLiveStream ? null : <PlayerPlaybackRatio player={player} />}
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View style={{...styles.closeButttonContainer, borderColor: colors.border}}>
        <TouchableDebounce onPress={close} hitSlop={12}>
          <IconPlayerClose size={18} color={colors.darkIcon} />
        </TouchableDebounce>
      </View>
    </View>
  );
};

export default MiniPlayerAudio;

const styles = StyleSheet.create({
  layout: {
    height: PLAYER_HEIGHT,
    flexDirection: 'row',
    paddingEnd: PADDING,
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  videoContainer: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
    height: PLAYER_HEIGHT - PADDING * 2,
    aspectRatio: 1,
  },
  closeButttonContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: -8,
    left: -8,
    zIndex: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
