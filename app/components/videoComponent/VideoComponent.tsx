import React, {useEffect, useCallback} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import VideoCover, {VideoCoverType} from './VideoCover';
import JWPlayerNative from './JWPlayerNative';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import useVideoData from './useVideoData';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface Props {
  style?: ViewStyle;
  cover?: VideoCoverType;
  backgroundImage?: string;
  streamUrl: string;
  title: string;
  isAudioOnly: boolean;
  autoPlay: boolean;
  startTime?: number;
}

const VideoComponent: React.FC<Props> = (props) => {
  const {colors} = useTheme();
  const {isLoading, data, load} = useVideoData();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  let content;

  if (data) {
    content = (
      <JWPlayerNative
        style={props.style}
        mediaId={data.mediaId}
        streamUri={data.streamUri}
        title={data.title}
        autoStart={true}
        backgroundImage={props.backgroundImage}
        startTime={props.startTime}
      />
    );
  } else if (isLoading) {
    content = (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" animating={isLoading} color={colors.primary} />
      </View>
    );
  } else {
    content = (
      <TouchableDebounce onPress={onPlayPress}>
        <VideoCover {...props.cover} />
      </TouchableDebounce>
    );
  }

  return <View style={props.style}>{content}</View>;
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
});
