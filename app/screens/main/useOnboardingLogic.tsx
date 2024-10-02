import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MMKV} from 'react-native-mmkv';

const LOCAL_STORAGE_KEY = 'OnboardingModalShown';

const storage = new MMKV({
  id: 'onboarding-storage',
});

//TODO: 2024-10-01 remove migration after a while.
export const runOnboardingStorageMigration = async () => {
  if (storage.getBoolean('hasMigratedFromAsyncStorage')) return;
  const value = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
  if (value) {
    storage.set(LOCAL_STORAGE_KEY, value);
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  storage.set('hasMigratedFromAsyncStorage', true);
};

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
