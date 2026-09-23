import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';
import {ChannelResponse} from '../../api/Types';
import {mediaLandingPage} from '../../util/smartocto';

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
  const {channel_url, title} = channel_response.channel_info;
  return {
    viewId: channel_url,
    title: `${title} - Tiesiogiai - LRT`,
    smartocto: mediaLandingPage(channel_url, title, 'Tiesiogiai'),
  };
};

export default useChannelAnalytics;
