import React, {useEffect, useCallback, useRef} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import VideoCover, {VideoCoverType} from './VideoCover';
import JWPlayerNative from './JWPlayerNative';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import useVideoData from './useVideoData';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import TextComponent from '../text/Text';
import {RectButton} from 'react-native-gesture-handler';

interface Props {
  style?: ViewStyle;
  cover?: VideoCoverType;
  backgroundImage?: string;
  streamUrl: string;
  title: string;
  autoPlay: boolean;
  startTime?: number;
}

const MAX_ERROR_COUNT = 3;
const ERROR_DELAY = 300;

const VideoComponent: React.FC<Props> = (props) => {
  const {colors, strings} = useTheme();
  const {isLoading, data, load} = useVideoData();

  const errorCountRef = useRef(0);

  useEffect(() => {
    if (data) {
      Gemius.setProgramData(data.mediaId, data.title, 0, true);
    }
  }, [data]);

  useEffect(() => {
    if (props.autoPlay) {
      load(props.streamUrl, props.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayPress = useCallback(() => {
    load(props.streamUrl, props.title);
  }, [load, props.streamUrl, props.title]);

  const onPlayerError = useCallback(() => {
    setTimeout(() => {
      if (errorCountRef.current < MAX_ERROR_COUNT) {
        errorCountRef.current = errorCountRef.current + 1;
        console.log('Video error count:', errorCountRef.current);
        load(props.streamUrl, props.title);
      } else {
        console.log('Max error count reached!');
      }
    }, errorCountRef.current * ERROR_DELAY);
  }, [load, props.streamUrl, props.title]);

  if (errorCountRef.current >= MAX_ERROR_COUNT) {
    return (
      <View style={{...props.style}}>
        <View style={styles.loaderContainer}>
          <TextComponent type="error" style={styles.errorText}>
            {strings.liveChanelError}
          </TextComponent>
          <RectButton
            style={{...styles.button, borderColor: colors.textError}}
            onPress={() => {
              errorCountRef.current = 0;
              load(props.streamUrl, props.title);
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
        <View style={props.style}>
          <View style={{...styles.loaderContainer}}>
            <ActivityIndicator size="small" animating={isLoading} color={colors.primary} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={props.style}>
          <TouchableDebounce onPress={onPlayPress}>
            <VideoCover {...props.cover} />
          </TouchableDebounce>
        </View>
      );
    }
  }

  return (
    <View style={props.style}>
      <JWPlayerNative
        key={data.streamUri}
        style={props.style}
        mediaId={data.mediaId}
        streamUri={data.streamUri}
        title={data.title}
        autoStart={true}
        backgroundImage={props.backgroundImage}
        startTime={props.startTime || data.offset}
        onError={onPlayerError}
      />
    </View>
  );
};

VideoComponent.defaultProps = {
  autoPlay: true,
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
