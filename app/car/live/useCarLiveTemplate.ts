import {useEffect, useState} from 'react';
import useCarLiveChannels from './useCarLiveChannels';
import {ListTemplate} from 'react-native-carplay';
import createCarPlayLiveTemplate from './carPlayLiveTemplate';
import {PlayListItem} from '../CarPlayContext';

const useCarLiveTemplate = (onItemSelect: (item: PlayListItem) => void) => {
  const [template, setTemplate] = useState<ListTemplate>();
  const {channels, reload} = useCarLiveChannels(true);

  useEffect(() => {
    if (channels.length > 0) {
      if (!template) {
        console.log('creating new live template');
        setTemplate(createCarPlayLiveTemplate(channels, onItemSelect));
      } else {
        console.log('updating live template');
        template.config.sections[0].items = channels.map((item) => ({
          text: item.text,
          detailText: item.detailText,
          imgUrl: item.imgUrl as any,
        }));
      }
    }
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
