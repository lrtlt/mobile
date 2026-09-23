import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeBlockVideoList} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {VerticalVideoComponent} from '../../../home/blocks/VideoListBlock/VideoListBlock';
import SectionTitle from '../../components/SectionTitle';

interface VideoListBlockProps {
  block: HomeBlockVideoList;
}

/** "Žvilgtelk": vertical short videos. Reuses the v2 card under the web's plain section title. */
const VideoListBlock: React.FC<VideoListBlockProps> = ({block}) => {
  const {articles_list: articles, category_title, slug_title} = block.data;
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const title = category_title ?? slug_title ?? '';

  if (!articles?.length) {
    return null;
  }

  return (
    <View>
      <SectionTitle style={styles.title} title={title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {articles.map((article, i) => (
          <TouchableDebounce
            key={article.id}
            onPress={() => navigation.navigate('VideoList', {title, articles, initialIndex: i})}>
            <VerticalVideoComponent article={article} autoplay={i === 0} />
          </TouchableDebounce>
        ))}
      </ScrollView>
    </View>
  );
};

export default VideoListBlock;

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 8,
    marginBottom: 16,
  },
  list: {
    gap: 8,
    paddingHorizontal: 8,
  },
});
