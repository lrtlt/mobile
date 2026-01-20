import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuth0} from 'react-native-auth0';
import {useUserSubscriptions, useUpdateSubscription} from '../../api/hooks/usePushNotifications';
import SettingsSwitch from './SettingsSwitch';
import {ScreenError, Text} from '../../components';
import {useTheme} from '../../Theme';

interface SettingsNotificationsProps {}

const SettingsNotifications: React.FC<PropsWithChildren<SettingsNotificationsProps>> = ({}) => {
  const {user} = useAuth0();
  const isLoggedIn = !!user;

  if (isLoggedIn) {
    return <LoggedInNotifications />;
  }

  return <View />;
};

/**
 * Logged-in user notification settings - uses backend subscriptions
 */
const LoggedInNotifications: React.FC = () => {
  const {colors} = useTheme();
  const {data: subscriptions, isLoading, isError} = useUserSubscriptions();
  const {mutate: updateSubscription} = useUpdateSubscription();

  if (isLoading) {
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{padding: 20}}>
        <Text type="secondary">Nepavyko gauti pranešimų nustatymų. Bandykite dar kartą.</Text>
      </View>
    );
  }

  if (!subscriptions) {
    return <ScreenError text="Nerasta pranešimų nustatymų" />;
  }

  return (
    <>
      {subscriptions.map((s) => {
        return (
          <SettingsSwitch
            key={s.subscription_key}
            title={s.name ?? s.subscription_key}
            onValueChange={(value) => {
              updateSubscription({
                subscription_key: s.subscription_key,
                is_active: value,
              });
            }}
            value={s.is_active}
          />
        );
      })}
    </>
  );
};

export default SettingsNotifications;
