import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import useCarPlayCategoryPlaylist from './useCarCategoryPlaylist';
import {CarPlayPodcastItem} from '../../api/Types';
import {CategoryListItem} from '../CarPlayContext';
import useCarPlayCategoryEpisodeStream from './useCarPlayCategoryEpisodeStream';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';
import {carPlayNowPlayingTemplate} from '../nowPlaying/createNowPlayingTemplate';
import {debounce} from 'lodash';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';

const sendAnalyticsEvent = debounce((eventName: string) => {
  Gemius.sendPageViewedEvent(eventName);
  analytics().logEvent(eventName);
}, 200);

const useCarCategoryTemplate = (podcast?: CarPlayPodcastItem) => {
  const [template, setTemplate] = useState<ListTemplate>();
  const [selectedEpisode, setSelectedEpisode] = useState<CategoryListItem | undefined>(undefined);

  const {episodes} = useCarPlayCategoryPlaylist(podcast?.id);
  const {streamInfo} = useCarPlayCategoryEpisodeStream(selectedEpisode);

  const {setPlaylist} = useMediaPlayer();

  useEffect(() => {
    if (!podcast) {
      return;
    }

    const t = new ListTemplate({
      title: podcast?.title,
      id: 'lrt-list-template-podcast-' + podcast?.id,
      sections: [
        {
          items: [
            ...episodes.map((item) => ({
              text: item.text,
              detailText: item.detailText,
              // imgUrl: item.imgUrl as any,
            })),
          ],
        },
      ],
      backButtonHidden: true,
    });
    t.config.onItemSelect = async ({index}) => {
      console.log('onItemSelect', episodes[index]);
      setSelectedEpisode(episodes[index]);
    };
    setTemplate(t);
    sendAnalyticsEvent('carplay_podcast_open_' + podcast?.id);

    return () => {
      t.config.onItemSelect = undefined;
    };
  }, [episodes]);

  useEffect(() => {
    if (!streamInfo) {
      return;
    }
    setPlaylist([
      {
        title: streamInfo.text,
        startTime: 0,
        poster: streamInfo.imgUrl,
        uri: streamInfo.streamUrl,
        mediaType: MediaType.AUDIO,
        isLiveStream: false,
      },
    ]);
    CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
  }, [streamInfo]);

  return template;
};

export default useCarCategoryTemplate;
