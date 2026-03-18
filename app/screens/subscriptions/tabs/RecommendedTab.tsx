import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Text} from '../../../components';
import {useTheme} from '../../../Theme';
import {useHistoryCategories} from '../../../api/hooks/useHistoryCategories';
import {useUserSubscriptions, useUpdateSubscription} from '../../../api/hooks/usePushNotifications';
import SubscriptionRow from '../components/SubscriptionRow';

const RecommendedTab: React.FC = () => {
  const {colors} = useTheme();

  const {categories, isLoading: categoriesLoading} = useHistoryCategories(20);
  const {data: subscriptions, isLoading: subsLoading} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  const isLoading = categoriesLoading || subsLoading;

  const isSubscribed = (categoryId: number): boolean => {
    return (
      subscriptions?.some((s) => s.subscription_key === `category-${categoryId}` && s.is_active) ?? false
    );
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
      data={categories}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <Text
          style={[styles.caption, {color: colors.textSecondary, backgroundColor: colors.slugBackground}]}
          fontFamily="SourceSansPro-SemiBold">
          {'Pagal jūsų pasirinkimus jums gali patikti šios temos'}
        </Text>
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            {'Nėra rekomendacijų. Peržiūrėkite daugiau vaizdo ar garso įrašų.'}
          </Text>
        </View>
      }
      renderItem={({item}) => (
        <SubscriptionRow
          title={item.title}
          isSubscribed={isSubscribed(item.id)}
          categoryId={item.id}
          latestArticleDate={item.latestArticleDate}
          onToggle={(value) => {
            updateSubscriptionMutation.mutate({
              name: item.title,
              subscription_key: `category-${item.id}`,
              is_active: value,
            });
          }}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default RecommendedTab;

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
