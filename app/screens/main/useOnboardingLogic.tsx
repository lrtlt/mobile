import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MMKV} from 'react-native-mmkv';

const LOCAL_STORAGE_KEY = 'OnboardingModalShown';

const storage = new MMKV({
  id: 'onboarding-storage',
});

const hasMigratedFromAsyncStorage = storage.getBoolean('hasMigratedFromAsyncStorage');

async function migrateFromAsyncStorage(): Promise<void> {
  const value = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
  if (value) {
    storage.set(LOCAL_STORAGE_KEY, value);
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEY);
    storage.set('hasMigratedFromAsyncStorage', true);
  }
}

const useOnboardingLogic = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  useEffect(() => {
    if (!hasMigratedFromAsyncStorage) {
      migrateFromAsyncStorage();
    }

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
