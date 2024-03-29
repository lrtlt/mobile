import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import useOrientation from '../../../util/useOrientation';
import {MediaType, VideoBaseData, VideoContext} from './VideoContext';
import Animated, {FadeOut, SlideInDown} from 'react-native-reanimated';
import {PlayerMode} from '../PlayerMode';
import TheoMediaPlayer from '../TheoMediaPlayer';

export type FullScreenListener = {
  onFullScreenEnter: () => void;
  onFullScreenExit: () => void;
};

const VideoProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [videoBaseData, setVideoBaseData] = useState<VideoBaseData>({mediaType: MediaType.VIDEO});
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(true);

  const orientation = useOrientation();

  const currentTimeRef = useRef(0);
  const fullScreenListeners = useRef<Record<string, FullScreenListener>>({});

  const registerFullScreenListener = useCallback((key: string, listener: FullScreenListener) => {
    fullScreenListeners.current[key] = listener;
  }, []);

  const unregisterFullScreenListener = useCallback((key: string) => {
    delete fullScreenListeners.current[key];
  }, []);

  const handleSetFullScreen = useCallback((fullScreen: boolean) => {
    Object.keys(fullScreenListeners.current).forEach((key) => {
      if (fullScreen) {
        fullScreenListeners.current[key]?.onFullScreenEnter();
      } else {
        fullScreenListeners.current[key]?.onFullScreenExit();
      }
    });
    setIsFullScreen(fullScreen);
  }, []);

  const handleSetCurrentTime = useCallback((time: number) => {
    currentTimeRef.current = time;
  }, []);

  const handleGetCurrentTime = useCallback(() => currentTimeRef.current, []);

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullScreen) {
        handleSetFullScreen(false);
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [handleSetFullScreen, isFullScreen]);

  const renderFullScreenPlayer = useCallback(() => {
    const {uri, mediaType, poster, title, isLiveStream} = videoBaseData;
    if (!uri) {
      console.log('Cannot render full screen player URI is empty!');
      return null;
    }
    return (
      <Animated.View style={styles.root} entering={SlideInDown.duration(300)} exiting={FadeOut.duration(250)}>
        <StatusBar hidden={isFullScreen} />
        <View
          style={orientation === 'portrait' ? styles.videoContainerPortrait : styles.videoContainerLandscape}>
          <TheoMediaPlayer
            streamUri={uri}
            mode={PlayerMode.FULLSCREEN}
            mediaType={mediaType}
            poster={poster}
            title={title}
            autoStart={!isPausedByUser}
            isLiveStream={Boolean(isLiveStream)}
            startTime={isLiveStream ? undefined : currentTimeRef.current / 1000}
          />
        </View>
      </Animated.View>
    );
  }, [isFullScreen, isPausedByUser, orientation, videoBaseData]);

  return (
    <VideoContext.Provider
      value={{
        ...videoBaseData,
        isFullScreen,
        isPausedByUser,
        isMuted,
        setVideoBaseData,
        setIsMuted,
        setIsPausedByUser,
        getCurrentTime: handleGetCurrentTime,
        setCurrentTime: handleSetCurrentTime,
        setIsFullScreen: handleSetFullScreen,
        registerFullScreenListener,
        unregisterFullScreenListener,
      }}>
      {props.children}
      {isFullScreen === true ? renderFullScreenPlayer() : null}
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
  },
  videoContainerLandscape: {
    height: '100%',
    aspectRatio: 16 / 9,
  },
});
