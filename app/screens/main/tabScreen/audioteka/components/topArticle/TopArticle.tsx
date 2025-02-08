import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Article} from '../../../../../../../Types';
import TopArticleBackground from './TopArticleBackground';
import TopArticleChannelBadge from './TopArticleChannelBadge';
import Image from 'react-native-fast-image';
import {buildImageUri, IMG_SIZE_M} from '../../../../../../util/ImageUtil';
import MediaIndicator from '../../../../../../components/mediaIndicator/MediaIndicator';
import TextComponent from '../../../../../../components/text/Text';
import {MediaIcon, TouchableDebounce} from '../../../../../../components';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import ListenCount from '../../../../../../components/article/article/ListenCount';

interface TopArticleProps {
  article: Article;
}

const TopArticle: React.FC<TopArticleProps> = ({article}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const onPressHandler = useCallback(() => {
    navigation.navigate('Podcast', {articleId: article.id});
  }, [article.id, navigation]);

  return (
    <TouchableDebounce debounceTime={500} onPress={onPressHandler} activeOpacity={0.8}>
      <TopArticleBackground style={styles.container} article={article}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: buildImageUri(IMG_SIZE_M, article.img_path_prefix, article.img_path_postfix),
            }}
          />
          <MediaIndicator style={styles.mediaIndicator} size="small" />
        </View>

        <View style={styles.dateContainer}>
          <MediaIcon size={18} is_audio={1} channel_id={article.channel_id} />
          <TextComponent
            importantForAccessibility="no"
            style={styles.date}>{`${article.category_title}    ${article.item_date}`}</TextComponent>
        </View>

        <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
          {article.title.trim()}
        </TextComponent>

        <ListenCount style={styles.listenCount} article={article} />

        <TopArticleChannelBadge style={styles.channelLogoBadge} logoUri={article.channel_logo} />
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
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  channelLogoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginVertical: 16,
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
    fontSize: 21,
    color: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    marginLeft: 8,
    color: 'white',
  },
  listenCount: {
    marginTop: 12,
  },
});
