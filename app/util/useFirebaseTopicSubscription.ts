import {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';

const useFirebaseTopicSubscription = () => {
  const [topics, setTopics] = useState<FirebaseTopicsResponse>([]);

  useEffect(() => {
    fetch('https://www.lrt.lt/static/data/push_categories.json', {
      method: 'GET',
    })
      .then(async (response) => {
        const data = (await response.json()) as FirebaseTopicsResponse;

        data
          .filter((topic) => topic.hidden === 1)
          .forEach((hiddenTopics) => {
            messaging().subscribeToTopic(hiddenTopics.slug);
          });

        if (__DEV__) {
          messaging().subscribeToTopic('test');
        }

        setTopics(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return topics;
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
