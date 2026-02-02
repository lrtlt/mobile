import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, View} from 'react-native';
import SettingsSwitch from '../settings/SettingsSwitch';
import {ScreenError, Text} from '../../components';
import {useTheme} from '../../Theme';
import {
  useUserSubscriptions,
  useUpdateSubscription,
} from '../../api/hooks/usePushNotifications';

interface SubscriptionsSettingsProps {}

const SubscriptionsSettings: React.FC<PropsWithChildren<SubscriptionsSettingsProps>> = ({}) => {
  const {colors} = useTheme();
  const {data: subscriptions, isLoading, isError} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

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
        <Text type="secondary">Nepavyko gauti prenumeratų nustatymų. Bandykite dar kartą.</Text>
      </View>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return <ScreenError text="Nerasta prenumeratų nustatymų" />;
  }

  return (
    <>
      {subscriptions.map((sub) => {
        return (
          <SettingsSwitch
            key={sub.subscription_key}
            title={sub.name || sub.subscription_key}
            onValueChange={(value) => {
              updateSubscriptionMutation.mutate({
                name: sub.name || sub.subscription_key,
                subscription_key: sub.subscription_key,
                is_active: value,
              });
            }}
            value={sub.is_active}
          />
        );
      })}
    </>
  );
};

export default SubscriptionsSettings;
