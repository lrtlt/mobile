import ChartbeatReactNativeTracker from 'chartbeat-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChartbeatTracker = new ChartbeatReactNativeTracker({
  accountId: '1234',
  dashboardId: 'lrt.lt  ',
  storageGetter: async (key): Promise<string> => {
    return (await AsyncStorage.getItem(key)) ?? '';
  },
  storageSetter: async (key, value) => {
    await AsyncStorage.setItem(key, value);
    return true;
  },
});
