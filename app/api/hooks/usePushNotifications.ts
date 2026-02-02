import {useMutation, useQuery} from '@tanstack/react-query';
import * as HttpClient from '../HttpClient';
import queryClient from '../../../AppQueryClient';
import {Platform} from 'react-native';

const SUBSCRIPTIONS_QUERY_KEY = 'userSubscriptions';

export type UserSubscription = {
  subscription_key: string;
  is_active: boolean;
  name?: string;
};

type SubscriptionsResponse = {
  subscriptions: UserSubscription[];
};

type RegisterTokenRequest = {
  fcm_token: string;
  platform: 'ios' | 'android';
};

type UpdateSubscriptionRequest = {
  name: string;
  subscription_key: string;
  is_active: boolean;
};

/**
 * Register or update FCM device token with the backend.
 * Should be called on app launch and token refresh.
 */
export const useRegisterDeviceToken = () =>
  useMutation({
    mutationFn: async (fcmToken: string) => {
      const request: RegisterTokenRequest = {
        fcm_token: fcmToken,
        platform: Platform.OS as 'ios' | 'android',
      };
      const response = await HttpClient.post<{}>(
        'https://www.lrt.lt/servisai/dev-authrz/api/v1/devices/token',
        request,
      );
      return response.data;
    },
    retry: 3,
  });

/**
 * Disassociate device token from user on logout.
 * Sets user_id to NULL but keeps the token active for guest notifications.
 */
export const useDisassociateDeviceToken = () =>
  useMutation({
    mutationFn: async (fcmToken: string) => {
      const response = await HttpClient.del<{}>(
        'https://www.lrt.lt/servisai/dev-authrz/api/v1/devices/token',
        {
          data: {fcm_token: fcmToken},
        },
      );
      return response.data;
    },
    retry: 2,
  });

/**
 * Sync default subscriptions on login.
 * Creates missing subscription records without overriding existing preferences.
 */
export const useSyncSubscriptions = () =>
  useMutation({
    mutationFn: async () => {
      const response = await HttpClient.post<{}>(
        'https://www.lrt.lt/servisai/dev-authrz/api/v1/users/subscriptions/sync',
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [SUBSCRIPTIONS_QUERY_KEY]});
    },
    retry: 2,
  });

/**
 * Get user's subscription preferences from the backend.
 * Only for logged-in users.
 */
export const useUserSubscriptions = (enabled = true) =>
  useQuery({
    queryKey: [SUBSCRIPTIONS_QUERY_KEY],
    queryFn: async ({signal}) => {
      const response = await HttpClient.get<SubscriptionsResponse>(
        'https://www.lrt.lt/servisai/dev-authrz/api/v1/users/subscriptions',
        {
          signal,
        },
      );
      const sorted = response.subscriptions.sort((a, b) =>
        a.subscription_key.localeCompare(b.subscription_key),
      );

      return sorted;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
    enabled,
  });

/**
 * Check if user is subscribed to a specific notification category.
 * Returns true if the subscription exists and is active, false otherwise.
 */
export const useIsSubscribed = (category_id: number, enabled: boolean): boolean => {
  const {data: subscriptions} = useUserSubscriptions(!!category_id && enabled);

  if (!subscriptions) {
    return false;
  }

  const subscription_key = `category-${category_id}`;

  const subscription = subscriptions.find((sub) => sub.subscription_key === subscription_key);
  return subscription?.is_active ?? false;
};

/**
 * Update a single subscription preference.
 * Used when user toggles a notification category on/off.
 */
export const useUpdateSubscription = () =>
  useMutation({
    mutationFn: async (request: UpdateSubscriptionRequest) => {
      const response = await HttpClient.put<{}>(
        'https://www.lrt.lt/servisai/dev-authrz/api/v1/users/subscriptions',
        request,
      );
      return response.data;
    },
    onMutate: async (request) => {
      await queryClient.cancelQueries({queryKey: [SUBSCRIPTIONS_QUERY_KEY]});
      const previousData = queryClient.getQueryData<UserSubscription[]>([SUBSCRIPTIONS_QUERY_KEY]);

      // Optimistic update
      queryClient.setQueryData<UserSubscription[]>([SUBSCRIPTIONS_QUERY_KEY], (old) => {
        if (!old) return old;
        return old.map((sub) =>
          sub.subscription_key === request.subscription_key ? {...sub, is_active: request.is_active} : sub,
        );
      });

      return {previousData};
    },
    onError: (_error, _request, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData([SUBSCRIPTIONS_QUERY_KEY], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [SUBSCRIPTIONS_QUERY_KEY]});
    },
    retry: 2,
  });
