import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';

const useAppStateCallback = (onForeground: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        onForeground();
      }
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground]);
};

export default useAppStateCallback;
