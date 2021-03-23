import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Article} from '../../../../../../../Types';
import TopArticleBackground from './TopArticleBackground';
import TopArticleChannelBadge from './TopArticleChannelBadge';
import Image from 'react-native-fast-image';
import {buildImageUri, IMG_SIZE_S} from '../../../../../../util/ImageUtil';
import MediaIndicator from '../../../../../../components/mediaIndicator/MediaIndicator';
import TextComponent from '../../../../../../components/text/Text';
import {MicIcon} from '../../../../../../components/svg';
import {TouchableDebounce} from '../../../../../../components';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../../navigation/MainStack';

interface TopArticleProps {
  article: Article;
}

const TopArticle: React.FC<TopArticleProps> = ({article}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  return (
    <TouchableDebounce
      debounceTime={500}
      onPress={() => navigation.navigate('Article', {articleId: article.id})}>
      <TopArticleBackground style={styles.container} article={article}>
        <TopArticleChannelBadge style={styles.channelLogoBadge} logoUri={article.channel_logo} />
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: buildImageUri(IMG_SIZE_S, article.img_path_prefix, article.img_path_postfix),
            }}
          />
          <MediaIndicator style={styles.mediaIndicator} size="small" />
        </View>

        <View style={styles.dateContainer}>
          <MicIcon size={18} />
          <TextComponent
            style={styles.date}>{`${article.category_title}    ${article.item_date}`}</TextComponent>
        </View>
        <TextComponent style={styles.title}>{article.title}</TextComponent>
      </TopArticleBackground>
    </TouchableDebounce>
  );
};

export default TopArticle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingBottom: 32,
  },
  channelLogoBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 196,
    height: 196,
    borderRadius: 8,
  },
  mediaIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  title: {
    marginTop: 16,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 22,
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  date: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    marginLeft: 8,
    color: 'white',
  },
});
