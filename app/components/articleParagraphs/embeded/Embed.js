import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import ArticlePhoto from '../../articlePhoto/ArticlePhoto';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import VideoComponent from '../../videoComponent/VideoComponent';

import {getSmallestDim} from '../../../util/UI';
import {VIDEO_ASPECT_RATIO} from '../../../constants';
import TextComponent from '../../text/Text';
import {useTheme} from '../../../Theme';
import AudioComponent from '../../audioComponent/AudioComponent';
import SafeAutoHeightWebView from '../../safeWebView/SafeAutoHeightWebView';

const getScreenWidth = () => Dimensions.get('window').width;

const Embed = (props) => {
  const {colors, strings} = useTheme();
  const {data, pressHandler} = props;

  const renderPhotos = () => {
    const content = data.map((item, i) => {
      return (
        <View style={styles.embededPhotoContainer} key={i}>
          <TouchableDebounce onPress={() => pressHandler({type: 'photo', item: item.el})}>
            <ArticlePhoto photo={item.el} expectedWidth={getScreenWidth()} />
          </TouchableDebounce>
        </View>
      );
    });
    return <View>{content}</View>;
  };

  const renderArticles = () => {
    const content = data.map((item, i) => {
      return (
        <View style={styles.embededArticleContainer} key={i}>
          <TouchableDebounce onPress={() => pressHandler({type: 'article', item: item.el})}>
            <TextComponent style={styles.embededArticleText} type="secondary">
              {item.el.title}
            </TextComponent>
          </TouchableDebounce>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{...styles.line, backgroundColor: colors.primary}} />
        <View style={styles.container}>
          <TextComponent style={styles.articleTitle}>{strings.embedArticleHeader}</TextComponent>
          {content}
        </View>
        <View style={{...styles.line, backgroundColor: colors.primary}} />
      </View>
    );
  };

  const renderVideoImage = () => {
    const content = data.map((item, i) => {
      return (
        <View style={styles.embededVideoContainer} key={i}>
          <VideoComponent
            style={styles.player}
            cover={item.el}
            streamUrl={item.el.get_playlist_url || item.el.get_streams_url}
            autoPlay={false}
          />
        </View>
      );
    });
    return <View>{content}</View>;
  };

  const renderHtml = () => {
    const width = getScreenWidth() - 12 * 2;

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

      const html = item.el.html;

      if (!html) {
        return null;
      }

      const formatted = html
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
        <SafeAutoHeightWebView
          key={i}
          style={{width}}
          containerStyle={styles.embededHtmlContainer}
          scrollEnabled={false}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={true}
          startInLoadingState={true}
          viewportContent={`width=${width}, user-scalable=no`}
          source={{html: formatted}}
        />
      );
    });
    return <View>{content}</View>;
  };

  const renderAudioPlayer = () => {
    //TODO implement rerecord_offset usage
    const {stream_url, id, title, record_offset} = data[0].el;
    return (
      <View style={styles.embededAudioContainer}>
        <AudioComponent
          style={styles.player}
          streamUri={stream_url}
          mediaId={id ? id.toString() : '-1'}
          title={title}
          autoStart={false}
        />
      </View>
    );
  };

  const renderBroadcast = () => {
    const content = data.map((item, i) => {
      return (
        <View style={styles.embededVideoContainer} key={i}>
          <VideoComponent
            style={styles.player}
            cover={item.el}
            streamUrl={item.el.get_streams_url}
            autoPlay={false}
          />
        </View>
      );
    });
    return <View>{content}</View>;
  };

  let content = null;
  switch (data[0].embed_type) {
    case 'photo': {
      content = renderPhotos();
      break;
    }
    case 'article': {
      content = renderArticles();
      break;
    }
    case 'video': {
      content = renderVideoImage();
      break;
    }
    case 'html': {
      content = renderHtml();
      break;
    }
    case 'audio': {
      content = renderAudioPlayer();
      break;
    }
    case 'broadcast': {
      content = renderBroadcast();
      break;
    }
    default: {
      console.warn('Unkown embed type ' + data[0].embed_type);
      break;
    }
  }

  return <View {...props}>{content}</View>;
};

export default Embed;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
  },
  line: {
    width: '100%',
    height: 1,
  },
  articleTitle: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  embededArticleContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  embededPhotoContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  embededHtmlContainer: {
    width: '100%',
  },
  embededVideoContainer: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  embededAudioContainer: {
    backgroundColor: 'black',
    aspectRatio: VIDEO_ASPECT_RATIO,
  },
  embededArticleText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 18,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
});
