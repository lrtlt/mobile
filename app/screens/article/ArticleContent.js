import React from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Header from './header/Header';
import { getOrientation } from '../../util/UI';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  ArticlePhoto,
  TouchableDebounce,
  ScalableText,
  ArticleGallery,
  ArticleParagraph,
  VideoComponent,
  AudioPlayer,
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
  return Dimensions.get('window').width - EStyleSheet.value('$contentPadding') * 2;
};

const ArticleContent = props => {
  const articleData = compose(props.article);

  console.log('composition', articleData);

  const renderItem = item => {
    const { type, data } = item.item;

    const renderMainPhoto = () => {
      return (
        <TouchableDebounce
          onPress={() =>
            props.itemPressHandler({
              type: 'photo',
              item: data.photo,
            })
          }
        >
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
        <View style={Styles.audioPlayer}>
          <AudioPlayer {...data} paused={true} controlTimeout={Number.MAX_VALUE} disableBack={true} />
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
        return <View style={{ backgroundColor: 'red', height: 40 }}></View>;
      }
    }
  };

  const { paddingHeight, animatedY, onScroll } = props.collapsible;

  return (
    <View style={Styles.container}>
      <AnimatedFlatList
        data={articleData}
        extraData={{
          orientation: getOrientation(),
        }}
        renderItem={renderItem}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
        //Collapsible params
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: paddingHeight }}
        scrollIndicatorInsets={{ top: paddingHeight }}
        _mustAddThis={animatedY}
        onScroll={onScroll}
      />
    </View>
  );
};

export default ArticleContent;
