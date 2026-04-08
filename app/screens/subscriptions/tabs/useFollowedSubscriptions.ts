import {useEffect, useMemo, useState} from 'react';
import {useUserSubscriptions, useUpdateSubscription} from '../../../api/hooks/usePushNotifications';
import {useHistoryCategories} from '../../../api/hooks/useHistoryCategories';
import {useShowList} from '../../../api/hooks/useShowList';

export type FollowedListItem = {
  key: string;
  name: string;
  categoryId?: number;
  latestArticleDate?: string;
  isRecommended: boolean;
  isActive: boolean;
  type?: 'mediateka' | 'radioteka';
};

export const useFollowedSubscriptions = () => {
  const {data: subscriptions, isLoading: subsLoading} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  const {categories: recommendedCategories, isLoading: recLoading} = useHistoryCategories(5);
  const {data: mediatekaData} = useShowList('mediateka');
  const {data: radioData} = useShowList('radioteka');

  const isLoading = subsLoading || recLoading;

  // Snapshot initial keys so unfollowed items stay visible during the session
  const [initialKeys] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (initialKeys.size === 0 && subscriptions) {
      for (const s of subscriptions.filter((s) => s.is_active)) {
        initialKeys.add(s.subscription_key);
      }
    }
  }, [subscriptions, initialKeys]);

  const recommendedIds = useMemo(() => {
    return new Set(recommendedCategories.map((c) => c.id));
  }, [recommendedCategories]);

  const categoryTypeMap = useMemo(() => {
    const map = new Map<number, 'mediateka' | 'radioteka'>();
    for (const section of mediatekaData ?? []) {
      for (const item of section.items) {
        map.set(item.id, 'mediateka');
      }
    }
    for (const section of radioData ?? []) {
      for (const item of section.items) {
        map.set(item.id, 'radioteka');
      }
    }
    return map;
  }, [mediatekaData, radioData]);

  const activeKeys = useMemo(() => {
    return new Set(subscriptions?.filter((s) => s.is_active).map((s) => s.subscription_key));
  }, [subscriptions]);

  const listData = useMemo((): FollowedListItem[] => {
    const items: FollowedListItem[] = [];
    const addedKeys = new Set<string>();

    // Show all subscriptions that are currently active OR were active on mount
    for (const sub of subscriptions ?? []) {
      if (!sub.is_active && !initialKeys.has(sub.subscription_key)) continue;
      const id = parseInt(sub.subscription_key.replace('category-', ''), 10);
      addedKeys.add(sub.subscription_key);
      items.push({
        key: sub.subscription_key,
        name: sub.name || sub.subscription_key,
        categoryId: isNaN(id) ? undefined : id,
        isRecommended: !isNaN(id) && recommendedIds.has(id),
        isActive: activeKeys.has(sub.subscription_key),
        type: isNaN(id) ? undefined : categoryTypeMap.get(id),
      });
    }

    // Add recommended items not already in the list
    for (const cat of recommendedCategories) {
      const key = `category-${cat.id}`;
      if (addedKeys.has(key)) continue;
      items.push({
        key,
        name: cat.title,
        categoryId: cat.id,
        latestArticleDate: cat.latestArticleDate,
        isRecommended: true,
        isActive: activeKeys.has(key),
        type: categoryTypeMap.get(cat.id),
      });
    }

    items.sort((a, b) => a.name.localeCompare(b.name, 'lt'));

    return items;
  }, [subscriptions, initialKeys, recommendedCategories, recommendedIds, categoryTypeMap, activeKeys]);

  return {
    listData,
    isLoading,
    updateSubscription: updateSubscriptionMutation.mutate,
  };
};
