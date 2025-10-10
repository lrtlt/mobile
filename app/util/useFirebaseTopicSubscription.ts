import {useCallback, useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {MMKV} from 'react-native-mmkv';
import {InteractionManager} from 'react-native';

const TOPICS_STORAGE_KEY = 'initialTopicSubscription';

const storage = new MMKV({
  id: 'topics-storage',
});

const useFirebaseTopicSubscription = () => {
  const [topics, setTopics] = useState<FirebaseTopicsResponse>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    if (__DEV__) {
      InteractionManager.runAfterInteractions(async () => {
        try {
          await messaging().subscribeToTopic('test');
        } catch (e) {
          // ignore emulator issues
        }
      });
    }
  }, []);

  const subscribeToTopic = useCallback(
    async (topicSlug: string) => {
      if (subscriptions.indexOf(topicSlug) === -1) {
        const originalSubscriptions = [...subscriptions];
        const list = [...subscriptions, topicSlug];
        setSubscriptions(list);
        messaging()
          .subscribeToTopic(topicSlug)
          .then(() => storage.set(TOPICS_STORAGE_KEY, JSON.stringify(list)))
          .then(() => console.log('Subscribed to topic: ' + topicSlug))
          //revert if failed
          .catch(() => setSubscriptions(originalSubscriptions));
      }
    },
    [subscriptions],
  );

  const unsubscribeFromTopic = useCallback(
    async (topicSlug: string) => {
      const originalSubscriptions = [...subscriptions];
      const list = subscriptions.filter((item) => item !== topicSlug);
      setSubscriptions(list);
      messaging()
        .unsubscribeFromTopic(topicSlug)
        .then(() => storage.set(TOPICS_STORAGE_KEY, JSON.stringify(list)))
        .then(() => console.log('Unsubscribed from topic: ' + topicSlug))
        //revert if failed
        .catch(() => setSubscriptions(originalSubscriptions));
    },
    [subscriptions],
  );

  useEffect(() => {
    fetch('https://www.lrt.lt/static/data/push_categories.json', {
      method: 'GET',
    })
      .then(async (response) => {
        const data = (await response.json()) as FirebaseTopicsResponse;
        const topicsJson = storage.getString(TOPICS_STORAGE_KEY);

        let isFirstRun = true;
        let activeSubscriptions: string[] = [];

        if (topicsJson) {
          isFirstRun = false;
          activeSubscriptions = JSON.parse(topicsJson);
        }

        data.forEach(async (topic) => {
          const shouldSubscribe = isFirstRun || topic.hidden === 1;
          if (shouldSubscribe) {
            if (activeSubscriptions.indexOf(topic.slug) === -1) {
              activeSubscriptions.push(topic.slug);
            }
          }
        });

        storage.set(TOPICS_STORAGE_KEY, JSON.stringify(activeSubscriptions));
        setSubscriptions(activeSubscriptions);
        setTopics(data);

        for (const subscription of activeSubscriptions) {
          try {
            await messaging().subscribeToTopic(subscription);
          } catch (e) {
            // ignore emulator issues
          }
        }
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
