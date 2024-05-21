import {useState} from 'react';
import {TabBarTemplate} from 'react-native-carplay/src';
import useCarLiveTemplate from '../live/useCarLiveTemplate';

import useCarNewestTemplate from '../newest/useCarNewestTemplate';
import useCarRecommendedTemplate from '../recommended/useCarRecommendedTemplate';
import useCarPodcastsTemplate from '../podcasts/useCarPodcastsTemplate';
import {TEMPLATE_ID_ROOT} from './createPlayRootTemplate';
import {TEMPLATE_ID_LIVE} from '../live/createPlayLiveTemplate';
import analytics from '@react-native-firebase/analytics';
import Gemius from 'react-native-gemius-plugin';
import {TEMPLATE_ID_NEWEST} from '../newest/createPlayNewestTemplate';
import {TEMPLATE_ID_PODCASTS} from '../podcasts/createPlayPodcastsTemplate';
import {TEMPLATE_ID_RECOMMENDED} from '../recommended/createPlayRecommendedTemplate';
import {TEMPLATE_ID_POPULAR} from '../popular/createPlayPopularTemplate';
import {debounce} from 'lodash';

const sendAnalyticsEvent = debounce((eventName: string) => {
  Gemius.sendPageViewedEvent(eventName);
  analytics().logEvent(eventName);
}, 200);

const useCarPlayRootTemplate = (isConnected: boolean) => {
  const [template] = useState<TabBarTemplate>(
    new TabBarTemplate({
      title: 'LRT',
      id: TEMPLATE_ID_ROOT,
      templates: [
        useCarRecommendedTemplate(isConnected),
        useCarLiveTemplate(isConnected),
        useCarNewestTemplate(isConnected),
        useCarPodcastsTemplate(isConnected),
      ],
      onTemplateSelect: (template, _params) => {
        switch (template?.config.id) {
          case TEMPLATE_ID_RECOMMENDED:
            sendAnalyticsEvent('carplay_recommended_open');
            break;
          case TEMPLATE_ID_LIVE:
            sendAnalyticsEvent('carplay_live_open');
            break;
          case TEMPLATE_ID_NEWEST:
            sendAnalyticsEvent('carplay_newest_open');
            break;
          case TEMPLATE_ID_PODCASTS:
            sendAnalyticsEvent('carplay_podcasts_open');
            break;
          case TEMPLATE_ID_POPULAR:
            sendAnalyticsEvent('carplay_popular_open');
            break;
        }
      },
    }),
  );

  return template;
};

export default useCarPlayRootTemplate;
