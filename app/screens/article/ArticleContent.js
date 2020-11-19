import React from 'react';
import {View, Dimensions, Animated, FlatList} from 'react-native';
import Header from './header/Header';
import {getOrientation} from '../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  ArticlePhoto,
  TouchableDebounce,
  ScalableText,
  ArticleGallery,
  ArticleParagraph,
  VideoComponent,
  AudioComponent,
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

import Styles from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const getContentWidth = () => {
  return Dimensions.get('window').width - 12 * 2;
};

const getItemKey = (item, index) => {
  const {type} = item;

  if (type == TYPE_GALLERY || type == TYPE_HEADER || type == TYPE_SUMMARY) {
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
            style={Styles.photo}
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
        <ScalableText style={Styles.summaryText} selectable={true}>
          {data.text}
        </ScalableText>
      );
    };

    const renderParagraph = () => {
      return <ArticleParagraph data={data} itemSelectHandler={props.itemPressHandler} />;
    };

    const renderVideo = () => {
      return (
        <View style={Styles.playerContainer}>
          <VideoComponent {...data} style={Styles.player} autoPlay={true} />
        </View>
      );
    };

    const renderAudio = () => {
      return (
        <View style={Styles.playerContainer}>
          <AudioComponent {...data} style={Styles.player} />
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
        return <View style={{backgroundColor: 'red', height: 40}} />;
      }
    }
  };

  return (
    <View style={Styles.container}>
      <AnimatedFlatList
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
    </View>
  );
};

export default ArticleContent;
