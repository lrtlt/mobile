import React, {useCallback, useEffect, useMemo} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import useGenre from '../main/tabScreen/radioteka/components/genres/useGenre';
import useGenreLatest from '../main/tabScreen/radioteka/components/genres/useGenreLatest';
import {themeLight, useTheme} from '../../Theme';
import Text from '../../components/text/Text';
import RadiotekaHorizontalCategoryList from '../main/tabScreen/radioteka/components/horizontal_list/RadiotekaHorizontalCategoryList';
import {RadiotekaListItem} from '../main/tabScreen/radioteka/components/horizontal_list/RadiotekaHorizontalList';
import {buildArticleImageUri, IMG_SIZE_L} from '../../util/ImageUtil';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../components/videoComponent/context/playlist/ArticlePlaylist';
import RadiotekaGenres from '../main/tabScreen/radioteka/components/genres/RadiotekaGenres';
import GenrePodcastGrid from './GenrePodcastGrid';
import {fetchartcilesByCategory} from '../../api';
import Snackbar from '../../components/snackbar/SnackBar';
import useNavigationAnalytics, {TrackingParams} from '../../util/useNavigationAnalytics';

interface Props {
  route: RouteProp<MainStackParamList, 'Genre'>;
  navigation: StackNavigationProp<MainStackParamList, 'Genre'>;
}

const GenreScreen: React.FC<React.PropsWithChildren<Props>> = ({route, navigation}) => {
  const [errorVisible, setErrorVisible] = React.useState(false);

  const {genreId, title} = route.params;
  const {colors, strings} = useTheme();

  const {setPlaylist} = useMediaPlayer();

  const {genre, isLoading: isGenreLoading, error: genreError} = useGenre(genreId);
  const {shows, isLoading: isShowsLoading, error: showsError} = useGenreLatest(genreId);

  useNavigationAnalytics(
    useMemo(() => {
      if (genre) {
        const params: TrackingParams = {
          viewId: `https://www.lrt.lt${genre.url}`,
          title: `${genre.title} - Radioteka - LRT`,
          sections: ['Radioteka'],
          authors: ['lrt.lt'],
        };
        return params;
      }
    }, [genre]),
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || '',
    });
  }, [navigation, title]);

  const handleShowPress = useCallback(
    (index: number) => {
      if (genre?.shows && genre.shows[index]) {
        fetchartcilesByCategory(genre.shows[index].id, 1)
          .then((response) => {
            if (response.items.length === 0) {
              setErrorVisible(true);
            } else {
              navigation.push('Podcast', {
                articleId: response.items[0].id,
              });
            }
          })
          .catch(() => setErrorVisible(true));
      }
    },
    [genre?.shows, navigation],
  );

  const handleShowPlayPress = useCallback(
    (index: number) => {
      if (shows) {
        setPlaylist(
          new ArticlePlaylist(
            shows.map((s) => s.id),
            index,
          ),
        );
      }
    },
    [shows, navigation],
  );

  const handleLatestPress = useCallback(
    (index: number) => {
      if (shows && shows[index]) {
        navigation.navigate('Podcast', {
          articleId: shows[index].id,
        });
      }
    },
    [shows, navigation],
  );

  const latestEpisodes = useMemo((): RadiotekaListItem[] => {
    return (
      shows?.map((a) => ({
        title: a.title,
        category: a.category_title,
        imageUrl: buildArticleImageUri(IMG_SIZE_L, a.photo) ?? '',
      })) ?? []
    );
  }, [shows]);

  if (isGenreLoading || isShowsLoading) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: colors.radiotekaBackground}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (genreError || showsError) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: colors.radiotekaBackground}]}>
        <Text style={styles.errorText}>
          {genreError?.message || showsError?.message || 'An error occurred'}
        </Text>
      </View>
    );
  }

  if (!genre) {
    return (
      <View style={[styles.container, styles.centered, {backgroundColor: colors.radiotekaBackground}]}>
        <Text style={styles.errorText}>Genre not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, {backgroundColor: colors.radiotekaBackground}]}
        contentContainerStyle={styles.scrollContainer}>
        <>
          <RadiotekaHorizontalCategoryList
            categoryTitle="NAUJAUSI ĮRAŠAI"
            items={latestEpisodes}
            onItemPress={handleLatestPress}
            onItemPlayPress={handleShowPlayPress}
            variation="full"
            separatorTop={false}
          />

          {genre.shows && genre.shows.length > 0 && (
            <View>
              <Text style={styles.sectionTitle} fontFamily="SourceSansPro-SemiBold">
                ŠIO ŽANRO LAIDOS
              </Text>
              <GenrePodcastGrid shows={genre.shows} onItemPress={handleShowPress} />
            </View>
          )}

          {genre.related && genre.related.length > 0 && (
            <RadiotekaGenres
              title={strings.related_genres}
              data={genre.related.map((g) => ({
                genre_id: g.id,
                genre_title: g.title,
                genre_url: g.url,
                genre_slug: '',
              }))}
            />
          )}
        </>
      </ScrollView>
      {errorVisible && (
        <Snackbar
          message={strings.error_common}
          backgroundColor={themeLight.colors.textError}
          duration={2000}
          onDismiss={() => setErrorVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 12,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  header: {
    padding: 16,
  },
  genreTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
  },
  relatedContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  relatedGenresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  relatedGenreButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  relatedGenreText: {
    fontSize: 13.5,
  },
});

export default React.memo(GenreScreen);
