import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {AdultContentWarning, ScreenError, ScreenLoader, VideoComponent} from '../../components';
import useArticleScreenState from '../article/useArticleScreenState';
import {useTheme} from '../../Theme';
import PodcastAbout from './about/PodcastAbout';
import {ArticleContentMedia} from '../../api/Types';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from '@d11/react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import PodcastEpisodeSelection from './episodeSelection/PodcastEpisodeSelection';
import useArticleAnalytics from '../article/useArticleAnalytics';
import RadiotekaGenres from '../main/tabScreen/radioteka/components/genres/RadiotekaGenres';
import {useCounterForArticle} from '../../util/useCounter';
import useArticleHeader from '../article/useArticleHeader_v2';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import VodcastRecommendations from './recommendations/VodcastRecommendations';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Vodcast'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Vodcast'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const VodcastScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {articleId} = route.params;

  const [{article, category_info, loadingState}, acceptAdultContent] = useArticleScreenState(articleId);

  const currentSeason = category_info?.season_info?.find(
    (season) => season.lrt_season_id === (article as ArticleContentMedia).lrt_season_id,
  );

  const {appBar, snackbar, onScroll: _} = useArticleHeader(article);

  const theme = useTheme();
  const {strings, colors} = theme;

  useArticleAnalytics({article});
  useCounterForArticle(article);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: article?.category_title ?? '',
    });
  }, [article, navigation]);

  const {bottom} = useSafeAreaInsets();
  const appBarHeight = useAppBarHeight();

  const adultContentAcceptHandler = useCallback(() => {
    acceptAdultContent(true);
  }, [acceptAdultContent]);

  const adultContentDeclineHandler = useCallback(() => {
    acceptAdultContent(false);
  }, [acceptAdultContent]);

  switch (loadingState) {
    case 'loading': {
      return (
        <View style={styles.screen}>
          <ScreenLoader />
        </View>
      );
    }
    case 'error': {
      return (
        <View style={styles.screen}>
          <ScreenError text={strings.articleError} />
        </View>
      );
    }
    case 'adult-content-warning': {
      return (
        <View style={styles.screen}>
          <View style={styles.centerContainer}>
            <AdultContentWarning
              onAccept={adultContentAcceptHandler}
              onDecline={adultContentDeclineHandler}
            />
          </View>
        </View>
      );
    }
    case 'ready': {
      return (
        <>
          {appBar}
          {article && (
            <SafeAreaView
              style={[styles.screen, {backgroundColor: colors.greyBackground}]}
              edges={['left', 'right']}>
              <ScrollView
                contentContainerStyle={{paddingBottom: bottom + 32, paddingTop: appBarHeight.fullHeight}}>
                <PodcastEpisodeSelection
                  currentSeason={currentSeason}
                  categoryInfo={category_info}
                  isVodcast={true}
                  onEpisodePress={(episode) => {
                    navigation.setParams({articleId: episode.id});
                  }}
                />
                <VideoComponent
                  style={styles.videoContainer}
                  streamUrl={(article as ArticleContentMedia).get_playlist_url}
                  title={(article as ArticleContentMedia).title}
                  cover={article.main_photo}
                  autoPlay={false}
                  aspectRatio={16 / 9}
                />
                <PodcastAbout article={article as ArticleContentMedia} />
                <View style={styles.imageContainer}>
                  <FastImage
                    style={{
                      flex: 1,
                      aspectRatio: article.main_photo?.w_h,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                    source={{
                      uri: buildArticleImageUri(IMG_SIZE_XXL, article.main_photo?.path),
                    }}
                  />
                </View>
                <VodcastRecommendations articleId={articleId} />
                {category_info?.genre_info && (
                  <RadiotekaGenres
                    data={category_info?.genre_info}
                    title={strings.related_genres}
                    onPress={(genreId: number, genreTitle: string) => {
                      navigation.push('Genre', {
                        genreId,
                        title: genreTitle,
                      });
                    }}
                  />
                )}
              </ScrollView>
            </SafeAreaView>
          )}
          {snackbar}
        </>
      );
    }
    default: {
      return (
        <View style={styles.screen}>
          <ScreenLoader />
        </View>
      );
    }
  }
};

export default VodcastScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    flex: 1,
    margin: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    padding: 10,
  },
});
