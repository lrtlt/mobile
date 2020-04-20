import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Styles from './styles';
import WebView from 'react-native-autoheight-webview';

import ArticlePhoto from '../../articlePhoto/ArticlePhoto';
import AudioPlayer from '../../audioPlayer/AudioPlayer';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import VideoComponent from '../../videoComponent/VideoComponent';

import EStyleSheet from 'react-native-extended-stylesheet';

const getScreenWidth = () => Dimensions.get('window').width;

const renderArticles = (data, pressHandler) => {
  const content = data.map((item, i) => {
    return (
      <View style={Styles.embededArticleContainer} key={i}>
        <TouchableDebounce onPress={() => pressHandler({ type: 'article', item: item.el })}>
          <Text style={Styles.embededArticleText}>{item.el.title}</Text>
        </TouchableDebounce>
      </View>
    );
  });

  return (
    <View style={Styles.container}>
      <View style={Styles.line} />
      <View style={Styles.container}>
        <Text style={Styles.articleTitle}>{EStyleSheet.value('$embedArticleHeader')}</Text>
        {content}
      </View>
      <View style={Styles.line} />
    </View>
  );
};

const renderPhotos = (data, pressHandler) => {
  const content = data.map((item, i) => {
    return (
      <View style={Styles.embededPhotoContainer} key={i}>
        <TouchableDebounce onPress={() => pressHandler({ type: 'photo', item: item.el })}>
          <ArticlePhoto photo={item.el} expectedWidth={getScreenWidth()} />
        </TouchableDebounce>
      </View>
    );
  });
  return <View>{content}</View>;
};

const renderVideoImage = data => {
  const content = data.map((item, i) => {
    return (
      <View style={Styles.embededVideoContainer} key={i}>
        <VideoComponent
          style={Styles.player}
          cover={item.el}
          streamUrl={item.el.get_playlist_url || item.el.get_streams_url}
        />
      </View>
    );
  });
  return <View>{content}</View>;
};

const renderBroadcast = data => {
  const content = data.map((item, i) => {
    return (
      <View style={Styles.embededVideoContainer} key={i}>
        <VideoComponent
          style={Styles.player}
          cover={item.el}
          streamUrl={item.el.get_streams_url}
          isLiveStream={true}
          autoPlay={false}
        />
      </View>
    );
  });
  return <View>{content}</View>;
};

const renderHtml = data => {
  const width = getScreenWidth() - EStyleSheet.value('$contentPadding') * 2;
  const style = {
    width,
    opacity: 0.99, //Crashfix on some android devices.
  };

  const content = data.map((item, i) => {
    //Facebook video
    // item.el.html =
    //   '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FLRT.LT%2Fvideos%2F968303086850470%2F&show_text=0&width=560" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';

    // item.el.html =
    //   '<iframe src="https://www.facebook.com/video/embed?video_id=968303086850470" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>';

    //Youtube
    // item.el.html =
    //   '<iframe width="560" height="315" src="https://www.youtube.com/embed/koasSG_7AcI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

    //Instagram
    // item.el.html =
    //   '<iframe class="instagram-media instagram-media-rendered" id="instagram-embed-0" src="https://www.instagram.com/p/B4deOwHgBUK/embed/captioned/?cr=1&amp;v=12&amp;wp=1080&amp;rd=https%3A%2F%2Fwww.lrt.lt&amp;rp=%2Fnaujienos%2Fveidai%2F14%2F1113431%2Fgreta-thunberg-tesia-susitikimus-su-zvaigzdemis-sikart-su-arnoldu-schwarzeneggeriu-vazinejo-dviraciais#%7B%22ci%22%3A0%2C%22os%22%3A615.0150000030408%2C%22ls%22%3A419.7599999970407%2C%22le%22%3A422.38999999972293%7D" allowtransparency="true" allowfullscreen="true" frameborder="0" height="741" data-instgrm-payload-id="instagram-media-payload-0" scrolling="no" style="background: white; max-width: 540px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"></iframe>';

    const formatted = item.el.html
      //Replace width value without quotes in range 300-2400.
      .replace(
        new RegExp('\\width=\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b'),
        'width=' + width,
      )
      //Replace width value with quotes in range 300-2400.
      .replace(
        new RegExp(
          '\\width\\s*=\\s*["\']\\b([3-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-9]{3}|2[0-3][0-9]{2}|2400)\\b["\']',
        ),
        'width="' + width + '"',
      );
    //Remove query height value
    //.replace(new RegExp('\\height\\s*=\\s*["\'](.*?)["\']'), '');

    console.log(formatted);

    return (
      <View style={Styles.embededHtmlContainer} key={i}>
        <WebView
          style={style}
          originWhitelist={['*']}
          cacheEnabled={false}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          androidHardwareAccelerationDisabled={false}
          automaticallyAdjustContentInsets={false}
          mediaPlaybackRequiresUserAction={true}
          collapsable={false}
          bounces={false}
          startInLoadingState={true}
          source={{ html: formatted }}
          // onNavigationStateChange={event => {
          //   console.log('onNavigationStateChange', event);
          //   if (event.url !== 'about:blank') {
          //     this.webview.stopLoading();
          //     Linking.openURL(event.url).catch(err =>
          //       console.warn('An error occurred', err),
          //     );
          //   }
          // }}
        />
      </View>
    );
  });
  return <View>{content}</View>;
};

const renderAudioPlayer = data => {
  const uri = data[0].el.stream_url;
  return (
    <AudioPlayer
      paused={true}
      disableFullscreen={true}
      controlTimeout={Number.MAX_VALUE}
      disableBack={true}
      fullscreen={false}
      fullscreenAutorotate={false}
      source={{ uri: uri }}
    />
  );
};

const embed = props => {
  const { data, pressHandler } = props;

  let content = null;
  switch (data[0].embed_type) {
    case 'photo': {
      content = renderPhotos(data, pressHandler);
      break;
    }
    case 'article': {
      content = renderArticles(data, pressHandler);
      break;
    }
    case 'video': {
      content = renderVideoImage(data);
      break;
    }
    case 'html': {
      content = renderHtml(data);
      break;
    }
    case 'audio': {
      content = renderAudioPlayer(data);
      break;
    }
    case 'broadcast': {
      content = renderBroadcast(data);
      break;
    }
    default: {
      console.warn('Unkown embed type ' + data[0].embed_type);
      break;
    }
  }

  return <View {...props}>{content}</View>;
};

export default React.memo(embed);
