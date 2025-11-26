import {useCallback, useEffect, useState} from 'react';
import {MMKV} from 'react-native-mmkv';

const LOCAL_STORAGE_KEY = 'WalkthroughModalShown_v1';

const storage = new MMKV({
  id: 'onboarding-storage',
});

const useOnboardingLogic = () => {
  const [showWalkthroughModal, setShowWalkthroughModal] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    const value = storage.getString(LOCAL_STORAGE_KEY);
    if (!value) {
      setIsFirstTime(true);
    }
  }, []);

  const onModalClose = useCallback(() => {
    setShowWalkthroughModal(false);
    storage.set(LOCAL_STORAGE_KEY, 'true');
  }, []);

  return {isVisible: isFirstTime && showWalkthroughModal, onClose: onModalClose};
};

export default useOnboardingLogic;
