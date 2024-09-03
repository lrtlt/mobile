import React, {useEffect, useCallback, useRef, PropsWithChildren} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import VideoCover, {VideoCoverType} from './VideoCover';
import {useTheme} from '../../Theme';
import useStreamData, {StreamData} from './useStreamData';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import TextComponent from '../text/Text';
import {RectButton} from 'react-native-gesture-handler';
import TheoMediaPlayer from './TheoMediaPlayer';
import {MediaType} from './context/PlayerContext';

interface Props {
  style?: ViewStyle;
  cover?: VideoCoverType;
  backgroundImage?: string;
  streamUrl: string;
  title: string;
  autoPlay: boolean;
  startTime?: number;
  streamData?: StreamData;
  minifyEnabled?: boolean;
  aspectRatio?: number;
}

const MAX_ERROR_COUNT = 3;
const ERROR_DELAY = 1000;

const VideoComponent: React.FC<PropsWithChildren<Props>> = ({
  style,
  cover,
  backgroundImage,
  streamUrl,
  title,
  autoPlay = true,
  startTime,
  streamData,
  minifyEnabled = true,
  aspectRatio,
}) => {
  const {colors, strings} = useTheme();
  const {isLoading, data, load} = useStreamData(streamData);

  const errorCountRef = useRef(0);

  useEffect(() => {
    if (autoPlay && !data) {
      load(streamUrl, title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayPress = useCallback(() => {
    load(streamUrl, title);
  }, [load, streamUrl, title]);

  const onPlayerError = useCallback(
    (e: any) => {
      console.log('Error:', e);
      setTimeout(() => {
        if (errorCountRef.current < MAX_ERROR_COUNT) {
          errorCountRef.current = errorCountRef.current + 1;
          console.log('Video error count:', errorCountRef.current);
          load(streamUrl, title);
        } else {
          console.log('Max error count reached!');
        }
      }, errorCountRef.current * ERROR_DELAY);
    },
    [load, streamUrl, title],
  );

  if (errorCountRef.current >= MAX_ERROR_COUNT) {
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
              load(streamUrl, title);
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
            <VideoCover {...cover} />
          </TouchableDebounce>
        </View>
      );
    }
  }

  return (
    <View key={data.streamUri} style={style}>
      <TheoMediaPlayer
        streamUri={data.streamUri}
        title={data.title}
        autoStart={true}
        isLiveStream={data.isLiveStream}
        startTime={data.isLiveStream ? undefined : startTime || data.offset}
        poster={backgroundImage ?? data.poster}
        tracks={data.tracks}
        minifyEnabled={minifyEnabled}
        aspectRatio={aspectRatio}
        mediaType={
          data.mediaType != undefined
            ? data.mediaType
            : data.streamUri.includes('audio')
            ? MediaType.AUDIO
            : MediaType.VIDEO
        }
        onError={onPlayerError}
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
