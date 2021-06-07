import {useEffect} from 'react';
import {Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {clearLaunchUrl} from '../redux/actions';
import {RootState} from '../redux/reducers';

const useHandleLaunchUrl = (enabled: boolean) => {
  const launchUrl = useSelector((state: RootState) => state.navigation.launchUrl);

  const dispatch = useDispatch();

  useEffect(() => {
    if (launchUrl) {
      if (!enabled) {
        console.log('LaunchUrl handler: waiting to be enabled...');
      } else {
        Linking.openURL(launchUrl);
        dispatch(clearLaunchUrl());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, launchUrl]);
};
export default useHandleLaunchUrl;
