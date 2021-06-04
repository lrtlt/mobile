import React, {useCallback, useMemo, useState} from 'react';
import {View, Animated, StyleSheet, ListRenderItemInfo, useWindowDimensions} from 'react-native';
import Header from './header/Header';
import {getOrientation, getSmallestDim} from '../../util/UI';
import {
  ArticlePhoto,
  TouchableDebounce,
  ArticleGallery,
  ArticleParagraph,
  VideoComponent,
  AudioComponent,
  Text,
} from '../../components';
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
  ArticleContentItem,
  TYPE_AUDIO_CONTENT,
} from './ArticleCompositor';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCollapsibleHeader} from 'react-navigation-collapsible';
import {useTheme} from '../../Theme';
import {ArticleContent} from '../../api/Types';
import AudioContent from './audioContent/AudioContent';

export type ArticleSelectableItem = {
  type: 'photo' | 'article';
  item: any;
};

const getItemKey = (item: ArticleContentItem, index: number) => {
  const {type} = item;
  if (type === TYPE_GALLERY || type === TYPE_HEADER || type === TYPE_SUMMARY) {
    return String(index) + String(type) + getOrientation();
  } else {
    return String(index) + String(type);
  }
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
  console.log('composition', articleData);

  const renderItem = useCallback(
    (item: ListRenderItemInfo<ArticleContentItem>): React.ReactElement | null => {
      const {type, data} = item.item;

      const renderMainPhoto = () => {
        if (isTextToSpeechPlaying) {
          //We will render text2Speech component instead
          return null;
        }

        return (
          <TouchableDebounce
            onPress={() =>
              itemPressHandler({
                type: 'photo',
                item: data.photo,
              })
            }>
            <ArticlePhoto
              style={styles.photo}
              photo={data.photo}
              progressive={true}
              imageAspectRatio={1.5}
              expectedWidth={contentWidth}
            />
          </TouchableDebounce>
        );
      };

      const renderSummary = () => {
        return (
          <Text style={styles.summaryText} selectable={true}>
            {data.text}
          </Text>
        );
      };

      const renderParagraph = () => {
        return <ArticleParagraph data={data} itemSelectHandler={itemPressHandler} />;
      };

      const renderVideo = () => {
        return (
          <View style={styles.playerContainer}>
            <VideoComponent {...data} style={styles.player} autoPlay={false} />
          </View>
        );
      };

      const renderAudio = () => {
        return (
          <View style={styles.playerContainer}>
            <AudioComponent {...data} style={styles.player} autoStart={false} />
          </View>
        );
      };

      const renderText2Speech = () => {
        return isTextToSpeechPlaying ? (
          <View style={styles.playerContainer}>
            <AudioComponent {...data} style={styles.playerTextToSpeech} autoStart={true} />
          </View>
        ) : null;
      };

      const renderGallery = () => {
        return (
          <ArticleGallery
            data={data.photos}
            expectedWidth={contentWidth}
            itemSelectHandler={itemPressHandler}
          />
        );
      };

      const renderAudioContent = () => {
        return <AudioContent {...data} />;
      };

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
          return renderMainPhoto();
        }
        case TYPE_SUMMARY: {
          return renderSummary();
        }
        case TYPE_GALLERY: {
          return renderGallery();
        }
        case TYPE_PARAGRAPH: {
          return renderParagraph();
        }
        case TYPE_VIDEO: {
          return renderVideo();
        }
        case TYPE_AUDIO: {
          return renderAudio();
        }
        case TYPE_AUDIO_CONTENT: {
          return renderAudioContent();
        }
        case TYPE_TEXT_TO_SPEECH: {
          return renderText2Speech();
        }
        default: {
          return <View />;
        }
      }
    },
    [contentWidth, isTextToSpeechPlaying, itemPressHandler],
  );

  const {onScroll, containerPaddingTop, scrollIndicatorInsetTop} = useCollapsibleHeader({
    config: {
      collapsedColor: colors.card,
      elevation: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Animated.FlatList
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: containerPaddingTop}}
        scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
        data={articleData}
        extraData={{
          orientation: getOrientation(),
        }}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={useCallback((item, index) => getItemKey(item, index), [])}
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
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 22,
  },
  photo: {
    width: '100%',
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
