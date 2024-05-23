import {TabBarTemplate} from 'react-native-carplay/src';
import {
  TEMPLATE_ID_RECOMMENDED,
  carPlayRecommendedTemplate,
} from '../recommended/createPlayRecommendedTemplate';
import {TEMPLATE_ID_LIVE, carPlayLiveTemplate} from '../live/createPlayLiveTemplate';
import {TEMPLATE_ID_NEWEST, carPlayNewestTemplate} from '../newest/createPlayNewestTemplate';
import {TEMPLATE_ID_PODCASTS, carPlayPodcastsTemplate} from '../podcasts/createPlayPodcastsTemplate';
import {TEMPLATE_ID_POPULAR} from '../popular/createPlayPopularTemplate';

import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';
import {debounce} from 'lodash';

export const TEMPLATE_ID_ROOT = 'lrt-root-template';

const sendAnalyticsEvent = debounce((eventName: string) => {
  Gemius.sendPageViewedEvent(eventName);
  analytics().logEvent(eventName);
}, 200);

export const carPlayRootTemplate = new TabBarTemplate({
  title: 'LRT',
  tabTitle: 'LRT',
  id: TEMPLATE_ID_ROOT,
  templates: [
    carPlayRecommendedTemplate,
    // carPlayLiveTemplate,
    // carPlayNewestTemplate,
    // carPlayPodcastsTemplate,
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
});
