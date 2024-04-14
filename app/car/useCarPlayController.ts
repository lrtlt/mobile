import {useEffect, useMemo, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {CarPlayContextType, PlayListItem} from './CarPlayContext';
import createCarPlayLiveTemplate from './live/carPlayLiveTemplate';
import {useMediaPlayer} from '../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../components/videoComponent/context/PlayerContext';
import createCarPlayRootTemplate from './root/carPlayRootTemplate';
import useCarPlayRootTemplate from './root/useCarPlayRootTemplate';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setIsConnected] = useState(false);
  // const [template, setTemplate] = useState<ListTemplate>();
  const [currentPlaylist, setCurrentPlaylist] = useState<PlayListItem[]>([]);

  const {setPlayerData} = useMediaPlayer();

  const rootTemplate = useCarPlayRootTemplate();

  const liveTemplate =
    // useEffect(() => {
    //   if (template) {
    // template.config.onItemSelect = async ({index}) => {
    //   console.log('useCarPlayController: onItemSelect', index);
    //   console.log('useCarPlayController: onItemSelect', currentPlaylist[index]);
    //   setPlayerData({
    //     uri: currentPlaylist[index].streamUrl,
    //     mediaType: MediaType.VIDEO,
    //     isLiveStream: true,
    //     poster: currentPlaylist[index].imgUrl,
    //     title: currentPlaylist[index].text,
    //   });
    // };
    // return () => {
    //   template.config.onItemSelect = undefined;
    // };
    //   }
    // }, [template, currentPlaylist]);

    useEffect(() => {
      if (rootTemplate) {
        CarPlay.setRootTemplate(rootTemplate);
      }
    }, [rootTemplate]);

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
  }, [rootTemplate]);

  const setPlaylist = (playlist: PlayListItem[]) => {
    console.log('setPlaylist', playlist);
    if (CarPlay.connected) {
      setCurrentPlaylist(playlist);
      // const template = createCarPlayRootTemplate();
      // CarPlay.setRootTemplate(template);
      // setTemplate(template);
    } else {
      console.log('setPlaylist', 'not connected');
    }
  };

  return {
    isConnected: isConnected,
    setPlaylist,
    playlist: currentPlaylist,
  };
};

export default useCarPlayController;
