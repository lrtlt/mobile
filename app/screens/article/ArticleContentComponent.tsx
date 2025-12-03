import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Header from './header/Header';
import {getSmallestDim} from '../../util/UI';
import {ArticleGallery, VideoComponent, AudioComponent, Text, ArticleContentItem} from '../../components';
import {
  compose,
  TYPE_HEADER,
  TYPE_MAIN_PHOTO,
  TYPE_SUMMARY,
  TYPE_PARAGRAPH,
  TYPE_GALLERY,
  TYPE_VIDEO,
  TYPE_AUDIO,
  ArticleContentItemType,
  TYPE_AUDIO_CONTENT,
  TYPE_KEYWORDS,
  TYPE_SIMPLE_FOOTER,
} from './ArticleCompositor';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {ArticleContent} from '../../api/Types';
import AudioContent from './audioContent/AudioContent';
import ArticleMainPhoto from './mainPhoto/ArticleMainPhoto';
import ArticleKeywords from './keywords/ArticleKeywords';
import useArticleHeader from './useArticleHeader_v2';
import useAppBarHeight from '../../components/appBar/useAppBarHeight';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {useTheme} from '../../Theme';
import SimpleFooter from './simpleFooter/SimpleFooter';

export type ArticleSelectableItem = {
  type: 'photo' | 'article';
  item: any;
};

interface Props {
  article: ArticleContent;
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const ArticleContentComponent: React.FC<React.PropsWithChildren<Props>> = ({article, itemPressHandler}) => {
  const {width: screenWidth} = useWindowDimensions();
  const contentWidth = screenWidth - 12 * 2;

  const {simplyfied} = useTheme();
  const articleData = useMemo(() => compose(article, simplyfied), [article]);

  const {appBar, onScroll} = useArticleHeader(article);

  const renderItem = useCallback(
    (item: ListRenderItemInfo<ArticleContentItemType>): React.ReactElement | null => {
      const {type, data} = item.item;

      switch (type) {
        case TYPE_HEADER: {
          return <Header {...data} />;
        }
        case TYPE_MAIN_PHOTO: {
          return (
            <ArticleMainPhoto
              data={data.photo}
              itemPressHandler={itemPressHandler}
              contentWidth={contentWidth}
            />
          );
        }
        case TYPE_SUMMARY: {
          return (
            <Text style={styles.summaryText} selectable={true}>
              {data.text}
            </Text>
          );
        }
        case TYPE_GALLERY: {
          return <ArticleGallery data={data.photos} itemSelectHandler={itemPressHandler} />;
        }
        case TYPE_PARAGRAPH: {
          return <ArticleContentItem data={data} itemPressHandler={itemPressHandler} />;
        }
        case TYPE_VIDEO: {
          return (
            <View style={styles.playerContainer}>
              <VideoComponent {...data} style={styles.player} autoPlay={true} />
            </View>
          );
        }
        case TYPE_AUDIO: {
          return (
            <View style={styles.playerContainer}>
              <AudioComponent {...data} style={styles.player} autoStart={true} isLiveStream={false} />
            </View>
          );
        }
        case TYPE_AUDIO_CONTENT: {
          return <AudioContent {...data} />;
        }
        case TYPE_KEYWORDS: {
          return <ArticleKeywords keywords={data.keywords} />;
        }
        case TYPE_SIMPLE_FOOTER: {
          return <SimpleFooter />;
        }
        default: {
          return null;
        }
      }
    },
    [contentWidth, itemPressHandler],
  );

  const appBarHeight = useAppBarHeight();

  return (
    <>
      {appBar}
      <View style={styles.container}>
        <FlashList
          onScroll={onScroll}
          contentContainerStyle={{paddingTop: appBarHeight.fullHeight, paddingBottom: 24}}
          data={articleData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          removeClippedSubviews={false}
          keyExtractor={useCallback((item: ArticleContentItemType, index: number) => {
            return String(index) + String(item.type);
          }, [])}
        />
      </View>
    </>
  );
};

export default ArticleContentComponent;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  summaryText: {
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 34,
    fontSize: 23,
    alignSelf: 'baseline',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
  playerTextToSpeech: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
});
