import {useEffect, useState} from 'react';
import {CarPlay} from 'react-native-carplay';
import {CarPlayContextType} from './CarPlayContext';
import useCarPlayRootTemplate from './root/useCarPlayRootTemplate';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';
import TrackPlayer from 'react-native-track-player';
import useTrackPlayerSetup from './useTrackPlayerSetup';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setIsConnected] = useState(CarPlay.connected);

  // Setup TrackPlayer
  useTrackPlayerSetup();

  const rootTemplate = useCarPlayRootTemplate(isConnected);

  useEffect(() => {
    if (isConnected) {
      CarPlay.setRootTemplate(rootTemplate);
      CarPlay.enableNowPlaying(true);
    } else {
      TrackPlayer.reset();
    }
  }, [isConnected]);

  useEffect(() => {
    CarPlay.emitter.addListener('didConnect', () => {
      console.log('useCarPlayController: CarPlay connected');
      Gemius.sendPageViewedEvent('carplay_connected');
      analytics().logEvent('carplay_connected');
      setIsConnected(true);
    });

    CarPlay.emitter.addListener('didDisconnect', () => {
      console.log('useCarPlayController: CarPlay disconnected');
      Gemius.sendPageViewedEvent('carplay_disconnected');
      analytics().logEvent('carplay_disconnected');
      setIsConnected(false);
    });
    CarPlay.emitter.addListener('backButtonPressed', () => {
      console.log('useCarPlayController: back button pressed');
      CarPlay.popTemplate();
    });

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
