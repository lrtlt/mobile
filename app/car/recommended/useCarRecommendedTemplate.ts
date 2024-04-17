import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {carPlayRecommendedTemplate} from './createPlayRecommendedTemplate';
import useCarPlayRecommendedPlaylist from './useCarRecommendedPlaylist';
import {carPlayNowPlayingTemplate} from '../nowPlaying/createNowPlayingTemplate';

const useCarRecommendedTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayRecommendedTemplate);

  const {channels, reload} = useCarPlayRecommendedPlaylist(isConnected);

  const {setPlayerData} = useMediaPlayer();

  useEffect(() => {
    console.log('updating Recommended template');
    template.updateSections([
      {
        items: channels.map((item) => ({
          text: item.text,
          detailText: item.detailText,
          imgUrl: item.imgUrl as any,
        })),
      },
    ]);
    template.config.onItemSelect = async ({index}) => {
      const item = channels[index];

      setPlayerData({
        uri: item.streamUrl,
        mediaType: MediaType.AUDIO,
        isLiveStream: true,
        poster: item.imgUrl,
        title: item.text,
      });

      CarPlay.enableNowPlaying(true);
      CarPlay.pushTemplate(carPlayNowPlayingTemplate);
    };
    return () => {
      template.config.onItemSelect = undefined;
    };
  }, [channels]);

  useEffect(() => {
    if (template) {
      template.config.onBarButtonPressed = async ({id}) => {
        if (id === 'reload') {
          console.log('reloading live template');
          reload();
        }
      };
      return () => {
        template.config.onBarButtonPressed = undefined;
      };
    }
  }, [template, reload]);

  return template;
};

export default useCarRecommendedTemplate;
