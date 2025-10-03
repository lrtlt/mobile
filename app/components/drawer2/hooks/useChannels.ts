import {useCallback, useEffect, useState} from 'react';
import {fetchLiveTvPrograms} from '../../../api';
import {TVProgramResponse} from '../../../api/Types';

const useChannels = (): TVProgramResponse | undefined => {
  const [channels, setChannels] = useState<TVProgramResponse | undefined>(undefined);

  const fetchChannels = useCallback(async () => {
    console.log('Fetching channels...');
    try {
      const response = await fetchLiveTvPrograms();
      setChannels(response);
    } catch (e) {
      console.error('Failed to fetch channels', e);
      setTimeout(fetchChannels, 2000); // Retry after 2 seconds
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    const interval = setInterval(() => {
      fetchChannels();
    }, 60 * 1000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return channels;
};

export default useChannels;
