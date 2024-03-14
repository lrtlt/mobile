import {useContext} from 'react';
import {CarPlayContext, CarPlayContextType} from './CarPlayContext';

export function useCarPlay(): CarPlayContextType {
  return useContext(CarPlayContext);
}
