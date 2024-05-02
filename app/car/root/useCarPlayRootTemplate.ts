import {useState} from 'react';
import {TabBarTemplate} from 'react-native-carplay';
import useCarLiveTemplate from '../live/useCarLiveTemplate';

import useCarNewestTemplate from '../newest/useCarNewestTemplate';
import useCarRecommendedTemplate from '../recommended/useCarRecommendedTemplate';
import useCarPodcastsTemplate from '../podcasts/useCarPodcastsTemplate';

const useCarPlayRootTemplate = (isConnected: boolean) => {
  const [template] = useState<TabBarTemplate>(
    new TabBarTemplate({
      title: 'LRT',
      id: 'root-tab-bar',
      templates: [
        useCarRecommendedTemplate(isConnected),
        useCarLiveTemplate(isConnected),
        useCarNewestTemplate(isConnected),
        useCarPodcastsTemplate(isConnected),
      ],
      onTemplateSelect: (_template, _params) => {},
    }),
  );

  return template;
};

export default useCarPlayRootTemplate;
