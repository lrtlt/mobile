import React, {PropsWithChildren, useMemo} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';
import {Platform} from 'react-native';
import useCarPlayController from './useCarPlayController';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected} =
    Platform.OS === 'ios'
      ? useCarPlayController()
      : {
          isConnected: false,
        };

  const context: CarPlayContextType = useMemo(
    () => ({
      isConnected,
    }),
    [isConnected],
  );

  return <CarPlayContext.Provider value={context}>{props.children}</CarPlayContext.Provider>;
};

export default CarPlayProvider;
