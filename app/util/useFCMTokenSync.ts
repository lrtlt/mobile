import {useEffect, useRef} from 'react';
import {getMessaging, onTokenRefresh, getToken} from '@react-native-firebase/messaging';
import {useAuth0} from 'react-native-auth0';
import {useRegisterDeviceToken} from '../api/hooks/usePushNotifications';
import {subscribeToAllDefaultTopics} from './useFirebaseTopicSubscription';
import {MMKV} from 'react-native-mmkv';

// MMKV storage for FCM token sync data
const storage = new MMKV({
  id: 'fcm-token-sync',
});

// Storage keys
const FCM_INITIAL_SYNC_COMPLETED = 'fcm_initial_sync_completed';

// Helper functions for storage
const setInitialSyncCompleted = (userId: string) => {
  storage.set(`${FCM_INITIAL_SYNC_COMPLETED}_${userId}`, true);
};

const getInitialSyncCompleted = (userId: string): boolean => {
  return storage.getBoolean(`${FCM_INITIAL_SYNC_COMPLETED}_${userId}`) || false;
};

const clearUserData = (userId: string) => {
  storage.delete(`${FCM_INITIAL_SYNC_COMPLETED}_${userId}`);
};

/**
 * Hook to sync FCM token with backend server.
 * Handles both initial token registration and token refresh events.
 * Only syncs when user is logged in.
 * When user logs in, unsubscribes from FCM topics (to prevent duplicate notifications).
 */
const useFCMTokenSync = () => {
  const {user, isLoading} = useAuth0();
  const {mutateAsync: registerToken} = useRegisterDeviceToken();

  const previousUserRef = useRef<typeof user>(undefined);

  // Handle login flow and ongoing token registration for logged-in users
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Check if this is a new login (user changed from null/undefined to logged in)
    const isNewLogin = !previousUserRef.current && user;
    previousUserRef.current = user;

    if (!user) {
      subscribeToAllDefaultTopics();
      return;
    }

    const syncToken = async () => {
      const token = await getToken(getMessaging());
      if (!token) {
        return;
      }

      const initialSyncCompleted = getInitialSyncCompleted(user.id);

      // Always try to register token when user is logged in
      await registerToken(token, {
        onSuccess: () => console.log('FCM token registered with backend'),
        onError: (error) => console.error('Failed to register FCM token:', error),
      });

      // Only do topic management on new login
      if (isNewLogin && !initialSyncCompleted) {
        console.log('Login: Unsubscribing from FCM topics (keeping hidden topics)...');
        // await unsubscribeFromAllTopicsExceptHidden();
        // await syncSubscriptions();
        setInitialSyncCompleted(user.id);
      }
    };

    syncToken();
  }, [user, isLoading, registerToken]);

  // Listen for token refresh and sync with backend
  useEffect(() => {
    const unsubscribe = onTokenRefresh(getMessaging(), (newToken) => {
      console.log('FCM token refreshed:', newToken);

      // Only register if user is logged in
      if (!isLoading && user) {
        registerToken(newToken, {
          onSuccess: () => console.log('Refreshed FCM token registered with backend'),
          onError: (error) => console.error('Failed to register refreshed FCM token:', error),
        });
      }
    });

    return () => unsubscribe();
  }, [user, isLoading, registerToken]);
};

/**
 * Get the FCM token from the messaging module.
 * Useful for logout flow to disassociate token from user.
 */
export const getFcmToken = async (): Promise<string | undefined> => {
  try {
    return await getToken(getMessaging());
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return undefined;
  }
};

/**
 * Clear FCM sync data for a user.
 * Should be called during logout to reset sync state.
 */
export const clearFCMUserData = (userId: string) => {
  clearUserData(userId);
};

export default useFCMTokenSync;
