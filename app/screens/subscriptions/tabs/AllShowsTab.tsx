import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {ShowListItem, useShowList} from '../../../api/hooks/useShowList';
import {useUserSubscriptions, useUpdateSubscription} from '../../../api/hooks/usePushNotifications';
import SubscriptionRow from '../components/SubscriptionRow';

type TypeFilter = 'all' | 'mediateka' | 'radioteka';

type ListRow =
  | {type: 'header'; title: string; showType: 'mediateka' | 'radioteka'}
  | {type: 'item'; item: ShowListItem; showType: 'mediateka' | 'radioteka'};

const TYPE_FILTER_OPTIONS: {label: string; value: TypeFilter}[] = [
  {label: 'Visi', value: 'all'},
  {label: 'Video', value: 'mediateka'},
  {label: 'Audio', value: 'radioteka'},
];

const AllShowsTab: React.FC = () => {
  const {colors, dark} = useTheme();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('Visi');

  const {data: mediatekaData, isLoading: mediatekaLoading} = useShowList('mediateka');
  const {data: radioData, isLoading: radioLoading} = useShowList('radioteka');
  const {data: subscriptions} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  const isLoading = mediatekaLoading || radioLoading;

  const isSubscribed = (itemId: number): boolean => {
    return subscriptions?.some((s) => s.subscription_key === `category-${itemId}` && s.is_active) ?? false;
  };

  const listData = useMemo((): ListRow[] => {
    const rows: ListRow[] = [];

    const matchesLetter = (title: string): boolean => {
      if (selectedLetter === 'Visi') return true;
      if (selectedLetter === '0-9') return /^\d/.test(title);
      return title.toUpperCase().startsWith(selectedLetter);
    };

    const addSections = (sections: typeof mediatekaData, showType: 'mediateka' | 'radioteka') => {
      if (!sections) return;
      for (const section of sections) {
        const items = section.items.filter((item) => item.curr === 1 && matchesLetter(item.title));
        if (items.length > 0) {
          if (selectedLetter === 'Visi') {
            rows.push({type: 'header', title: section.letter.l, showType});
          }
          for (const item of items) {
            rows.push({type: 'item', item, showType});
          }
        }
      }
    };

    if (typeFilter === 'all' || typeFilter === 'mediateka') {
      addSections(mediatekaData, 'mediateka');
    }
    if (typeFilter === 'all' || typeFilter === 'radioteka') {
      addSections(radioData, 'radioteka');
    }

    return rows;
  }, [mediatekaData, radioData, typeFilter, selectedLetter]);

  const letters = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = ['Visi', '0-9'];
    const sources = [
      ...(typeFilter !== 'radioteka' ? mediatekaData ?? [] : []),
      ...(typeFilter !== 'mediateka' ? radioData ?? [] : []),
    ];
    for (const section of sources) {
      const l = section.letter.l;
      if (!seen.has(l) && !/^\d/.test(l) && section.items.some((i) => i.curr === 1)) {
        seen.add(l);
        result.push(l);
      }
    }
    return result;
  }, [mediatekaData, radioData, typeFilter]);

  const headerIndices = useMemo(() => {
    return listData.reduce<number[]>((acc, row, i) => {
      if (row.type === 'header') acc.push(i);
      return acc;
    }, []);
  }, [listData]);

  const renderItem = useCallback(
    ({item}: {item: ListRow}) => {
      if (item.type === 'header') {
        return (
          <View style={[styles.sectionHeader, {backgroundColor: colors.background}]}>
            <Text
              style={[styles.sectionHeaderText, {color: colors.mediatekaPlayButton}]}
              fontFamily="SourceSansPro-SemiBold">
              {item.title}
            </Text>
          </View>
        );
      }
      return (
        <SubscriptionRow
          title={item.item.title}
          isSubscribed={isSubscribed(item.item.id)}
          categoryId={item.item.id}
          type={item.showType}
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
    [subscriptions, updateSubscriptionMutation, colors.background],
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
      {/* Type filter row */}
      <View style={[styles.filterRow, {borderBottomColor: colors.listSeparator}]}>
        <Text style={[styles.filterLabel, {color: colors.textSecondary}]}>{'Filtruoti pagal:'}</Text>
        <View style={styles.filterButtons}>
          {TYPE_FILTER_OPTIONS.map((opt) => (
            <TouchableDebounce
              key={opt.value}
              onPress={() => setTypeFilter(opt.value)}
              style={[
                styles.filterPill,
                {borderColor: colors.buttonBorder},
                typeFilter === opt.value && {backgroundColor: colors.mediatekaPlayButton},
              ]}>
              <Text
                style={[
                  styles.filterPillText,
                  {color: typeFilter === opt.value ? colors.onPrimary : colors.primary},
                ]}>
                {opt.label}
              </Text>
            </TouchableDebounce>
          ))}
        </View>
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
              <Text style={[styles.letterPillText]}>{letter}</Text>
            </TouchableDebounce>
          ))}
        </ScrollView>
      </View>

      <View style={{flex: 1}}>
        <Text style={[styles.caption, {color: colors.textSecondary, backgroundColor: colors.slugBackground}]}>
          {'Pasirinkite temas, kurias norite sekti'}
        </Text>

        <FlatList
          data={listData}
          keyExtractor={(item) =>
            item.type === 'header'
              ? `header-${item.showType}-${item.title}`
              : `item-${item.item.id}-${item.showType}`
          }
          renderItem={renderItem}
          stickyHeaderIndices={headerIndices}
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

export default AllShowsTab;

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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  filterPill: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillText: {
    fontSize: 14,
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    fontSize: 20,
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
