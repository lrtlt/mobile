import {StyleSheet, View} from 'react-native';
import {Text} from '../../../components';
import useRecomendations from './useRecommendations';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {useCallback, useMemo} from 'react';
import {useMediaPlayer} from '../../../components/videoComponent/context/useMediaPlayer';
import ArticlePlaylist from '../../../components/videoComponent/context/playlist/ArticlePlaylist';
import MediatekaHorizontalList from '../../main/tabScreen/mediateka/components/horizontal_list/MediatekaHorizontalList';

interface Props {
  articleId: number;
}

const VodcastRecommendations: React.FC<React.PropsWithChildren<Props>> = ({articleId}) => {
  const recommendations = useRecomendations(articleId);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Podcast'>>();

  const {setPlaylist} = useMediaPlayer();

  const items = useMemo(() => {
    return recommendations.items.map((item) => ({
      title: item.title,
      category: item.category_title,
      imageUrl: buildArticleImageUri(IMG_SIZE_M, item.photo)!,
      imageAspectRatio: item.img_w_h,
      ageRestricted: !!item.age_restriction,
    }));
  }, [recommendations.items]);

  const playItem = useCallback(
    (index: number) => {
      setPlaylist(
        new ArticlePlaylist(
          recommendations.items.map((item) => item.id),
          index,
        ),
      );
    },
    [recommendations, setPlaylist],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title} fontFamily="SourceSansPro-SemiBold">
        Kiti taip pat žiūrėjo
      </Text>
      <MediatekaHorizontalList
        items={items}
        onItemPlayPress={playItem}
        onItemPress={(index) => {
          navigation.navigate('Vodcast', {articleId: recommendations.items[index].id});
        }}
      />
    </View>
  );
};

export default VodcastRecommendations;

const styles = StyleSheet.create({
  root: {
    paddingTop: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 12,
    textTransform: 'uppercase',
  },
});
