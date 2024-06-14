import React, {PropsWithChildren} from 'react';
import useFirebaseTopicSubscription from '../../util/useFirebaseTopicSubscription';

import SettingsSwitch from './SettingsSwitch';

interface SettingsNotificationsProps {}

const SettingsNotifications: React.FC<PropsWithChildren<SettingsNotificationsProps>> = ({}) => {
  const {topics, subscriptions, subscribeToTopic, unsubscribeFromTopic} = useFirebaseTopicSubscription();
  return (
    <>
      {topics
        .filter((topic) => !topic.hidden && topic.active)
        .map((topic) => {
          return (
            <SettingsSwitch
              key={topic.slug}
              title={topic.name}
              onValueChange={(value) => {
                if (value) {
                  subscribeToTopic(topic.slug);
                } else {
                  unsubscribeFromTopic(topic.slug);
                }
              }}
              value={subscriptions.includes(topic.slug)}
            />
          );
        })}
    </>
  );
};

export default SettingsNotifications;
