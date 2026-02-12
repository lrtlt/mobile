import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';
import {OpusPlaylistResponse} from '../Types';

export const useChannelPlaylist = (station?: string | null) => {
  return useQuery({
    queryKey: ['channelPlaylist', station],
    queryFn: async ({signal}) => {
      const url = `https://www.lrt.lt/api/json/rds?station=${station}`;
      const response = await get<OpusPlaylistResponse>(url, {signal});
      return response;
    },
    enabled: !!station,
  });
};
