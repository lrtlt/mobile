import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Text} from '../../../components';
import {useTheme} from '../../../Theme';
import {
  UserSubscription,
  useUserSubscriptions,
  useUpdateSubscription,
} from '../../../api/hooks/usePushNotifications';
import SubscriptionRow from '../components/SubscriptionRow';

const FollowedTab: React.FC = () => {
  const {colors} = useTheme();

  const {data: subscriptions, isLoading} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  // Snapshot on mount: capture subscription list once, keep showing it even after toggles
  const [snapshot, setSnapshot] = useState<UserSubscription[] | null>(null);
  useEffect(() => {
    if (snapshot === null && subscriptions) {
      setSnapshot(subscriptions.filter((s) => s.is_active));
    }
  }, [subscriptions, snapshot]);

  const getIsActive = (key: string): boolean => {
    return subscriptions?.some((s) => s.subscription_key === key && s.is_active) ?? false;
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={snapshot ?? []}
      keyExtractor={(item) => item.subscription_key}
      ListHeaderComponent={
        <Text
          style={[styles.caption, {color: colors.textSecondary, backgroundColor: colors.slugBackground}]}
          fontFamily="SourceSansPro-SemiBold">
          {'Jūsų sekamos temos'}
        </Text>
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>{'Nesekate jokių laidų.'}</Text>
        </View>
      }
      renderItem={({item}) => (
        <SubscriptionRow
          title={item.name || item.subscription_key}
          isSubscribed={getIsActive(item.subscription_key)}
          categoryId={parseInt(item.subscription_key.replace('category-', ''), 10) || undefined}
          onToggle={(value) => {
            updateSubscriptionMutation.mutate({
              name: item.name || item.subscription_key,
              subscription_key: item.subscription_key,
              is_active: value,
            });
          }}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default FollowedTab;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  caption: {
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 12,
    marginHorizontal: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
});
