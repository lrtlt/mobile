import {useCallback, useEffect, useMemo, useState} from 'react';
import {CarPlay, OnConnectCallback, OnDisconnectCallback, ListTemplate} from 'react-native-carplay';
import {CarPlayContextType} from './CarPlayContext';
import createCarListTemplate from './carListTemplate';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setConnected] = useState(false);

  // const onConnectHandler: OnConnectCallback = useCallback(
  //   (windowInfo) => {
  //     console.log('CarPlay connected', windowInfo);
  //     setConnected(true);

  //     setTimeout(() => {
  //       // CarPlay.enableNowPlaying(true);
  //       // CarPlay.bridge.reload();
  //       CarPlay.setRootTemplate(createTemplate());
  //     }, 1000);
  //   },
  //   [createTemplate],
  // );

  // const onDisconnectHandler: OnDisconnectCallback = useCallback(() => {
  //   console.log('CarPlay disconnected');
  //   setConnected(false);
  //   CarPlay.dismissTemplate();
  // }, []);

  // useEffect(() => {
  //   CarPlay.registerOnConnect(onConnectHandler);
  //   const subscription = CarPlay.emitter.addListener('myListener', (event) => {
  //     console.log(event);
  //   });
  //   return () => {
  //     CarPlay.unregisterOnConnect(onConnectHandler);
  //     subscription.remove();
  //   };
  // }, [onConnectHandler]);

  useEffect(() => {
    if (isConnected) {
      CarPlay.bridge.reload();
      console.log('useCarPlayController: settings root template');
      CarPlay.setRootTemplate(createCarListTemplate());
    } else {
      console.log('useCarPlayController: not connected');
    }
  }, [isConnected]);

  useEffect(() => {
    CarPlay.emitter.addListener('didConnect', () => {
      console.log('useCarPlayController: Android Auto connected');

      if (CarPlay.connected) {
        console.log('useCarPlayController: Android Auto connected for real');
        setConnected(true);
      }
    });
    CarPlay.emitter.addListener('backButtonPressed', () => {
      console.log('useCarPlayController: Android Auto back button pressed');
      CarPlay.popTemplate();
    });

    CarPlay.emitter.addListener('didSelectListItem', (event) => {
      console.log(event);
    });

    return () => {
      CarPlay.emitter.removeAllListeners('didConnect');
      CarPlay.emitter.removeAllListeners('backButtonPressed');
      CarPlay.emitter.removeAllListeners('didSelectListItem');
    };
  }, []);

  // useEffect(() => {
  //   CarPlay.registerOnDisconnect(onDisconnectHandler);
  //   return () => CarPlay.unregisterOnDisconnect(onDisconnectHandler);
  // }, [onDisconnectHandler]);

  return {
    isConnected: isConnected,
  };
};

export default useCarPlayController;
