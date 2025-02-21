import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {AdultContentWarning, ScreenError, ScreenLoader} from '../../components';
import useArticleScreenState from '../article/useArticleScreenState';
import {useTheme} from '../../Theme';
import PodcastAbout from './about/PodcastAbout';
import {ArticleContentMedia, isMediaArticle} from '../../api/Types';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {buildArticleImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import PodcastEpisode from './episode/PodcastEpisode';
import PodcastRecommendations from './recommendations/PodcastRecommendations';
import PodcastEpisodeSelection from './episodeSelection/PodcastEpisodeSelection';
import useArticleAnalytics from '../article/useArticleAnalytics';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../components/videoComponent/context/ArticlePlaylist';
import useSeason from './episodeSelection/useSeason';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Podcast'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Podcast'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const PodcastScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {articleId} = route.params;

  const [{article, category_info, loadingState}, acceptAdultContent] = useArticleScreenState(articleId);

  const currentSeason = category_info?.season_info.find(
    (season) => season.lrt_season_id === (article as ArticleContentMedia).lrt_season_id,
  );

  const {episodes} = useSeason(currentSeason?.season_url);
  const {setPlaylist} = useMediaPlayer();

  const {strings, colors} = useTheme();

  useArticleAnalytics({article});

  useEffect(() => {
    navigation.setOptions({
      headerTitle: article?.category_title ?? '',
    });
  }, [article, navigation]);

  const play = useCallback(
    (id: number) => {
      setPlaylist(
        new ArticlePlaylist(
          episodes.map((episode) => episode.id),
          episodes.findIndex((episode) => episode.id == id),
        ),
      );
    },
    [episodes, setPlaylist, article],
  );

  const {bottom} = useSafeAreaInsets();

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
          {article && (
            <SafeAreaView
              style={[styles.screen, {backgroundColor: colors.greyBackground}]}
              edges={['left', 'right']}>
              <ScrollView contentContainerStyle={{paddingBottom: bottom + 80}}>
                <PodcastEpisodeSelection currentSeason={currentSeason} categoryInfo={category_info} />
                <PodcastEpisode
                  article={article as ArticleContentMedia}
                  onPlayPress={() => {
                    if (isMediaArticle(article)) {
                      play(article.id);
                    }
                  }}
                />
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
                <PodcastAbout article={article as ArticleContentMedia} />
                <PodcastRecommendations articleId={articleId} />
              </ScrollView>
            </SafeAreaView>
          )}
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

export default PodcastScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    padding: 10,
  },
});
