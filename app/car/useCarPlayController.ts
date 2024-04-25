import {useEffect, useState} from 'react';
import {CarPlay} from 'react-native-carplay';
import {CarPlayContextType} from './CarPlayContext';
import useCarPlayRootTemplate from './root/useCarPlayRootTemplate';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setIsConnected] = useState(false);

  const rootTemplate = useCarPlayRootTemplate(isConnected);

  useEffect(() => {
    if (isConnected) {
      CarPlay.setRootTemplate(rootTemplate);
      CarPlay.enableNowPlaying(true);
    }
  }, [isConnected]);

  useEffect(() => {
    CarPlay.emitter.addListener('didConnect', () => {
      console.log('useCarPlayController: CarPlay connected');
      setIsConnected(true);
    });

    CarPlay.emitter.addListener('didDisconnect', () => {
      console.log('useCarPlayController: CarPlay disconnected');
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
