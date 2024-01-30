import React, {PropsWithChildren, useEffect} from 'react';
import {CarPlayContext} from './CarPlayContext';
import useCarPlayController from './useCarPlayController';
import CarScreen from './screen/CarScreen';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected, setPlaylist} = useCarPlayController();

  // //TODO: remove this temporary fix later. Think of a better way to handle this.
  // useEffect(() => {
  //   if (!isConnected && Platform.OS === 'android') {
  //     setTimeout(() => {
  //       CarPlay.bridge.reload();
  //     }, 3000);
  //   }
  // }, [isConnected]);

  return (
    <CarPlayContext.Provider
      value={{
        isConnected,
        setPlaylist,
      }}>
      {isConnected ? <CarScreen /> : props.children}
    </CarPlayContext.Provider>
  );
};

export default CarPlayProvider;
