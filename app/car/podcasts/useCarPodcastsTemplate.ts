import {useEffect, useState} from 'react';
import {ListTemplate} from 'react-native-carplay';
import {carPlayPodcastsTemplate} from './createPlayPodcastsTemplate';
import useCarPlayPodcastsPlaylist from './useCarPodcastsPlaylist';
import {ListSection} from 'react-native-carplay/lib/interfaces/ListSection';

const useCarPodcastsTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayPodcastsTemplate);

  const {podcasts, reload} = useCarPlayPodcastsPlaylist(isConnected);

  useEffect(() => {
    console.log('updating podcasts template');
    const sections = podcasts.reduce<{
      [key: string]: {title: string}[];
    }>((acc, item) => {
      let firstLetter = item.title.charAt(0).toUpperCase();

      if (firstLetter.match(/[0-9]/) !== null) {
        firstLetter = '0-9';
      }

      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {});

    const listSections: ListSection[] = Object.entries(sections).map(([letter, items]) => ({
      header: letter,
      title: letter,
      sectionIndexTitle: letter,
      items: items.map((item) => ({
        text: item.title,
      })),
    }));

    template.updateSections(listSections);

    template.config.onItemSelect = async ({index}) => {
      const podcast = podcasts[index];
      console.log('Podcast selected', podcast);
      // CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
    };
    return () => {
      template.config.onItemSelect = undefined;
    };
  }, [podcasts]);

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

export default useCarPodcastsTemplate;
