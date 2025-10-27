import {View} from 'react-native';
import {isMediaArticle} from '../../api/Types';
import {ScreenLoader, ScreenError, VideoComponent} from '../../components';
import VideoCover from '../../components/videoComponent/VideoCover';
import useArticleAnalytics from '../article/useArticleAnalytics';
import {useTheme} from '../../Theme';
import {useArticle} from '../../api/hooks/useArticle';

const VIDEO_ASPECT_RATIO = 9 / 16;
const BORDER_RADIUS = 8;

const VerticalVideoWrapper: React.FC<{id: number | string; isActive: boolean}> = ({id, isActive}) => {
  const {strings} = useTheme();

  const {data, isLoading, isError} = useArticle(id, true);

  const article = data?.article;

  useArticleAnalytics({
    article: article,
  });

  if (isLoading) {
    return <ScreenLoader />;
  }
  if (isError) {
    return <ScreenError text={strings.error_no_connection} />;
  }

  if (isMediaArticle(article)) {
    if (!isActive) {
      return (
        <View
          style={{
            width: '95%',
            aspectRatio: VIDEO_ASPECT_RATIO,
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden',
          }}>
          <VideoCover aspectRatio={VIDEO_ASPECT_RATIO} {...article.main_photo} />
        </View>
      );
    }

    return (
      <VideoComponent
        style={{
          aspectRatio: VIDEO_ASPECT_RATIO,
          width: '95%',
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
        }}
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
    );
  } else {
    return <ScreenError text={strings.articleError} />;
  }
};

export default VerticalVideoWrapper;
