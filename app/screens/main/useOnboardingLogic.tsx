import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'OnboardingModalShown';

const useOnboardingLogic = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(LOCAL_STORAGE_KEY).then((value) => {
      if (!value) {
        setIsFirstTime(true);
      }
    });
  }, []);

  const onModalClose = useCallback(() => {
    setShowNotificationModal(false);
    AsyncStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  }, []);

  return {isVisible: isFirstTime && showNotificationModal, onClose: onModalClose};
};

export default useOnboardingLogic;
