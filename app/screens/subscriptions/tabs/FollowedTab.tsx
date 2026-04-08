import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Text} from '../../../components';
import {useTheme} from '../../../Theme';
import SubscriptionRow from '../components/SubscriptionRow';
import {useFollowedSubscriptions} from './useFollowedSubscriptions';

const FollowedTab: React.FC = () => {
  const {colors} = useTheme();
  const {listData, isLoading, updateSubscription} = useFollowedSubscriptions();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={listData}
      keyExtractor={(item) => item.key}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>{'Nesekate jokių laidų.'}</Text>
        </View>
      }
      renderItem={({item}) => (
        <SubscriptionRow
          title={item.name}
          isSubscribed={item.isActive}
          categoryId={item.categoryId}
          type={item.type}
          isRecommended={item.isRecommended}
          onToggle={(value) => {
            updateSubscription({
              name: item.name,
              subscription_key: item.key,
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
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
});
