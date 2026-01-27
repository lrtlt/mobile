import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import {
  subscribeToTopic,
  unsubscribeFromTopic,
  getSubscribedTopics,
} from '../../util/useFirebaseTopicSubscription';

const TOPICS_QUERY_KEY = 'topicNotifications';

export type FirebaseTopic = {
  id: string;
  name: string;
  slug: string;
  order_by: number;
  hidden: 0 | 1;
  active: 0 | 1;
};

const TEST_TOPIC: FirebaseTopic = {
  id: 'test',
  name: 'Test topic',
  slug: 'test',
  order_by: -1,
  hidden: 1,
  active: 1,
};

export type FirebaseTopicsResponse = FirebaseTopic[];

const PUSH_CATEGORIES_URL = 'https://www.lrt.lt/static/data/push_categories.json';

let defaultTopicsCache: FirebaseTopicsResponse | null = null;

/**
 * Fetch push categories from the server.
 * Sets active flag based on topics stored in MMKV.
 */
export const fetchPushCategories = async (): Promise<FirebaseTopicsResponse> => {
  let defaultTopics = defaultTopicsCache;
  if (!defaultTopics) {
    const data = await HttpClient.get<FirebaseTopicsResponse>(PUSH_CATEGORIES_URL);
    if (__DEV__) {
      data.push(TEST_TOPIC);
    }
    defaultTopicsCache = data;
    defaultTopics = data;
  }

  // Get current subscriptions from storage
  const subscribedTopics = getSubscribedTopics();

  // Set active flag based on subscription status
  return defaultTopics.map((topic) => ({
    ...topic,
    active: subscribedTopics.includes(topic.slug) ? 1 : 0,
  }));
};

/**
 * Get default topic subscriptions for all guest users.
 */
export const useDefaultTopics = () =>
  useQuery({
    queryKey: [TOPICS_QUERY_KEY],
    queryFn: async () => {
      return fetchPushCategories();
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

/**
 * Subscribe to a topic mutation with optimistic updates
 */
export const useSubscribeToTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const success = await subscribeToTopic(slug);
      if (!success) {
        throw new Error('Failed to subscribe to topic');
      }
      return slug;
    },
    onMutate: async (slug: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({queryKey: [TOPICS_QUERY_KEY]});

      // Snapshot the previous value
      const previousTopics = queryClient.getQueryData<FirebaseTopicsResponse>([TOPICS_QUERY_KEY]);

      // Optimistically update the cache
      queryClient.setQueryData<FirebaseTopicsResponse>([TOPICS_QUERY_KEY], (old) => {
        if (!old) return old;
        return old.map((topic) =>
          topic.slug === slug ? {...topic, active: 1} : topic,
        );
      });

      // Return context with previous state for rollback
      return {previousTopics};
    },
    onError: (err, slug, context) => {
      // Rollback to previous state on error
      if (context?.previousTopics) {
        queryClient.setQueryData([TOPICS_QUERY_KEY], context.previousTopics);
      }
      console.error('Error subscribing to topic:', slug, err);
    },
    onSettled: () => {
      // Refetch to ensure cache is in sync with server/storage
      queryClient.invalidateQueries({queryKey: [TOPICS_QUERY_KEY]});
    },
  });
};

/**
 * Unsubscribe from a topic mutation with optimistic updates
 */
export const useUnsubscribeFromTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const success = await unsubscribeFromTopic(slug);
      if (!success) {
        throw new Error('Failed to unsubscribe from topic');
      }
      return slug;
    },
    onMutate: async (slug: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({queryKey: [TOPICS_QUERY_KEY]});

      // Snapshot the previous value
      const previousTopics = queryClient.getQueryData<FirebaseTopicsResponse>([TOPICS_QUERY_KEY]);

      // Optimistically update the cache
      queryClient.setQueryData<FirebaseTopicsResponse>([TOPICS_QUERY_KEY], (old) => {
        if (!old) return old;
        return old.map((topic) =>
          topic.slug === slug ? {...topic, active: 0} : topic,
        );
      });

      // Return context with previous state for rollback
      return {previousTopics};
    },
    onError: (err, slug, context) => {
      // Rollback to previous state on error
      if (context?.previousTopics) {
        queryClient.setQueryData([TOPICS_QUERY_KEY], context.previousTopics);
      }
      console.error('Error unsubscribing from topic:', slug, err);
    },
    onSettled: () => {
      // Refetch to ensure cache is in sync with server/storage
      queryClient.invalidateQueries({queryKey: [TOPICS_QUERY_KEY]});
    },
  });
};
