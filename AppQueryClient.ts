import {QueryClient, onlineManager} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default queryClient;
