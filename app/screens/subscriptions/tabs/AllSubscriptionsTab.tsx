import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, View} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {ShowListItem, useShowList} from '../../../api/hooks/useShowList';
import {useUserSubscriptions, useUpdateSubscription} from '../../../api/hooks/usePushNotifications';
import {
  useDefaultTopics,
  useSubscribeToTopic,
  useUnsubscribeFromTopic,
} from '../../../api/hooks/useNotificationTopics';
import {useHistoryCategories} from '../../../api/hooks/useHistoryCategories';
import SubscriptionRow from '../components/SubscriptionRow';
import SearchBar from '../../search/SearchBar';
import {IconChevronLeft} from '../../../components/svg';

type TypeFilter = 'all' | 'mediateka' | 'radioteka' | 'rubrikos';

type ListRow =
  | {kind: 'show'; item: ShowListItem; showType: 'mediateka' | 'radioteka'}
  | {kind: 'topic'; slug: string; name: string; isActive: boolean}
  | {kind: 'recommendation'; categoryId: number; name: string; latestArticleDate?: string; isActive: boolean; showType?: 'mediateka' | 'radioteka'};

const TYPE_FILTER_OPTIONS: {label: string; value: TypeFilter}[] = [
  {label: 'Visi', value: 'all'},
  {label: 'Video', value: 'mediateka'},
  {label: 'Audio', value: 'radioteka'},
  {label: 'Rubrikos', value: 'rubrikos'},
];

const AllSubscriptionsTab: React.FC = () => {
  const {colors, dark} = useTheme();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('Visi');
  const [query, setQuery] = useState('');
  const [currentSeasonOnly, setCurrentSeasonOnly] = useState(true);
  const [typePickerVisible, setTypePickerVisible] = useState(false);

  const {data: mediatekaData, isLoading: mediatekaLoading} = useShowList('mediateka');
  const {data: radioData, isLoading: radioLoading} = useShowList('radioteka');
  const {data: subscriptions} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();
  const {data: topics, isLoading: topicsLoading} = useDefaultTopics();
  const subscribeToTopicMutation = useSubscribeToTopic();
  const unsubscribeFromTopicMutation = useUnsubscribeFromTopic();

  const initialSubscriptionKeysRef = useRef<string[] | null>(null);
  if (initialSubscriptionKeysRef.current === null && subscriptions) {
    initialSubscriptionKeysRef.current = subscriptions.filter((s) => s.is_active).map((s) => s.subscription_key);
  }
  const {categories: recommendedCategories, isLoading: recLoading} = useHistoryCategories(
    3,
    initialSubscriptionKeysRef.current ?? undefined,
  );

  const isLoading = mediatekaLoading || radioLoading || topicsLoading || recLoading;

  const isSubscribed = (itemId: number): boolean => {
    return subscriptions?.some((s) => s.subscription_key === `category-${itemId}` && s.is_active) ?? false;
  };

  const selectedTypeLabel = TYPE_FILTER_OPTIONS.find((o) => o.value === typeFilter)?.label ?? 'All';

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

  const listData = useMemo((): ListRow[] => {
    const rows: ListRow[] = [];
    const q = query.toLowerCase();

    const matchesLetter = (title: string): boolean => {
      if (selectedLetter === 'Visi') return true;
      if (selectedLetter === '0-9') return /^\d/.test(title);
      return title.toUpperCase().startsWith(selectedLetter);
    };

    // Add up to 3 recommendations at the top (only when no filters are active)
    if (selectedLetter === 'Visi' && !query && typeFilter === 'all') {
      for (const cat of recommendedCategories.slice(0, 3)) {
        rows.push({
          kind: 'recommendation',
          categoryId: cat.id,
          name: cat.title,
          latestArticleDate: cat.latestArticleDate,
          isActive: isSubscribed(cat.id),
          showType: categoryTypeMap.get(cat.id),
        });
      }
    }

    const addItems = (sections: typeof mediatekaData, showType: 'mediateka' | 'radioteka') => {
      if (!sections) return;
      for (const section of sections) {
        for (const item of section.items) {
          if (
            (!currentSeasonOnly || item.curr === 1) &&
            matchesLetter(item.title) &&
            (!query || item.title.toLowerCase().includes(q))
          ) {
            rows.push({kind: 'show', item, showType});
          }
        }
      }
    };

    if (typeFilter === 'all' || typeFilter === 'mediateka') {
      addItems(mediatekaData, 'mediateka');
    }
    if (typeFilter === 'all' || typeFilter === 'radioteka') {
      addItems(radioData, 'radioteka');
    }

    if (typeFilter === 'all' || typeFilter === 'rubrikos') {
      const visibleTopics = topics?.filter((t) => !t.hidden) ?? [];
      for (const topic of visibleTopics) {
        if (matchesLetter(topic.name) && (!query || topic.name.toLowerCase().includes(q))) {
          rows.push({kind: 'topic', slug: topic.slug, name: topic.name, isActive: !!topic.active});
        }
      }
    }

    return rows;
  }, [mediatekaData, radioData, topics, typeFilter, selectedLetter, query, currentSeasonOnly, recommendedCategories, categoryTypeMap, subscriptions]);

  const letters = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = ['Visi', '0-9'];
    const sources = [
      ...(typeFilter !== 'radioteka' && typeFilter !== 'rubrikos' ? mediatekaData ?? [] : []),
      ...(typeFilter !== 'mediateka' && typeFilter !== 'rubrikos' ? radioData ?? [] : []),
    ];
    for (const section of sources) {
      const l = section.letter.l;
      if (!seen.has(l) && !/^\d/.test(l) && section.items.some((i) => !currentSeasonOnly || i.curr === 1)) {
        seen.add(l);
        result.push(l);
      }
    }
    if (typeFilter === 'all' || typeFilter === 'rubrikos') {
      for (const topic of topics?.filter((t) => !t.hidden) ?? []) {
        const l = topic.name.charAt(0).toUpperCase();
        if (!seen.has(l) && !/^\d/.test(l)) {
          seen.add(l);
          result.push(l);
        }
      }
      result.sort((a, b) => {
        if (a === 'Visi') return -1;
        if (b === 'Visi') return 1;
        if (a === '0-9') return -1;
        if (b === '0-9') return 1;
        return a.localeCompare(b, 'lt');
      });
    }
    return result;
  }, [mediatekaData, radioData, topics, typeFilter, currentSeasonOnly]);

  const renderItem = useCallback(
    ({item}: {item: ListRow}) => {
      if (item.kind === 'topic') {
        return (
          <SubscriptionRow
            title={item.name}
            isSubscribed={item.isActive}
            type="rubrikos"
            onToggle={(value) => {
              if (value) {
                subscribeToTopicMutation.mutate(item.slug);
              } else {
                unsubscribeFromTopicMutation.mutate(item.slug);
              }
            }}
          />
        );
      }
      if (item.kind === 'recommendation') {
        return (
          <SubscriptionRow
            title={item.name}
            isSubscribed={item.isActive}
            categoryId={item.categoryId}
            type={item.showType}
            latestArticleDate={item.latestArticleDate}
            isRecommended
            onToggle={(value) => {
              updateSubscriptionMutation.mutate({
                name: item.name,
                subscription_key: `category-${item.categoryId}`,
                is_active: value,
              });
            }}
          />
        );
      }
      return (
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
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      subscriptions,
      updateSubscriptionMutation,
      subscribeToTopicMutation,
      unsubscribeFromTopicMutation,
      topics,
    ],
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
      {/* Search bar */}
      <View style={{height: 56}}>
        <SearchBar subHeaderHeight={0} onQueryChange={setQuery} onValueChange={setQuery} />
      </View>

      {/* Letter filter bar */}
      <View style={[styles.letterBar, {borderBottomColor: colors.listSeparator}]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.letterBarContent}>
          {letters.map((letter) => (
            <TouchableDebounce
              key={letter}
              onPress={() => setSelectedLetter(letter)}
              style={[
                styles.letterPill,
                {
                  backgroundColor:
                    selectedLetter === letter
                      ? dark
                        ? colors.slugBackground
                        : colors.darkGreyBackground
                      : dark
                      ? colors.radiotekaBackground
                      : colors.lightGreyBackground,
                },
              ]}>
              <Text style={styles.letterPillText}>{letter}</Text>
            </TouchableDebounce>
          ))}
        </ScrollView>
      </View>

      {/* Type filter & current season toggle */}
      <View style={[styles.filterRow, {borderBottomColor: colors.listSeparator}]}>
        <View style={styles.filterLeft}>
          <Text style={[styles.filterLabel, {color: colors.textSecondary}]}>{'Tipas'}</Text>
          <TouchableDebounce
            onPress={() => setTypePickerVisible(true)}
            style={[styles.dropdown, {borderColor: colors.buttonBorder}]}>
            <Text style={[styles.dropdownText, {color: colors.text}]}>{selectedTypeLabel}</Text>
            <View
              style={{
                transform: [{rotate: typePickerVisible ? '-90deg' : '90deg'}],
              }}>
              <IconChevronLeft size={styles.dropdownText.fontSize} color={colors.text} />
            </View>
          </TouchableDebounce>
        </View>
        {typeFilter != 'rubrikos' && (
          <View style={styles.filterRight}>
            <Text style={[styles.filterLabel, {color: colors.textSecondary}]}>{'Šio sezono laidos'}</Text>
            <Switch
              thumbColor={dark ? colors.text : colors.greyBackground}
              trackColor={{
                true: dark ? colors.textDisbled : colors.iconActive,
              }}
              onValueChange={setCurrentSeasonOnly}
              value={currentSeasonOnly}
            />
          </View>
        )}
      </View>

      {/* Type picker modal */}
      <Modal visible={typePickerVisible} transparent animationType="fade">
        <TouchableDebounce style={styles.modalOverlay} onPress={() => setTypePickerVisible(false)}>
          <View style={[styles.modalContent, {backgroundColor: colors.background}]}>
            {TYPE_FILTER_OPTIONS.map((opt) => (
              <TouchableDebounce
                key={opt.value}
                onPress={() => {
                  setTypeFilter(opt.value);
                  setTypePickerVisible(false);
                }}
                style={[
                  styles.modalOption,
                  {borderBottomColor: colors.listSeparator},
                  typeFilter === opt.value && {backgroundColor: colors.slugBackground},
                ]}>
                <Text style={[styles.modalOptionText, {color: colors.text}]}>{opt.label}</Text>
              </TouchableDebounce>
            ))}
          </View>
        </TouchableDebounce>
      </Modal>

      {/* List */}
      <View style={{flex: 1}}>
        <FlatList
          data={listData}
          keyExtractor={(item) =>
            item.kind === 'topic'
              ? `topic-${item.slug}`
              : item.kind === 'recommendation'
              ? `rec-${item.categoryId}`
              : `${item.item.id}-${item.showType}`
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={[styles.emptyText, {color: colors.textSecondary}]}>{'Nieko nerasta'}</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default AllSubscriptionsTab;

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
  letterBar: {
    height: 64,
  },
  letterBarContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
    alignItems: 'center',
  },
  letterPill: {
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 38,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterPillText: {
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 12,
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 8,
    minWidth: 200,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalOptionText: {
    fontSize: 16,
  },
});
