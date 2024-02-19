import {useCallback, useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOPICS_STORAGE_KEY = 'initialTopicSubscription';

const useFirebaseTopicSubscription = () => {
  const [topics, setTopics] = useState<FirebaseTopicsResponse>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    if (__DEV__) {
      messaging().subscribeToTopic('test');
    }
  }, []);

  const subscribeToTopic = useCallback(
    async (topicSlug: string) => {
      if (subscriptions.indexOf(topicSlug) === -1) {
        const list = [...subscriptions, topicSlug];
        setSubscriptions(list);
        messaging()
          .subscribeToTopic(topicSlug)
          .then(() => AsyncStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(list)))
          .then(() => console.log('Subscribed to topic: ' + topicSlug))
          //revert if failed
          .catch(() => setSubscriptions(subscriptions));
      }
    },
    [subscriptions],
  );

  const unsubscribeFromTopic = useCallback(
    async (topicSlug: string) => {
      const list = subscriptions.filter((item) => item !== topicSlug);
      setSubscriptions(list);
      messaging()
        .unsubscribeFromTopic(topicSlug)
        .then(() => AsyncStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(list)))
        .then(() => console.log('Unsubscribed from topic: ' + topicSlug))
        //revert if failed
        .catch(() => setSubscriptions(subscriptions));
    },
    [subscriptions],
  );

  useEffect(() => {
    fetch('https://www.lrt.lt/static/data/push_categories.json', {
      method: 'GET',
    })
      .then(async (response) => {
        const data = (await response.json()) as FirebaseTopicsResponse;
        const topicsJson = await AsyncStorage.getItem(TOPICS_STORAGE_KEY);

        let isFirstRun = true;
        let activeSubscriptions: string[] = [];

        if (topicsJson) {
          isFirstRun = false;
          activeSubscriptions = JSON.parse(topicsJson);
        }

        data.forEach((topic) => {
          const shouldSubscribe = isFirstRun || topic.hidden === 1;
          if (shouldSubscribe) {
            messaging().subscribeToTopic(topic.slug);
            if (activeSubscriptions.indexOf(topic.slug) === -1) {
              activeSubscriptions.push(topic.slug);
            }
          }
        });

        await AsyncStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(activeSubscriptions));
        setSubscriptions(activeSubscriptions);
        setTopics(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return {
    topics,
    subscriptions,
    subscribeToTopic,
    unsubscribeFromTopic,
  };
};

export default useFirebaseTopicSubscription;

type FirebaseTopicsResponse = {
  id: string;
  name: string;
  slug: string;
  order_by: number;
  hidden: 0 | 1;
  active: 0 | 1;
}[];
