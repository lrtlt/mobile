import React from 'react';
import {View, Dimensions, FlatList, StyleSheet} from 'react-native';
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
} from './ArticleCompositor';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {SafeAreaView} from 'react-native-safe-area-context';

const getContentWidth = () => {
  return Dimensions.get('window').width - 12 * 2;
};

const getItemKey = (item, index) => {
  const {type} = item;

  if (type === TYPE_GALLERY || type === TYPE_HEADER || type === TYPE_SUMMARY) {
    return String(index) + String(item) + getOrientation();
  } else {
    return String(index) + String(item);
  }
};

const ArticleContent = (props) => {
  const articleData = compose(props.article);

  console.log('composition', articleData);

  const renderItem = (item) => {
    const {type, data} = item.item;

    const renderMainPhoto = () => {
      return (
        <TouchableDebounce
          onPress={() =>
            props.itemPressHandler({
              type: 'photo',
              item: data.photo,
            })
          }>
          <ArticlePhoto
            style={styles.photo}
            photo={data.photo}
            progressive={true}
            imageAspectRatio={1.5}
            expectedWidth={getContentWidth()}
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
      return <ArticleParagraph data={data} itemSelectHandler={props.itemPressHandler} />;
    };

    const renderVideo = () => {
      return (
        <View style={styles.playerContainer}>
          <VideoComponent {...data} style={styles.player} autoPlay={true} />
        </View>
      );
    };

    const renderAudio = () => {
      return (
        <View style={styles.playerContainer}>
          <AudioComponent {...data} style={styles.player} />
        </View>
      );
    };

    const renderGallery = () => {
      return (
        <ArticleGallery
          data={data.photos}
          expectedWidth={getContentWidth()}
          itemSelectHandler={props.itemPressHandler}
        />
      );
    };

    switch (type) {
      case TYPE_HEADER: {
        return <Header {...data} />;
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
      default: {
        return <View />;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={articleData}
        extraData={{
          orientation: getOrientation(),
        }}
        windowSize={6}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => getItemKey(item, index)}
      />
    </SafeAreaView>
  );
};

export default ArticleContent;

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
});
