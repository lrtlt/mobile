import {useDrawerStatus} from '@react-navigation/drawer';
import {useEffect} from 'react';

const useOnDrawerClose = (callback: () => void) => {
  const status = useDrawerStatus();
  useEffect(() => {
    if (status === 'closed') {
      callback();
    }
  }, [callback, status]);
};

export default useOnDrawerClose;
