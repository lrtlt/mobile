import React, {useEffect, useCallback} from 'react';
import {View, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import VideoCover, {VideoCoverType} from './VideoCover';
import JWPlayerNative from './JWPlayerNative';
import Gemius from 'react-native-gemius-plugin';
import {useTheme} from '../../Theme';
import useVideoData from './useVideoData';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useMemo} from 'react';

interface Props {
  style?: ViewStyle;
  cover?: VideoCoverType;
  backgroundImage?: string;
  streamUrl: string;
  title: string;
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

  const content = useMemo(() => {
    if (data) {
      return (
        <JWPlayerNative
          style={props.style}
          mediaId={data.mediaId}
          streamUri={data.streamUri}
          title={data.title}
          autoStart={true}
          backgroundImage={props.backgroundImage}
          startTime={props.startTime || data.offset}
        />
      );
    } else if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" animating={isLoading} color={colors.primary} />
        </View>
      );
    } else {
      return (
        <TouchableDebounce onPress={onPlayPress}>
          <VideoCover {...props.cover} />
        </TouchableDebounce>
      );
    }
  }, [
    colors.primary,
    data,
    isLoading,
    onPlayPress,
    props.backgroundImage,
    props.cover,
    props.startTime,
    props.style,
  ]);

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
