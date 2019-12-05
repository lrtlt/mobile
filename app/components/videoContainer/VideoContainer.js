import React from 'react';
import { View, Dimensions, Text, ActivityIndicator } from 'react-native';
import Styles from './styles';
import Image from '../progressiveImage/ProgressiveImage';
import MediaIndicator from '../mediaIndicator/MediaIndicator';
import { getImageSizeForWidth, buildArticleImageUri, buildImageUri, IMG_SIZE_XS } from '../../util/ImageUtil';
import { TouchableHighlight } from 'react-native-gesture-handler';
import VideoPlayer from '../videoPlayer/VideoPlayer';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const renderCover = props => {
  const { cover } = props;
  if (cover) {
    const imgSize = getImageSizeForWidth(Dimensions.get('window').width);
    //const aspectRatio = parseFloat(photo.w_h);
    const aspectRatio = 16 / 9;

    if (cover) {
      if (cover.path) {
        return (
          <View style={Styles.videoImageContainer}>
            <Image
              style={{ ...Styles.photo, aspectRatio }}
              resizeMode="contain"
              source={{
                uri: buildArticleImageUri(imgSize, cover.path),
              }}
              thumbnailSource={{
                uri: buildArticleImageUri(IMG_SIZE_XS, cover.path),
              }}
            />
            <MediaIndicator style={Styles.mediaIndicator} />
          </View>
        );
      }

      if (cover.img_path_prefix && cover.img_path_postfix) {
        return (
          <View style={Styles.videoImageContainer}>
            <Image
              style={{ ...Styles.photo, aspectRatio }}
              resizeMode="contain"
              source={{
                uri: buildImageUri(imgSize, cover.img_path_prefix, cover.img_path_postfix),
              }}
              thumbnailSource={{
                uri: buildImageUri(IMG_SIZE_XS, cover.img_path_prefix, cover.img_path_postfix),
              }}
            />
            <MediaIndicator style={Styles.mediaIndicator} />
          </View>
        );
      }
    }
  }

  if (props.coverComponent) {
    return props.coverComponent;
  } else {
    return <View />;
  }
};

const renderVideoPlayer = (uri, isLiveStream) => {
  if (uri) {
    return (
      <VideoPlayer
        paused={false}
        disableFullscreen={false}
        disableBack={true}
        fullscreen={false}
        isLiveStream={isLiveStream}
        fullscreenAutorotate={true}
        //props.url
        source={{
          uri: uri,
        }}
      />
    );
  } else {
    return renderError();
  }
};

const renderError = () => {
  return (
    <View style={Styles.loaderContainer}>
      <Icon name="error" color="white" size={24} />
      <Text style={Styles.errorText}>{EStyleSheet.value('$videoNotAvailable')}</Text>
    </View>
  );
};

const renderLoading = animating => {
  return (
    <View style={Styles.loaderContainer}>
      <ActivityIndicator size="small" animating={animating} color={EStyleSheet.value('$primary')} />
    </View>
  );
};

class VideoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playRequested: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    const { videoUrl, isLiveStream, autoPlay } = this.props;
    if (autoPlay === true) {
      this.handlePlayPress(videoUrl, isLiveStream);
    }
  }

  callApi = async url => {
    const response = await fetch(url);
    const result = await response.json();
    //console.log('VIDEO API RESPONSE', result);
    return result;
  };

  handlePlayPress(videoUrl, isLiveStream) {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    if (isLiveStream === true) {
      this.callApi(videoUrl).then(response =>
        this.setState({
          ...this.state,
          isLoading: false,
          uri: response.response.data.content.trim(),
        }),
      );
    } else {
      this.callApi(videoUrl).then(response =>
        this.setState({
          ...this.state,
          isLoading: false,
          uri: response.playlist_item.file.trim(),
        }),
      );
    }
  }

  render() {
    const { videoUrl, isLiveStream } = this.props;

    let content;
    if (this.state.uri) {
      content = renderVideoPlayer(this.state.uri, isLiveStream);
    } else {
      if (this.state.isLoading === true) {
        content = renderLoading(this.state.isLoading);
      } else {
        content = (
          <TouchableHighlight onPress={() => this.handlePlayPress(videoUrl, isLiveStream)}>
            {renderCover(this.props)}
          </TouchableHighlight>
        );
      }
    }

    return <View {...this.props}>{content}</View>;
  }
}

export default VideoContainer;
