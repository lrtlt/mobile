import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {isMediaArticle} from '../../api/Types';
import {ScreenLoader, ScreenError, VideoComponent} from '../../components';
import VideoCover from '../../components/videoComponent/VideoCover';
import useArticleAnalytics from '../article/useArticleAnalytics';
import {useTheme} from '../../Theme';
import {useArticle} from '../../api/hooks/useArticle';

const VIDEO_ASPECT_RATIO = 9 / 16;
const BORDER_RADIUS = 8;
const FADE_DURATION = 1000;

const VerticalVideoWrapper: React.FC<{id: number | string; isActive: boolean}> = ({id, isActive}) => {
  const {strings} = useTheme();

  const {data, isLoading, isError} = useArticle(id, true);

  const article = data?.article;

  useArticleAnalytics({
    article: article,
  });

  const coverOpacity = useSharedValue(1);

  useEffect(() => {
    coverOpacity.value = withTiming(isActive ? 0 : 1, {duration: FADE_DURATION});
  }, [isActive, coverOpacity]);

  const coverAnimatedStyle = useAnimatedStyle(() => ({
    opacity: coverOpacity.value,
  }));

  if (isLoading) {
    return <ScreenLoader />;
  }
  if (isError) {
    return <ScreenError text={strings.error_no_connection} />;
  }

  if (isMediaArticle(article)) {
    return (
      <View style={styles.container}>
        {isActive && (
          <VideoComponent
            style={styles.media}
            autoPlay={true}
            loop={true}
            streamUrl={article.get_playlist_url}
            mediaId={article.id.toString()}
            title={article.title}
            minifyEnabled={false}
            backgroundImage=""
            cover={article.main_photo}
            backgroundAudioEnabled={false}
            aspectRatio={VIDEO_ASPECT_RATIO}
          />
        )}
        <Animated.View
          style={[StyleSheet.absoluteFill, coverAnimatedStyle]}
          pointerEvents={isActive ? 'none' : 'auto'}>
          <VideoCover aspectRatio={VIDEO_ASPECT_RATIO} {...article.main_photo} />
        </Animated.View>
      </View>
    );
  } else {
    return <ScreenError text={strings.articleError} />;
  }
};

export default VerticalVideoWrapper;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
  },
});
