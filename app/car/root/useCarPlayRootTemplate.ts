import {useEffect, useState} from 'react';
import {CarPlay, ListTemplate} from 'react-native-carplay';
import useCarLiveTemplate from '../live/useCarLiveTemplate';
import {
  CATEGORY_LIVE,
  CATEGORY_NEWEST,
  CATEGORY_POPULAR,
  CATEGORY_RECOMMENDED,
  carPlayRootTemplate,
} from './createPlayRootTemplate';
import useCarNewestTemplate from '../newest/useCarNewestTemplate';
import useCarPopularTemplate from '../popular/useCarPopularTemplate';
import useCarRecommendedTemplate from '../recommended/useCarRecommendedTemplate';

const useCarPlayRootTemplate = (isConnected: boolean) => {
  const [template] = useState<ListTemplate>(carPlayRootTemplate);

  const liveTemplate = useCarLiveTemplate(isConnected);
  const newestTemplate = useCarNewestTemplate(isConnected);
  const popularTemplate = useCarPopularTemplate(isConnected);
  const recommendedTemplate = useCarRecommendedTemplate(isConnected);

  useEffect(() => {
    template.config.onItemSelect = async ({index}) => {
      console.log('Root template onItemSelect', index);
      switch (index) {
        case CATEGORY_LIVE:
          CarPlay.pushTemplate(liveTemplate, true);
          break;
        case CATEGORY_POPULAR:
          CarPlay.pushTemplate(popularTemplate, true);
          break;
        case CATEGORY_NEWEST:
          CarPlay.pushTemplate(newestTemplate, true);
          break;
        case CATEGORY_RECOMMENDED:
          CarPlay.pushTemplate(recommendedTemplate, true);
          break;
      }
    };

    return () => {
      template.config.onItemSelect = undefined;
    };
  }, []);

  return template;
};

export default useCarPlayRootTemplate;
