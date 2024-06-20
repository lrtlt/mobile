import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ChannelResponse} from '../../api/Types';

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
  const channelTitle = channel_response.channel_info.title;
  return {
    viewId: channel_response.channel_info.channel_url,
    title: `${channelTitle} - LRT Gyvai - LRT`,
    sections: ['Gyvai', toTitleCase(channelTitle)],
  };
};

const toTitleCase = (s: string) =>
  s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

export default useChannelAnalytics;
