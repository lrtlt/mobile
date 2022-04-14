import React, {useCallback, useMemo, useState} from 'react';
import {View, Animated, StyleSheet, ListRenderItemInfo, useWindowDimensions} from 'react-native';
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
  TYPE_TEXT_TO_SPEECH,
  ArticleContentItemType,
  TYPE_AUDIO_CONTENT,
  TYPE_KEYWORDS,
} from './ArticleCompositor';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCollapsibleHeader} from 'react-navigation-collapsible';
import {useTheme} from '../../Theme';
import {ArticleContent} from '../../api/Types';
import AudioContent from './audioContent/AudioContent';
import ArticleMainPhoto from './mainPhoto/ArticleMainPhoto';
import ArticleKeywords from './keywords/ArticleKeywords';

export type ArticleSelectableItem = {
  type: 'photo' | 'article';
  item: any;
};

interface Props {
  article: ArticleContent;
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const ArticleContentComponent: React.FC<Props> = ({article, itemPressHandler}) => {
  const [isTextToSpeechPlaying, setTextToSpeechPlaying] = useState(false);
  const {colors} = useTheme();

  const {width: screenWidth} = useWindowDimensions();
  const contentWidth = screenWidth - 12 * 2;

  const articleData = useMemo(() => compose(article), [article]);

  const renderItem = useCallback(
    (item: ListRenderItemInfo<ArticleContentItemType>): React.ReactElement | null => {
      const {type, data} = item.item;

      switch (type) {
        case TYPE_HEADER: {
          return (
            <Header
              {...data}
              isText2SpeechPlaying={isTextToSpeechPlaying}
              onPlayStateChange={setTextToSpeechPlaying}
            />
          );
        }
        case TYPE_MAIN_PHOTO: {
          if (isTextToSpeechPlaying) {
            //We will render text2Speech component instead
            return null;
          }
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
          return (
            <ArticleGallery
              data={data.photos}
              expectedWidth={contentWidth}
              itemSelectHandler={itemPressHandler}
            />
          );
        }
        case TYPE_PARAGRAPH: {
          return <ArticleContentItem data={data} itemPressHandler={itemPressHandler} />;
        }
        case TYPE_VIDEO: {
          return (
            <View style={styles.playerContainer}>
              <VideoComponent {...data} style={styles.player} autoPlay={false} />
            </View>
          );
        }
        case TYPE_AUDIO: {
          return (
            <View style={styles.playerContainer}>
              <AudioComponent {...data} style={styles.player} autoStart={false} />
            </View>
          );
        }
        case TYPE_AUDIO_CONTENT: {
          return <AudioContent {...data} />;
        }
        case TYPE_TEXT_TO_SPEECH: {
          if (!isTextToSpeechPlaying) {
            return null;
          } else {
            return (
              <View style={styles.playerContainer}>
                <AudioComponent {...data} style={styles.playerTextToSpeech} autoStart={true} />
              </View>
            );
          }
        }
        case TYPE_KEYWORDS: {
          return <ArticleKeywords keywords={data.keywords} />;
        }
        default: {
          return null;
        }
      }
    },
    [contentWidth, isTextToSpeechPlaying, itemPressHandler],
  );

  const {onScroll, containerPaddingTop, scrollIndicatorInsetTop} = useCollapsibleHeader(
    {
      config: {
        collapsedColor: colors.card,
        elevation: 2,
      },
    },
    0,
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Animated.FlatList
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: containerPaddingTop}}
        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
        data={articleData}
        windowSize={6}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={useCallback((item, index) => {
          return String(index) + String(item.type);
        }, [])}
      />
    </SafeAreaView>
  );
};

export default ArticleContentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  summaryText: {
    marginTop: 24,
    marginBottom: 24,
    lineHeight: 32,

    fontSize: 22,
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
    aspectRatio: 1.5,
    maxHeight: getSmallestDim() - 62,
  },
});
