import React, {PropsWithChildren, useEffect, useMemo} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';
import useCarPlayController from './useCarPlayController';
import useCarLiveChannels from './useCarLiveChannels';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected, setPlaylist, playlist} = useCarPlayController();
  const {channels} = useCarLiveChannels(isConnected);

  useEffect(() => {
    if (channels.length > 0) {
      setPlaylist(channels);
    }
  }, [channels]);

  const context: CarPlayContextType = useMemo(
    () => ({
      isConnected,
      setPlaylist,
      playlist: playlist,
    }),
    [isConnected, setPlaylist, playlist],
  );

  return <CarPlayContext.Provider value={context}>{props.children}</CarPlayContext.Provider>;
};

export default CarPlayProvider;
