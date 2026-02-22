import React, {useCallback, useMemo, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Animated, ScrollViewProps} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {useTheme, themeLight} from '../../Theme';
import Text from '../../components/text/Text';
import {useShowList, ShowListItem} from '../../api/hooks/useShowList';
import {fetchCategoryPlaylist} from '../../api';
import Snackbar from '../../components/snackbar/SnackBar';
import TouchableDebounce from '../../components/touchableDebounce/TouchableDebounce';
import CheckBox from '../../components/checkBox/CheckBox';
import {AnimatedAppBar} from '../../components';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import SearchBar from '../search/SearchBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigateArticle} from '../../util/NavigationUtils';

interface Props {
  route: RouteProp<MainStackParamList, 'ShowList'>;
  navigation: StackNavigationProp<MainStackParamList, 'ShowList'>;
}

type ListRow = {type: 'header'; title: string} | {type: 'item'; item: ShowListItem};

const ShowListScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors, strings} = useTheme();
  const [currentOnly, setCurrentOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {type} = route.params;
  const {data, isLoading, error} = useShowList(type);

  const {fullHeight, subHeaderHeight} = useAppBarHeight();
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, subHeaderHeight * 2);
  const translateY = diffClamp.interpolate({
    inputRange: [0, subHeaderHeight, subHeaderHeight * 2],
    outputRange: [0, 0, -subHeaderHeight],
  });

  const onScroll: ScrollViewProps['onScroll'] = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 0) scrollY.setValue(y);
  };

  const listData = useMemo((): ListRow[] => {
    if (!data) {
      return [];
    }
    const rows: ListRow[] = [];
    for (const section of data) {
      let items = currentOnly ? section.items.filter((item) => item.curr === 1) : section.items;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        items = items.filter((item) => item.title.toLowerCase().includes(q));
      }
      if (items.length > 0) {
        rows.push({type: 'header', title: section.letter.l});
        for (const item of items) {
          rows.push({type: 'item', item});
        }
      }
    }
    return rows;
  }, [data, currentOnly, searchQuery]);

  const handleItemPress = useCallback(
    (item: ShowListItem) => {
      setLoading(true);
      fetchCategoryPlaylist(item.id)
        .then((response) => {
          const article = response.articles?.[0];
          if (article) {
            navigateArticle(navigation, article);
          }
        })
        .catch(() => {
          setErrorVisible(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: ListRow}) => {
      if (item.type === 'header') {
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText} fontFamily="PlayfairDisplay-Regular">
              {item.title}
            </Text>
          </View>
        );
      }
      return (
        <TouchableDebounce onPress={() => handleItemPress(item.item)} style={styles.item}>
          <Text style={styles.itemText}>{item.item.title}</Text>
        </TouchableDebounce>
      );
    },
    [handleItemPress],
  );

  let content;
  if (isLoading) {
    content = (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else if (error) {
    content = (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, {color: colors.text}]}>{error.message || strings.error_common}</Text>
      </View>
    );
  } else {
    content = (
      <FlashList
        onScroll={onScroll}
        scrollEventThrottle={1}
        data={listData}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        getItemType={(item) => item.type}
        keyExtractor={(item) => (item.type === 'header' ? `header-${item.title}` : String(item.item.id))}
        stickyHeaderIndices={listData.reduce<number[]>((acc, row, i) => {
          if (row.type === 'header') {
            acc.push(i + 1);
          }
          return acc;
        }, [])}
        contentContainerStyle={{
          paddingTop: fullHeight + subHeaderHeight,
          paddingBottom: 24,
        }}
        ListHeaderComponent={
          <View style={styles.filterRow}>
            <CheckBox
              value={currentOnly}
              onValueChange={setCurrentOnly}
              label="Rodyti tik šio sezono laidas"
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.errorText, {color: colors.text}]}>Nieko nerasta</Text>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedAppBar
        onBackPress={() => navigation.goBack()}
        translateY={translateY}
        headerTitle={type == 'mediateka' ? 'Mediatekos laidų sąrašas' : 'Radiotekos laidų sąrašas'}
        subHeader={
          <SearchBar
            onQueryChange={setSearchQuery}
            onValueChange={setSearchQuery}
            subHeaderHeight={subHeaderHeight}
          />
        }
      />
      <SafeAreaView edges={['bottom']} style={styles.container}>
        {content}
      </SafeAreaView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {errorVisible && (
        <Snackbar
          message={strings.error_common}
          backgroundColor={themeLight.colors.textError}
          duration={2000}
          onDismiss={() => setErrorVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  filterText: {
    fontSize: 15,
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 32,
    textTransform: 'uppercase',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16.5,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(ShowListScreen);
