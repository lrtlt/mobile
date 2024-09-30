import {useEffect} from 'react';
import {Linking} from 'react-native';
import {useNavigationStore} from '../state/navigation_store';
import {useShallow} from 'zustand/shallow';

const useHandleLaunchUrl = (enabled: boolean) => {
  const {launchUrl, setLaunchUrl} = useNavigationStore(
    useShallow((state) => ({
      launchUrl: state.launchUrl,
      setLaunchUrl: state.setLaunchUrl,
    })),
  );

  useEffect(() => {
    if (launchUrl) {
      if (!enabled) {
        console.log('LaunchUrl handler: waiting to be enabled...');
      } else {
        Linking.openURL(launchUrl);
        setLaunchUrl(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, launchUrl]);
};
export default useHandleLaunchUrl;
