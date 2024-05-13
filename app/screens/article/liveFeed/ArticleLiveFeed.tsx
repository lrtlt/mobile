import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, ListRenderItemInfo} from 'react-native';
import {useLiveFeedState} from './useLiveFeedState';
import {LiveFeedItem} from '../../../api/Types';
import TextComponent from '../../../components/text/Text';
import ArticleParagraph from '../../../components/articleParagraphs/paragraph/ArticleParagraph';
import {CoverImage, MoreArticlesButton, TouchableDebounce} from '../../../components';
import {IMG_SIZE_M, buildImageUri} from '../../../util/ImageUtil';
import EmbedHTML from '../../../components/articleParagraphs/embeded/embedComponents/EmbedHTML';
import {useTheme} from '../../../Theme';
import LiveFeedArticleItem from './LiveFeedArticleItem';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import LiveFeedCountdown from './LiveFeedCountdown';

interface Props {
  id: string;
}

const ITEM_COUNT_INCREMENT = 5;

const ArticleLiveFeed: React.FC<React.PropsWithChildren<Props>> = ({id}) => {
  const [itemCount, setItemCount] = useState(ITEM_COUNT_INCREMENT);
  const {state, reload} = useLiveFeedState(id);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const theme = useTheme();

  useEffect(() => {
    reload();
  }, []);

  const getTimeDifference = useCallback((minutesAgo: number) => {
    const days = Math.floor(minutesAgo / (60 * 24));
    if (days > 0) {
      return `Prieš ${days} d.`;
    }

    const hours = Math.floor(minutesAgo / 60);
    if (hours > 0) {
      return `Prieš ${hours} val.`;
    }

    const minutes = minutesAgo % 60;
    if (minutes > 0 && hours === 0) {
      return `Prieš ${minutes} min.`;
    }
  }, []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<LiveFeedItem>) => {
      let imgUri: string | undefined;
      if (item.img_path_prefix && item.img_path_postfix) {
        imgUri = buildImageUri(IMG_SIZE_M, item.img_path_prefix, item.img_path_postfix);
      }

      return (
        <View style={{...styles.itemContainer, borderColor: theme.colors.border}}>
          <TextComponent style={styles.createdAt} type="secondary">
            {getTimeDifference(item.time_diff_minutes)}
          </TextComponent>
          <View style={{...styles.separator, backgroundColor: theme.colors.border}} />
          {item.feed_item_title && (
            <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular" selectable={true}>
              {item.feed_item_title}
            </TextComponent>
          )}
          {imgUri ? (
            <>
              <CoverImage
                style={styles.image}
                source={{
                  uri: imgUri,
                }}
              />
              <TextComponent style={styles.createdAt} type="secondary">
                {item.photo_info}
              </TextComponent>
            </>
          ) : null}
          <ArticleParagraph htmlText={item.feed_item_content} textSize={17} />
          <View style={{gap: 8}}>
            {item.articles?.map((article) => (
              <TouchableDebounce onPress={() => navigation.push('Article', {articleId: article.id})}>
                <LiveFeedArticleItem article={article} />
              </TouchableDebounce>
            ))}
          </View>
          {item.embed ? (
            <EmbedHTML
              data={[
                {
                  embed_type: 'html',
                  el: {
                    //src: item.embed,
                    html: item.embed,
                  },
                },
              ]}
            />
          ) : null}
        </View>
      );
    },
    [getTimeDifference],
  );

  const keyExtractor = useCallback((item: LiveFeedItem) => item.feed_item_id.toString(), []);

  return (
    <View style={styles.container}>
      <LiveFeedCountdown onDeadline={() => reload()} />
      {state.feed ? (
        <FlatList
          style={{marginTop: 16}}
          data={state.feed['feed-items'].slice(0, itemCount)}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      ) : null}
      <MoreArticlesButton onPress={() => setItemCount((count) => count + ITEM_COUNT_INCREMENT)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
    marginTop: 12,
    marginBottom: 8,
  },
  itemContainer: {
    marginBottom: 8,
    marginTop: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    borderRadius: 6,
  },
  createdAt: {
    fontSize: 12,
    marginBottom: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  title: {
    fontSize: 21,
    marginBottom: 8,
  },
});

export default React.memo(ArticleLiveFeed, (prevProps, nextProps) => prevProps.id === nextProps.id);
