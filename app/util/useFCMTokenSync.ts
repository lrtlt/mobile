import {useEffect, useRef} from 'react';
import {getMessaging, onTokenRefresh, getToken} from '@react-native-firebase/messaging';
import {useAuth0} from 'react-native-auth0';
import {useRegisterDeviceToken, useSyncSubscriptions} from '../api/hooks/usePushNotifications';
import {
  subscribeToAllDefaultTopics,
  unsubscribeFromAllTopicsExceptHidden,
} from './useFirebaseTopicSubscription';

/**
 * Hook to sync FCM token with backend server.
 * Handles both initial token registration and token refresh events.
 * Only syncs when user is logged in.
 * When user logs in, unsubscribes from FCM topics (to prevent duplicate notifications).
 */
const useFCMTokenSync = () => {
  const {user, isLoading} = useAuth0();
  const {mutate: registerToken} = useRegisterDeviceToken();
  const {mutate: syncSubscriptions} = useSyncSubscriptions();

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

      if (isNewLogin) {
        // New login: unsubscribe from topics and register token
        await Promise.allSettled([handleLoginPushNotifications(token, registerToken), syncSubscriptions()]);
      } else {
        // Already logged in: just register token
        registerToken(token, {
          onSuccess: () => console.log('FCM token registered with backend'),
          onError: (error) => console.error('Failed to register FCM token:', error),
        });
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
 * Handle push notification setup when user logs in.
 * Unsubscribes from FCM topics (guests use topics, logged-in users use tokens)
 * and registers the FCM token with the user's account.
 */
const handleLoginPushNotifications = async (
  fcmToken: string,
  registerToken: ReturnType<typeof useRegisterDeviceToken>['mutate'],
) => {
  console.log('Handling login push notification setup...');
  try {
    // Step 1: Re-register token with user_id (now that user is authenticated)
    console.log('Login: Registering FCM token with user...');
    registerToken(fcmToken, {
      onSuccess: () => console.log('FCM token registered with user'),
      onError: (error) => console.error('Failed to register FCM token with user:', error),
    });

    // Step 2: Unsubscribe from all FCM topics except hidden topics (hidden: 1)
    // This prevents duplicate notifications (guests get via topics, logged-in via tokens)
    console.log('Login: Unsubscribing from FCM topics (keeping hidden topics)...');
    await unsubscribeFromAllTopicsExceptHidden();
  } catch (error) {
    console.error('Error during login push notification setup:', error);
  }
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

export default useFCMTokenSync;
