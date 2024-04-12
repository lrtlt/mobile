import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {CarPlayContextType, PlayListItem} from './CarPlayContext';
import createCarPlayLiveTemplate from './carPlayLiveTemplate';
import {useMediaPlayer} from '../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../components/videoComponent/context/PlayerContext';

type ReturnType = CarPlayContextType;

const useCarPlayController = (): ReturnType => {
  const [isConnected, setIsConnected] = useState(false);
  const [template, setTemplate] = useState<ListTemplate>();
  const [currentPlaylist, setCurrentPlaylist] = useState<PlayListItem[]>([]);

  const {setPlayerData} = useMediaPlayer();

  useEffect(() => {
    if (template) {
      template.config.onItemSelect = async ({index}) => {
        console.log('useCarPlayController: onItemSelect', index);
        console.log('useCarPlayController: onItemSelect', currentPlaylist[index]);

        setPlayerData({
          uri: currentPlaylist[index].streamUrl,
          mediaType: MediaType.VIDEO,
          isLiveStream: true,
          poster: currentPlaylist[index].imgUrl,
          title: currentPlaylist[index].text,
        });
      };
      return () => {
        template.config.onItemSelect = undefined;
      };
    }
  }, [template, currentPlaylist]);

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

  return {
    isConnected: isConnected,
    setPlaylist,
    playlist: currentPlaylist,
  };
};

export default useCarPlayController;
