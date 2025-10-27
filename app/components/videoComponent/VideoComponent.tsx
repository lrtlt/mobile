import React, {useCallback, useRef, PropsWithChildren, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import VideoCover, {VideoCoverType} from './VideoCover';
import {useTheme} from '../../Theme';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import TextComponent from '../text/Text';
import {RectButton} from 'react-native-gesture-handler';
import TheoMediaPlayer from './TheoMediaPlayer';
import {MediaType} from './context/PlayerContext';
import useUserMediaEvents from './useUserMediaEvents';
import {StreamData, useStreamInfo} from '../../api/hooks/useStream';

interface Props {
  style?: ViewStyle;
  cover?: VideoCoverType;
  backgroundImage?: string;
  streamUrl: string;
  mediaId?: string;
  title: string;
  autoPlay: boolean;
  loop?: boolean;
  showTitle?: boolean;
  startTime?: number;
  streamData?: StreamData;
  minifyEnabled?: boolean;
  aspectRatio?: number;
  backgroundAudioEnabled?: boolean;
  onEnded?: () => void;
}

const MAX_ERROR_COUNT = 2;
const ERROR_DELAY = 1000;

const VideoComponent: React.FC<PropsWithChildren<Props>> = ({
  style,
  cover,
  backgroundImage,
  streamUrl,
  mediaId,
  title,
  autoPlay = true,
  loop = false,
  showTitle = true,
  startTime,
  streamData,
  minifyEnabled = true,
  backgroundAudioEnabled = true,
  aspectRatio,
  onEnded,
}) => {
  const [userPlayPressed, setUserPlayPressed] = useState(autoPlay);
  const {colors, strings} = useTheme();

  const {data, isLoading, isError, refetch} = useStreamInfo({
    streamUrl: !streamData && userPlayPressed ? streamUrl : undefined,
    title,
    initialData: streamData,
  });
  const {sendMediaPlayEvent} = useUserMediaEvents(mediaId);

  const errorCountRef = useRef(0);

  const onPlayPress = useCallback(() => {
    setUserPlayPressed(true);
    sendMediaPlayEvent();
  }, [streamUrl, title, mediaId]);

  const onPlayerError = useCallback(
    (e: any) => {
      console.log('Error:', e);
      setTimeout(() => {
        if (errorCountRef.current < MAX_ERROR_COUNT) {
          errorCountRef.current = errorCountRef.current + 1;
          console.log('Video error count:', errorCountRef.current);
          refetch();
        } else {
          console.log('Max error count reached!');
        }
      }, errorCountRef.current * ERROR_DELAY);
    },
    [refetch, streamUrl, title],
  );

  if (isError || errorCountRef.current >= MAX_ERROR_COUNT) {
    return (
      <View style={{...style}}>
        <View style={styles.loaderContainer}>
          <TextComponent type="error" style={styles.errorText}>
            {strings.liveChanelError}
          </TextComponent>
          <RectButton
            style={{...styles.button, borderColor: colors.textError}}
            onPress={() => {
              errorCountRef.current = 0;
              refetch();
            }}>
            <TextComponent style={{color: colors.onPrimary}}>{strings.tryAgain}</TextComponent>
          </RectButton>
        </View>
      </View>
    );
  }

  if (!data) {
    if (isLoading) {
      return (
        <View style={style}>
          <View style={{...styles.loaderContainer}}>
            <ActivityIndicator size="small" animating={isLoading} color={colors.primary} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={style}>
          <TouchableDebounce onPress={onPlayPress}>
            <VideoCover {...cover} aspectRatio={aspectRatio} />
          </TouchableDebounce>
        </View>
      );
    }
  }

  return (
    <View key={data.streamUri} style={style}>
      <TheoMediaPlayer
        streamUri={data.streamUri}
        title={showTitle ? data.title : undefined}
        autoStart={true}
        loop={loop}
        isLiveStream={data.isLiveStream}
        startTime={data.isLiveStream ? undefined : startTime || data.offset}
        poster={backgroundImage ?? data.poster}
        tracks={data.tracks}
        minifyEnabled={minifyEnabled}
        aspectRatio={aspectRatio}
        backgroundAudioEnabled={backgroundAudioEnabled}
        mediaType={
          data.mediaType != undefined
            ? data.mediaType
            : data.streamUri.includes('audio')
            ? MediaType.AUDIO
            : MediaType.VIDEO
        }
        onError={onPlayerError}
        onEnded={onEnded}
      />
    </View>
  );
};

export default VideoComponent;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    padding: 12,
  },
  button: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
});
