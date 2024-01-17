import React, {PropsWithChildren, useEffect} from 'react';
import {CarPlayContext} from './CarPlayContext';
import useCarPlayController from './useCarPlayController';
import {CarPlay} from 'react-native-carplay';
import {Platform} from 'react-native';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected} = useCarPlayController();

  useEffect(() => {
    //TODO: remove this temporary fix later. Think of a better way to handle this.
    if (!isConnected && Platform.OS === 'android') {
      setTimeout(() => {
        CarPlay.bridge.reload();
      }, 3000);
    }
  }, [isConnected]);

  return (
    <CarPlayContext.Provider
      value={{
        isConnected,
      }}>
      {props.children}
    </CarPlayContext.Provider>
  );
};

export default CarPlayProvider;
