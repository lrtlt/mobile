import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import useOrientation from '../../../util/useOrientation';
import {MediaType, VideoBaseData, VideoContext} from './VideoContext';
import Animated, {FadeOut, SlideInDown} from 'react-native-reanimated';

export type FullScreenListener = {
  onFullScreenEnter: () => void;
  onFullScreenExit: () => void;
};

const VideoProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [videoBaseData, setVideoBaseData] = useState<VideoBaseData>({mediaType: MediaType.VIDEO});
  const [playlist, setPlaylist] = useState<VideoBaseData[]>([]);

  const orientation = useOrientation();
  const currentTimeRef = useRef(0);

  const handleSetCurrentTime = useCallback((time: number) => {
    currentTimeRef.current = time;
  }, []);

  const handleGetCurrentTime = useCallback(() => currentTimeRef.current, []);

  const renderMiniPlayer = useCallback(() => {
    const {uri, mediaType, poster, title, isLiveStream} = videoBaseData;
    if (!uri) {
      console.log('Cannot render full screen player URI is empty!');
      return null;
    }
    return (
      <Animated.View style={styles.root} entering={SlideInDown.duration(300)} exiting={FadeOut.duration(250)}>
        <View
          style={orientation === 'portrait' ? styles.videoContainerPortrait : styles.videoContainerLandscape}>
          {/* TheoMediaPlayer is a custom component */}
        </View>
      </Animated.View>
    );
  }, [orientation, videoBaseData]);

  const handleClose = useCallback(() => {
    setPlaylist([]);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        ...videoBaseData,
        setVideoBaseData,
        getCurrentTime: handleGetCurrentTime,
        setCurrentTime: handleSetCurrentTime,
        close: handleClose,
      }}>
      {props.children}
      {playlist.length > 0 ? renderMiniPlayer() : null}
    </VideoContext.Provider>
  );
};

export default VideoProvider;

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainerPortrait: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'red',
  },
  videoContainerLandscape: {
    height: '100%',
    aspectRatio: 16 / 9,
  },
});
