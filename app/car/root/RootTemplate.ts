import {ListTemplate, TabBarTemplate} from 'react-native-carplay';
import {debounce} from 'lodash';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';

import {TEMPLATE_ID_POPULAR} from '../popular/PopularTemplate';
import RecommendedTemplate, {TEMPLATE_ID_RECOMMENDED} from '../recommended/RecommendedTemplate';
import LiveTemplate, {TEMPLATE_ID_LIVE} from '../live/LiveTemplate';
import NewestTemplate, {TEMPLATE_ID_NEWEST} from '../newest/NewestTemplate';
import PodcastsTemplate, {TEMPLATE_ID_PODCASTS} from '../podcasts/PodcastsTemplate';

export const TEMPLATE_ID_ROOT = 'lrt-root-template';

const sendAnalyticsEvent = debounce((eventName: string) => {
  Gemius.sendPageViewedEvent(eventName);
  analytics().logEvent(eventName);
}, 200);

export class RootTemplate {
  template?: TabBarTemplate;

  onTemplateSelectHandler(template: ListTemplate) {
    switch (template.config.id) {
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
  }

  async build() {
    if (this.template) {
      this.template.config.onTemplateSelect = () => {};
    }

    const templates = await Promise.all([
      await RecommendedTemplate.build(),
      await LiveTemplate.build(),
      await NewestTemplate.build(),
      await PodcastsTemplate.build(),
    ]);

    this.template = new TabBarTemplate({
      title: 'LRT',
      id: TEMPLATE_ID_ROOT,
      templates: templates,
      onTemplateSelect: (template, _params) => this.onTemplateSelectHandler(template as ListTemplate),
    });
    return this.template;
  }
}

const instance = new RootTemplate();
export default instance;
