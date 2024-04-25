import React, {PropsWithChildren, useMemo} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';
import useCarPlayController from './useCarPlayController';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected} = useCarPlayController();

  const context: CarPlayContextType = useMemo(
    () => ({
      isConnected,
    }),
    [isConnected],
  );

  return <CarPlayContext.Provider value={context}>{props.children}</CarPlayContext.Provider>;
};

export default CarPlayProvider;
