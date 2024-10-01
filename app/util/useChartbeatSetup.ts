import ChartbeatReactNativeTracker from 'chartbeat-react-native-sdk';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'chartbeat-storage',
});

export const ChartbeatTracker = new ChartbeatReactNativeTracker({
  accountId: '65978',
  dashboardId: 'lrt.lt',
  storageGetter: async (key): Promise<string> => {
    return storage.getString(key) ?? '';
  },
  storageSetter: async (key, value) => {
    storage.set(key, value);
    return true;
  },
});
