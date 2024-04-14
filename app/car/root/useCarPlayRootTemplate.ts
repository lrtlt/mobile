import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import createCarPlayRootTemplate from './carPlayRootTemplate';
import useCarLiveTemplate from '../live/useCarLiveTemplate';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';

const useCarPlayRootTemplate = () => {
  const [template, setTemplate] = useState<ListTemplate>();

  const {setPlayerData} = useMediaPlayer();

  const liveTemplate = useCarLiveTemplate((item) => {
    setPlayerData({
      uri: item.streamUrl,
      mediaType: MediaType.VIDEO,
      isLiveStream: true,
      poster: item.imgUrl,
      title: item.text,
    });
  });

  useEffect(() => {
    setTemplate(
      createCarPlayRootTemplate({
        openLiveChannels: () => {
          console.log('useCarPlayController: openLiveChannels');
          if (liveTemplate) CarPlay.pushTemplate(liveTemplate);
        },
        openNewest: () => {
          console.log('useCarPlayController: openNewest');
          if (liveTemplate) CarPlay.pushTemplate(liveTemplate);
        },
      }),
    );
  }, [liveTemplate]);

  return template;
};

export default useCarPlayRootTemplate;
