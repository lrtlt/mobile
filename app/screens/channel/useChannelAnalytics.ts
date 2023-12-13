import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ArticleContent, ChannelResponse, isDefaultArticle} from '../../api/Types';

type Params = {
  channel_response?: ChannelResponse;
};

const useChannelAnalytics = ({channel_response}: Params) => {
  const params = channelToTrackingParams(channel_response);
  useNavigationAnalytics(params);
};

const channelToTrackingParams = (channel_response?: ChannelResponse): TrackingParams | undefined => {
  if (!channel_response) {
    return undefined;
  }
  return {
    type: `Channel`,
    title: `${channel_response.channel_info.title} - LRT Gyvai - LRT`,
  };
};

export default useChannelAnalytics;
