import ChartbeatReactNativeTracker from 'chartbeat-react-native-sdk';
import Config from 'react-native-config';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'chartbeat-storage',
});

export const ChartbeatTracker = new ChartbeatReactNativeTracker({
  accountId: Config.CHARTBEAT_ACCOUNT_ID,
  dashboardId: Config.CHARTBEAT_DASHBOARD_ID,
  storageGetter: async (key): Promise<string> => {
    return storage.getString(key) ?? '';
  },
  storageSetter: async (key, value) => {
    storage.set(key, value);
    return true;
  },
});
