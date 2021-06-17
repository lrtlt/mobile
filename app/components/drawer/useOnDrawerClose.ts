import {useIsDrawerOpen} from '@react-navigation/drawer';
import {useEffect} from 'react';

const useOnDrawerClose = (callback: () => void) => {
  const isOpen = useIsDrawerOpen();
  useEffect(() => {
    if (!isOpen) {
      callback();
    }
  }, [callback, isOpen]);
};

export default useOnDrawerClose;
