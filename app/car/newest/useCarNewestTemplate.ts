import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay/src';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {carPlayNewestTemplate} from './createPlayNewestTemplate';
import useCarPlayNewestPlaylist from './useCarNewestPlaylist';
import {carPlayNowPlayingTemplate} from '../nowPlaying/createNowPlayingTemplate';

const useCarNewestTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayNewestTemplate);

  const {channels, reload} = useCarPlayNewestPlaylist(isConnected);

  const {setPlaylist} = useMediaPlayer();

  useEffect(() => {
    console.log('updating newest template');
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
      setPlaylist(
        channels.map((item) => ({
          uri: item.streamUrl,
          mediaType: MediaType.AUDIO,
          isLiveStream: false,
          poster: item.imgUrl,
          title: item.text,
        })),
        index,
      );
      CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
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

export default useCarNewestTemplate;
