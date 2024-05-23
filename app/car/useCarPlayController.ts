import {useEffect, useState} from 'react';
import {CarPlay} from 'react-native-carplay/src';
import {CarPlayContextType} from './CarPlayContext';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';
import TrackPlayer from 'react-native-track-player';
import useTrackPlayerSetup from './useTrackPlayerSetup';
import useCarLiveTemplate from './live/useCarLiveTemplate';
import useCarNewestTemplate from './newest/useCarNewestTemplate';
import useCarPodcastsTemplate from './podcasts/useCarPodcastsTemplate';
import useCarRecommendedTemplate from './recommended/useCarRecommendedTemplate';
import {carPlayRootTemplate} from './root/createPlayRootTemplate';
import {Platform} from 'react-native';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setIsConnected] = useState(CarPlay.connected);

  // Setup TrackPlayer
  useTrackPlayerSetup();

  useCarRecommendedTemplate(isConnected);
  // useCarLiveTemplate(isConnected);
  // useCarNewestTemplate(isConnected);
  // useCarPodcastsTemplate(isConnected);

  useEffect(() => {
    if (isConnected) {
      CarPlay.setRootTemplate(carPlayRootTemplate, false);

      if (Platform.OS === 'ios') {
        CarPlay.enableNowPlaying(true);
      }
    } else {
      TrackPlayer.reset();
    }
  }, [isConnected]);

  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log('useCarPlayController: CarPlay connected');
      Gemius.sendPageViewedEvent('carplay_connected');
      analytics().logEvent('carplay_connected');
      setIsConnected(true);
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('useCarPlayController: CarPlay disconnected');
      Gemius.sendPageViewedEvent('carplay_disconnected');
      analytics().logEvent('carplay_disconnected');
      setIsConnected(false);
    });

    CarPlay.emitter.addListener('backButtonPressed', () => {
      CarPlay.popTemplate();
    });
    CarPlay.emitter.removeAllListeners;
    return () => {
      CarPlay.emitter.removeAllListeners('didConnect');
      CarPlay.emitter.removeAllListeners('didDisconnect');
      CarPlay.emitter.removeAllListeners('backButtonPressed');
    };
  }, []);

  return {
    isConnected: isConnected,
  };
};

export default useCarPlayController;
