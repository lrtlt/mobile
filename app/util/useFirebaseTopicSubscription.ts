import messaging from '@react-native-firebase/messaging';
import {MMKV} from 'react-native-mmkv';
import {fetchPushCategories} from '../api/hooks/useNotificationTopics';

const TOPICS_STORAGE_KEY = 'initialTopicSubscription';

const storage = new MMKV({
  id: 'topics-storage',
});

/**
 * Subscribe to all default FCM topics.
 * Used for guests on first launch and when user logs out.
 * On first run, subscribes to all topics.
 * On subsequent runs, only subscribes to previously stored subscriptions.
 */
export const subscribeToAllDefaultTopics = async (): Promise<void> => {
  try {
    const topics = await fetchPushCategories();
    const allTopicSlugs = topics.map((t) => t.slug);

    // Check if we have existing subscriptions in storage
    const topicsJson = storage.getString(TOPICS_STORAGE_KEY);
    let topicsToSubscribe: string[];

    if (topicsJson) {
      // Not first run - only subscribe to new topics
      const storedSubscriptions: string[] = JSON.parse(topicsJson);
      topicsToSubscribe = allTopicSlugs.filter((slug) => !storedSubscriptions.includes(slug));
    } else {
      // First run - subscribe to all topics
      topicsToSubscribe = allTopicSlugs;
    }

    // Subscribe to topics in parallel
    const results = await Promise.allSettled(
      topicsToSubscribe.map((slug) =>
        messaging()
          .subscribeToTopic(slug)
          .then(() => {
            console.log('Subscribed to topic:', slug);
            return slug;
          })
          .catch((e) => {
            console.error('Failed to subscribe to topic:', slug, e);
            throw e;
          }),
      ),
    );

    // Log summary of results
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    if (successful > 0) {
      console.log(`Subscribed to ${successful}/${topicsToSubscribe.length} topics`);
    }

    // Save subscriptions to storage
    storage.set(TOPICS_STORAGE_KEY, JSON.stringify(allTopicSlugs));
  } catch (error) {
    console.error('Failed to subscribe to all default topics:', error);
  }
};

/**
 * Unsubscribe from all FCM topics EXCEPT hidden topics (hidden: 1).
 * Used when user logs in (to prevent duplicate notifications).
 * Logged-in users receive notifications via database tokens, not FCM topics.
 * Hidden topics are important system topics that should remain subscribed.
 */
export const unsubscribeFromAllTopicsExceptHidden = async (): Promise<void> => {
  try {
    // Fetch all available topics to determine which are hidden
    const topics = await fetchPushCategories();
    const hiddenTopicSlugs = topics.filter((t) => !!t.hidden).map((t) => t.slug);

    const topicsJson = storage.getString(TOPICS_STORAGE_KEY);
    let currentSubscriptions: string[] = [];

    if (topicsJson) {
      currentSubscriptions = JSON.parse(topicsJson);
    } else {
      // If no stored subscriptions, use all topic slugs
      currentSubscriptions = topics.map((t) => t.slug);
    }

    // Filter topics to unsubscribe from (all except hidden)
    const topicsToUnsubscribe = currentSubscriptions.filter((slug) => !hiddenTopicSlugs.includes(slug));

    // Unsubscribe from topics in parallel
    const results = await Promise.allSettled(
      topicsToUnsubscribe.map((slug) =>
        messaging()
          .unsubscribeFromTopic(slug)
          .then(() => {
            console.log('Unsubscribed from topic:', slug);
            return slug;
          })
          .catch((e) => {
            console.error('Failed to unsubscribe from topic:', slug, e);
            throw e;
          }),
      ),
    );

    // Log summary of results
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    if (successful > 0) {
      console.log(`Unsubscribed from ${successful}/${topicsToUnsubscribe.length} topics`);
    }

    // Save only hidden topics as subscribed
    storage.set(TOPICS_STORAGE_KEY, JSON.stringify(hiddenTopicSlugs));
  } catch (error) {
    console.error('Failed to unsubscribe from topics:', error);
  }
};

/**
 * Subscribe to a single FCM topic.
 * Updates the stored subscriptions list to include the new topic.
 */
export const subscribeToTopic = async (slug: string): Promise<boolean> => {
  try {
    await messaging().subscribeToTopic(slug);
    console.log('Subscribed to topic:', slug);

    // Update storage to include this topic
    const topicsJson = storage.getString(TOPICS_STORAGE_KEY);
    let currentSubscriptions: string[] = topicsJson ? JSON.parse(topicsJson) : [];

    if (!currentSubscriptions.includes(slug)) {
      currentSubscriptions.push(slug);
      storage.set(TOPICS_STORAGE_KEY, JSON.stringify(currentSubscriptions));
    }

    return true;
  } catch (error) {
    console.error('Failed to subscribe to topic:', slug, error);
    return false;
  }
};

/**
 * Unsubscribe from a single FCM topic.
 * Updates the stored subscriptions list to remove the topic.
 */
export const unsubscribeFromTopic = async (slug: string): Promise<boolean> => {
  try {
    await messaging().unsubscribeFromTopic(slug);
    console.log('Unsubscribed from topic:', slug);

    // Update storage to remove this topic
    const topicsJson = storage.getString(TOPICS_STORAGE_KEY);
    let currentSubscriptions: string[] = topicsJson ? JSON.parse(topicsJson) : [];

    currentSubscriptions = currentSubscriptions.filter((s) => s !== slug);
    storage.set(TOPICS_STORAGE_KEY, JSON.stringify(currentSubscriptions));

    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from topic:', slug, error);
    return false;
  }
};

/**
 * Get the list of currently subscribed topic slugs from storage.
 */
export const getSubscribedTopics = (): string[] => {
  const topicsJson = storage.getString(TOPICS_STORAGE_KEY);
  return topicsJson ? JSON.parse(topicsJson) : [];
};

/**
 * Check if a specific topic slug is currently subscribed.
 */
export const isTopicSubscribed = (slug: string): boolean => {
  const subscribedTopics = getSubscribedTopics();
  return subscribedTopics.includes(slug);
};
