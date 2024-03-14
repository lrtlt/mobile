import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {CarPlayContextType, PlayListItem} from './CarPlayContext';
import createCarPlayLiveTemplate from './carPlayLiveTemplate';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setConnected] = useState(false);
  const [template, setTemplate] = useState<ListTemplate>();
  const [playlist, setCurrentPlaylist] = useState<PlayListItem[]>([]);

  useEffect(() => {
    if (template) {
      template.config.onItemSelect = async ({index}) => {
        playItem(playlist[index]);
      };
      return () => {
        template.config.onItemSelect = undefined;
      };
    }

    // CarPlay.emitter.addListener('didSelectListItem', (event) => {
    //   console.log(event);
    //   playItem(playlist[event.index]);
    // });
    // return () => {
    //   CarPlay.emitter.removeAllListeners('didSelectListItem');
    // };
  }, [playlist, template]);

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
    if (CarPlay.connected) {
      // CarPlay.bridge.reload();
      console.log('useCarPlayController: settings root template');
      // CarPlay.setRootTemplate(createCarListTemplate());
    } else {
      console.log('useCarPlayController: not connected');
    }
  }, [isConnected]);

  useEffect(() => {
    CarPlay.emitter.addListener('didConnect', () => {
      console.log('useCarPlayController: Android Auto connected');

      if (CarPlay.connected) {
        console.log('useCarPlayController: auto connected for real');
        setConnected(true);
      }
    });
    CarPlay.emitter.addListener('backButtonPressed', () => {
      console.log('useCarPlayController: auto back button pressed');
      CarPlay.popTemplate();
    });

    return () => {
      CarPlay.emitter.removeAllListeners('didConnect');
      CarPlay.emitter.removeAllListeners('backButtonPressed');
    };
  }, []);

  const playItem = (item: PlayListItem) => {
    if (CarPlay.connected) {
      const newPlayList = playlist.map((i) => ({...i, isPlaying: i.id === item.id}));
      setCurrentPlaylist(newPlayList);

      // const template = createCarPlayLiveTemplate(newPlayList);
      // CarPlay.setRootTemplate(template);
      // setTemplate(template);

      template?.updateSections([
        {
          items: newPlayList.map((i) => ({
            text: i.text,
            detailText: i.detailText,
            imgUrl: i.imgUrl as any,
            isPlaying: i.isPlaying,
          })),
        },
      ]);

      // template?.updateListTemplateItem({
      //   sectionIndex: 0,
      //   itemIndex: newPlayList.findIndex((i) => i.id === item.id),
      //   text: item.text,
      //   imgUrl: item.imgUrl as any,
      //   detailText: item.detailText,
      //   isPlaying: true,
      // });
    } else {
      console.log('playItem', 'not connected');
    }
  };

  const setPlaylist = (playlist: PlayListItem[]) => {
    console.log('setPlaylist', playlist);
    if (CarPlay.connected) {
      setCurrentPlaylist(playlist);
      const template = createCarPlayLiveTemplate(playlist);
      CarPlay.setRootTemplate(template);
      setTemplate(template);
    } else {
      console.log('setPlaylist', 'not connected');
    }
  };

  // useEffect(() => {
  //   CarPlay.registerOnDisconnect(onDisconnectHandler);
  //   return () => CarPlay.unregisterOnDisconnect(onDisconnectHandler);
  // }, [onDisconnectHandler]);

  return {
    isConnected: isConnected,
    setPlaylist,
    playlist,
    playItem,
  };
};

export default useCarPlayController;
