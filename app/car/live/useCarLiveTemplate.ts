import {useEffect, useState} from 'react';
import useCarLiveChannels from './useCarLiveChannels';
import {ListTemplate} from 'react-native-carplay';
import {carPlayLiveTemplate} from './createPlayLiveTemplate';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';

const useCarLiveTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayLiveTemplate);
  const {channels, reload} = useCarLiveChannels(isConnected);

  const {setPlayerData} = useMediaPlayer();

  useEffect(() => {
    console.log('updating live template');
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
        mediaType: MediaType.VIDEO,
        isLiveStream: true,
        poster: item.imgUrl,
        title: item.text,
      });
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

export default useCarLiveTemplate;
