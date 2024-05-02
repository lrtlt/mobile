import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {carPlayPodcastsTemplate} from './createPlayPodcastsTemplate';
import useCarPlayPodcastsPlaylist from './useCarPodcastsPlaylist';
import {ListSection} from 'react-native-carplay/lib/interfaces/ListSection';
import {CarPlayPodcastItem} from '../../api/Types';
import useCarCategoryTemplate from '../category/useCarCategoryTemplate';

const useCarPodcastsTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayPodcastsTemplate);
  const [selectedPodcast, setSelectedPodcast] = useState<CarPlayPodcastItem | undefined>(undefined);

  const {podcasts, reload} = useCarPlayPodcastsPlaylist(isConnected);

  const categoryTemplate = useCarCategoryTemplate(selectedPodcast);

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
      sectionIndexTitle: letter.charAt(0).toUpperCase(),
      items: items.map((item) => ({
        text: item.title,
      })),
    }));

    template.updateSections(listSections);

    template.config.onItemSelect = async ({index}) => {
      const podcast = podcasts[index];
      console.log('Podcast selected', podcast);
      setSelectedPodcast(podcast);
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

  useEffect(() => {
    console.log('pushing category template', categoryTemplate);
    if (categoryTemplate) {
      CarPlay.pushTemplate(categoryTemplate, true);
    }
  }, [categoryTemplate]);

  return template;
};

export default useCarPodcastsTemplate;
