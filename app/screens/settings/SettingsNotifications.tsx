import React, {PropsWithChildren} from 'react';
import {View, ViewStyle} from 'react-native';
import {Text} from '../../components';
import useFirebaseTopicSubscription from '../../util/useFirebaseTopicSubscription';
import {Switch} from 'react-native-gesture-handler';

interface SettingsNotificationsProps {
  cellStyle: ViewStyle;
  titleStyle: ViewStyle;
}

const SettingsNotifications: React.FC<PropsWithChildren<SettingsNotificationsProps>> = ({
  cellStyle,
  titleStyle,
}) => {
  const {topics, subscriptions, subscribeToTopic, unsubscribeFromTopic} = useFirebaseTopicSubscription();

  return (
    <>
      {topics
        .filter((topic) => !topic.hidden && topic.active)
        .map((topic) => {
          return (
            <View key={topic.slug} style={cellStyle}>
              <Text style={titleStyle}>{topic.name}</Text>
              <Switch
                onValueChange={(value) => {
                  if (value) {
                    subscribeToTopic(topic.slug);
                  } else {
                    unsubscribeFromTopic(topic.slug);
                  }
                }}
                value={subscriptions.includes(topic.slug)}
              />
            </View>
          );
        })}
    </>
  );
};

export default SettingsNotifications;
