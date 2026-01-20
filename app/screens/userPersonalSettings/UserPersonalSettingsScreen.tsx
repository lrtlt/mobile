import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import UserActionItem from '../user/components/UserActionItem';
import {IcDelete, IcLogout} from '../../components/svg';
import {useTheme} from '../../Theme';
import {useAuth0} from 'react-native-auth0';
import queryClient from '../../../AppQueryClient';
import {useDeleteCurrentUser} from '../../api/hooks/useUser';
import {useDisassociateDeviceToken} from '../../api/hooks/usePushNotifications';
import ConfirmModal from '../weather/ConfirmModal';
import UserHeader from '../user/components/UserHeader';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {getFcmToken} from '../../util/useFCMTokenSync';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const UserPersonalSettingsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {clearSession, user} = useAuth0();
  const [deleteAccountConfirmVisible, setDeleteAccountConfirmVisible] = useState(false);
  const {mutateAsync: deleteUser} = useDeleteCurrentUser();
  const {mutateAsync: disassociateToken} = useDisassociateDeviceToken();

  const {colors} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: user?.name ?? '',
    });
  }, [user]);

  const clearFCMToken = async () => {
    const fcmToken = await getFcmToken();
    if (fcmToken) {
      console.log('Logout: Disassociating FCM token...');
      try {
        await disassociateToken(fcmToken);
        console.log('FCM token disassociated successfully');
      } catch (error) {
        console.error('Failed to disassociate FCM token:', error);
      }
    }
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await clearFCMToken();
        await clearSession();
        logEvent(getAnalytics(), 'app_lrt_lt_user_signed_out');
        queryClient.removeQueries();
        queryClient.invalidateQueries();
        navigation.pop();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await clearFCMToken();
      await deleteUser();
      logEvent(getAnalytics(), 'app_lrt_lt_user_account_deleted');
      queryClient.removeQueries();
      await clearSession();
      navigation.popToTop();
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={styles.container}>
        <UserHeader pressable={false} />
        <UserActionItem
          icon={<IcLogout size={32} color={colors.text} />}
          label="ATSIJUNGTI"
          onPress={user ? handleLogout : undefined}
        />
        <UserActionItem
          icon={<IcDelete size={32} color={colors.text} />}
          label="IŠTRINTI LRT PASKYRĄ"
          onPress={user ? () => setDeleteAccountConfirmVisible(true) : undefined}
        />
        <ConfirmModal
          title="Ar tikrai norite ištrinti paskyrą?"
          visible={deleteAccountConfirmVisible}
          onCancel={() => setDeleteAccountConfirmVisible(false)}
          onConfirm={() => {
            handleDeleteAccount();
            setDeleteAccountConfirmVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserPersonalSettingsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 12,
  },
  container: {
    paddingVertical: 8,
    gap: 12,
  },
});
