import {CarPlay, ListTemplate} from 'react-native-carplay';
import TrackPlayer, {PitchAlgorithm} from 'react-native-track-player';
import {CategoryListItem, PlayListItem} from '../types';
import {carPlayNowPlayingTemplate} from '../nowPlaying/createNowPlayingTemplate';
import {CarPlayPodcastItem, isMediaArticle} from '../../api/Types';
import {fetchArticle, fetchCarCategoryPlaylist} from '../../api';
import {IMG_SIZE_XS, buildArticleImageUri, buildImageUri} from '../../util/ImageUtil';
import {debounce} from 'lodash';
import Gemius from 'react-native-gemius-plugin';
import analytics from '@react-native-firebase/analytics';

const sendAnalyticsEvent = debounce((eventName: string) => {
  Gemius.sendPageViewedEvent(eventName);
  analytics().logEvent(eventName);
}, 200);

class CategoryTemplate {
  template?: ListTemplate;

  async onItemSelectHandler(item: CategoryListItem) {
    console.log('### onEpisodeSelected', item.articleId);

    const episode = await fetchArticle(item.articleId).then((data) => {
      const article = data?.article;
      if (isMediaArticle(article)) {
        const playListItem: PlayListItem = {
          id: item.articleId,
          text: article.title,
          detailText: article.date,
          imgUrl: buildArticleImageUri(IMG_SIZE_XS, article?.main_photo?.path) as any,
          streamUrl: article.stream_url,
        };
        return playListItem;
      }
    });

    if (!episode) {
      console.warn('Error while fetching stream info for article', item.articleId);
      return;
    }

    //TODO: load more episodes??
    const episodes = [episode];

    await TrackPlayer.setQueue(
      episodes.map((item) => ({
        url: item.streamUrl,
        artwork: item.imgUrl,
        title: item.text,
        pitchAlgorithm: PitchAlgorithm.Voice,
        isLiveStream: item.isLiveStream,
      })),
    );
    await TrackPlayer.play();
    CarPlay.pushTemplate(carPlayNowPlayingTemplate, true);
  }

  async build(podcast: CarPlayPodcastItem) {
    const items = await fetchCarCategoryPlaylist(podcast.id).then((data) => {
      if (data?.articles) {
        const episodes: CategoryListItem[] = data.articles.map((item) => ({
          articleId: item.id,
          text: item.title,
          detailText: item.item_date,
          imgUrl: buildImageUri(IMG_SIZE_XS, item.img_path_prefix, item.img_path_postfix),
        }));
        return episodes;
      }
      return [];
    });

    if (this.template) {
      this.template.config.onItemSelect = undefined;
    }

    sendAnalyticsEvent('carplay_podcast_open_' + podcast.id);

    this.template = new ListTemplate({
      title: podcast.title,
      id: 'lrt-list-template-category-' + podcast.id,
      sections: [
        {
          items:
            items?.map((item) => ({
              text: item.text,
              detailText: item.detailText,
              //   imgUrl: item.imgUrl as any,
            })) ?? [],
        },
      ],
      onItemSelect: async ({index}) => {
        this.onItemSelectHandler(items[index]);
      },
    });
    return this.template;
  }
}

const instance = new CategoryTemplate();
export default instance;
