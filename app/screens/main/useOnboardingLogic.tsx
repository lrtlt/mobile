import {useCallback, useEffect, useState} from 'react';
import {MMKV} from 'react-native-mmkv';

const LOCAL_STORAGE_KEY = 'OnboardingModalShown';

const storage = new MMKV({
  id: 'onboarding-storage',
});

const useOnboardingLogic = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    const value = storage.getString(LOCAL_STORAGE_KEY);
    if (!value) {
      setIsFirstTime(true);
    }
  }, []);

  const onModalClose = useCallback(() => {
    setShowNotificationModal(false);
    storage.set(LOCAL_STORAGE_KEY, 'true');
  }, []);

  return {isVisible: isFirstTime && showNotificationModal, onClose: onModalClose};
};

export default useOnboardingLogic;
