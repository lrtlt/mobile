import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Text} from '../../../components';
import {useTheme} from '../../../Theme';
import {ShowListItem, useShowList} from '../../../api/hooks/useShowList';
import {useUserSubscriptions, useUpdateSubscription} from '../../../api/hooks/usePushNotifications';
import SubscriptionRow from '../components/SubscriptionRow';
import SearchBar from '../../search/SearchBar';

type ShowEntry = {item: ShowListItem; showType: 'mediateka' | 'radioteka'};

const SearchTab: React.FC = () => {
  const {colors} = useTheme();
  const [query, setQuery] = useState('');

  const {data: mediatekaData, isLoading: mediatekaLoading} = useShowList('mediateka');
  const {data: radioData, isLoading: radioLoading} = useShowList('radioteka');
  const {data: subscriptions} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  const isLoading = mediatekaLoading || radioLoading;

  const isSubscribed = (itemId: number): boolean => {
    return subscriptions?.some((s) => s.subscription_key === `category-${itemId}` && s.is_active) ?? false;
  };

  const allShows = useMemo((): ShowEntry[] => {
    const result: ShowEntry[] = [];
    if (mediatekaData) {
      for (const section of mediatekaData) {
        for (const item of section.items.filter((i) => i.curr === 1)) {
          result.push({item, showType: 'mediateka'});
        }
      }
    }
    if (radioData) {
      for (const section of radioData) {
        for (const item of section.items.filter((i) => i.curr === 1)) {
          result.push({item, showType: 'radioteka'});
        }
      }
    }
    return result;
  }, [mediatekaData, radioData]);

  const filtered = useMemo((): ShowEntry[] => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allShows.filter((e) => e.item.title.toLowerCase().includes(q));
  }, [allShows, query]);

  const renderItem = useCallback(
    ({item}: {item: ShowEntry}) => (
      <SubscriptionRow
        title={item.item.title}
        isSubscribed={isSubscribed(item.item.id)}
        categoryId={item.item.id}
        type={item.showType}
        latestArticleDate={item.item.latest_article_date}
        onToggle={(value) => {
          updateSubscriptionMutation.mutate({
            name: item.item.title,
            subscription_key: `category-${item.item.id}`,
            is_active: value,
          });
        }}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subscriptions, updateSubscriptionMutation],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{height: 56}}>
        <SearchBar subHeaderHeight={0} onQueryChange={setQuery} onValueChange={setQuery} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(entry) => `${entry.item.id}-${entry.showType}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              {query ? 'Nieko nerasta' : 'Ieškokite laidų pavadinimo'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default SearchTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
