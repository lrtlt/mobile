import React, {PropsWithChildren, useMemo} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';

const CarPlayEmptyProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const context: CarPlayContextType = useMemo(
    () => ({
      isConnected: false,
      playItem: () => {},
      playlist: [],
      setPlaylist: () => {},
    }),
    [],
  );

  return <CarPlayContext.Provider value={context}>{props.children}</CarPlayContext.Provider>;
};

export default CarPlayEmptyProvider;
