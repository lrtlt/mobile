import React, {PropsWithChildren} from 'react';
import {CarPlayContext} from './CarPlayContext';

const CarPlayEmptyProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  return (
    <CarPlayContext.Provider
      value={{
        isConnected: false,
      }}>
      {props.children}
    </CarPlayContext.Provider>
  );
};

export default CarPlayEmptyProvider;
