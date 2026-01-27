import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, View} from 'react-native';
import SettingsSwitch from './SettingsSwitch';
import {ScreenError, Text} from '../../components';
import {useTheme} from '../../Theme';
import {
  useDefaultTopics,
  useSubscribeToTopic,
  useUnsubscribeFromTopic,
} from '../../api/hooks/useNotificationTopics';

interface SettingsNotificationsProps {}

const SettingsNotifications: React.FC<PropsWithChildren<SettingsNotificationsProps>> = ({}) => {
  // const {user} = useAuth0();
  // const isLoggedIn = !!user;

  return <TopicNotifications />;
};

/**
 * Topic notification settings - uses FCM topic subscriptions
 */
const TopicNotifications: React.FC = () => {
  const {colors} = useTheme();
  const {data: topics, isLoading, isError} = useDefaultTopics();
  const subscribeToTopicMutation = useSubscribeToTopic();
  const unsubscribeFromTopicMutation = useUnsubscribeFromTopic();

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

  if (!topics) {
    return <ScreenError text="Nerasta pranešimų nustatymų" />;
  }

  // Filter out hidden topics from the UI
  const visibleTopics = topics.filter((t) => !t.hidden);

  return (
    <>
      {visibleTopics.map((t) => {
        return (
          <SettingsSwitch
            key={t.id}
            title={t.name}
            onValueChange={(value) => {
              if (value) {
                subscribeToTopicMutation.mutate(t.slug);
              } else {
                unsubscribeFromTopicMutation.mutate(t.slug);
              }
            }}
            value={!!t.active}
          />
        );
      })}
    </>
  );
};

export default SettingsNotifications;
