import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../Theme';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from '@d11/react-native-fast-image';
import {buildImageUri, IMG_SIZE_XXL} from '../../util/ImageUtil';
import PodcastEpisode from './episode/PodcastEpisode';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../components/videoComponent/context/playlist/ArticlePlaylist';
import {useCounter} from '../../util/useCounter';
import PodcastEpisodeSelection from './episodeSelection/PodcastEpisodeSelection';
import PlaylistAbout from './about/PlaylistAbout';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Playlist'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Playlist'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const PlaylistScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [selectedEpisode, setSelectedEpisode] = useState<number>(0);
  const {data} = route.params.data;

  const episodes = data.playlist_items;
  const article = data.playlist_items[selectedEpisode];
  const {setPlaylist} = useMediaPlayer();

  const {colors} = useTheme();

  //TODO: update
  //useArticleAnalytics({article});
  useCounter(article.id, article.url);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data.playlist_article.article_title ?? '',
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

  return (
    <SafeAreaView style={[styles.screen, {backgroundColor: colors.greyBackground}]} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{paddingBottom: bottom + 32}}>
        <PodcastEpisodeSelection
          preloadedEpisodes={episodes}
          onEpisodePress={(episode) => {
            setSelectedEpisode(episodes.findIndex((e) => e.id === episode.id));
          }}
        />
        <PodcastEpisode
          title={article.title}
          categoryTitle={article.category_title}
          date={article.date}
          onPlayPress={() => {
            play(article.id);
          }}
        />
        <PlaylistAbout
          episodeInfo={article.title}
          playlistInfo={data.playlist_article.paragraphs[0]?.p}
          playlistImage={data.playlist_article.main_photo}
          keywords={data.playlist_article.article_keywords}
        />
        <View style={styles.imageContainer}>
          <FastImage
            style={{
              flex: 1,
              aspectRatio: article.photo_aspectratio,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#fff',
            }}
            source={{
              uri: buildImageUri(IMG_SIZE_XXL, article.img_path_prefix, article.img_path_postfix),
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaylistScreen;

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
