import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import useOrientation from '../../../util/useOrientation';
import MediaPlayerWithControls from '../MediaPlayerWithControls';
import {VideoBaseData, VideoContext} from './VideoContext';

export type FullScreenListener = {
  onFullScreenEnter: () => void;
  onFullScreenExit: () => void;
};

const VideoProvider: React.FC = (props) => {
  const [videoBaseData, setVideoBaseData] = useState<VideoBaseData>({});
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

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
        fullScreenListeners.current[key].onFullScreenEnter();
      } else {
        fullScreenListeners.current[key].onFullScreenExit();
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
    const {uri, poster, title} = videoBaseData;
    if (!uri) {
      console.log('Cannot render full screen player URI is empty!');
      return null;
    }
    return (
      <View style={styles.root}>
        <StatusBar hidden={isFullScreen} />
        <View
          style={orientation === 'portrait' ? styles.videoContainerPortrait : styles.videoContainerLandscape}>
          <MediaPlayerWithControls
            mode="playerFullscreen"
            uri={uri}
            poster={poster}
            title={title}
            autostart={true}
            startTime={currentTimeRef.current}
          />
        </View>
      </View>
    );
  }, [isFullScreen, orientation, videoBaseData]);

  return (
    <VideoContext.Provider
      value={{
        ...videoBaseData,
        isFullScreen,
        setVideoBaseData,
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
  flex: {
    flex: 1,
  },

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
