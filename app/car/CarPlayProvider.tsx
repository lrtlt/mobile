import React, {PropsWithChildren, useMemo} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';
import useCarPlayController from './useCarPlayController';
import CarScreen from './screen/CarScreen';

const CarPlayProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  const {isConnected, setPlaylist, playlist, playItem} = useCarPlayController();

  // //TODO: remove this temporary fix later. Think of a better way to handle this.
  // useEffect(() => {
  //   if (!isConnected && Platform.OS === 'android') {
  //     setTimeout(() => {
  //       CarPlay.bridge.reload();
  //     }, 3000);
  //   }
  // }, [isConnected]);

  const context: CarPlayContextType = useMemo(
    () => ({
      isConnected,
      setPlaylist,
      playlist: playlist,
      playItem,
    }),
    [isConnected, setPlaylist, playlist, playItem],
  );

  return (
    <CarPlayContext.Provider value={context}>
      {isConnected ? <CarScreen /> : props.children}
    </CarPlayContext.Provider>
  );
};

export default CarPlayProvider;
