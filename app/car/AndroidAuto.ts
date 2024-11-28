import TrackPlayer, {
  AndroidAutoBrowseTree,
  AndroidAutoContentStyle,
  PitchAlgorithm,
  Track,
  TrackType,
} from 'react-native-track-player';
import {
  fetchArticle,
  fetchCarCategoryPlaylist,
  fetchCarLivePlaylist,
  fetchCarNewestPlaylist,
  fetchCarPodcasts,
  fetchCarRecommendedPlaylist,
} from '../api';
import {fetchStreamData} from '../components/videoComponent/fetchStreamData';
import {CarPlayPodcastItem, isMediaArticle} from '../api/Types';
import {CategoryListItem, PlayListItem} from './types';
import {IMG_SIZE_XS, buildArticleImageUri, buildImageUri} from '../util/ImageUtil';
import {
  SQUARE_LRT_KLASIKA,
  SQUARE_LRT_LITHUANICA,
  SQUARE_LRT_OPUS,
  SQUARE_LRT_PLUS,
  SQUARE_LRT_RADIJAS,
  SQUARE_LRT_TV,
} from '../constants';

const TAB_DEBOUNCE_TIME = 30 * 1000;

export const TAB_RECOMMENDED = 'Siūlome';
export const TAB_LIVE = 'Tiesiogiai';
export const TAB_NEWEST = 'Naujausi';
export const TAB_PODCASTS = 'Laidos';

let debounceCache: {
  [key: string]: number;
} = {};

let playLists: {
  [key: string]: Track[];
} = {};

let podcasts: CarPlayPodcastItem[] = [];

let mediaBrowser: AndroidAutoBrowseTree = {
  '/': [
    {
      mediaId: TAB_RECOMMENDED,
      title: TAB_RECOMMENDED,
      //   subtitle: 'tab subtitle',
      playable: '1',
      childrenPlayableContentStyle: String(AndroidAutoContentStyle.List),
      childrenBrowsableContentStyle: String(AndroidAutoContentStyle.Grid),
    },
    {
      mediaId: TAB_LIVE,
      title: TAB_LIVE,
      //   subtitle: 'tab subtitle',
      playable: '1',
      childrenPlayableContentStyle: String(AndroidAutoContentStyle.List),
      childrenBrowsableContentStyle: String(AndroidAutoContentStyle.Grid),
    },
    {
      mediaId: TAB_NEWEST,
      title: TAB_NEWEST,
      //   subtitle: 'tab subtitle',
      playable: '1',
      childrenPlayableContentStyle: String(AndroidAutoContentStyle.List),
      childrenBrowsableContentStyle: String(AndroidAutoContentStyle.Grid),
    },
    {
      mediaId: TAB_PODCASTS,
      title: TAB_PODCASTS,
      //   subtitle: 'tab subtitle',
      playable: '1',
      childrenPlayableContentStyle: String(AndroidAutoContentStyle.List),
      childrenBrowsableContentStyle: String(AndroidAutoContentStyle.List),
    },
  ],
  // tab1: [
  //   {
  //     mediaId: '1',
  //     ...
  //   },
  // ],
};

const withDebounce = (fn: Function, key: string, time: number) => (p1?: any) => {
  if (!Boolean(debounceCache[key]) || Date.now() > debounceCache[key] + time) {
    debounceCache[key] = Date.now();
    fn(p1);
  }
};

export const onHomeOpenned = () => {
  if (mediaBrowser[TAB_RECOMMENDED]) {
    //Already loaded
  } else {
    onRecommendedTabOpened();
  }
};

export const onRecommendedTabOpened = withDebounce(
  async () => {
    fetchCarRecommendedPlaylist().then((data) => {
      if (data?.length) {
        playLists = {
          ...playLists,
          [TAB_RECOMMENDED]: data.map((item) => ({
            title: item.title,
            url: item.streamUrl,
            artwork: item.cover,
            isLiveStream: false,
            pitchAlgorithm: PitchAlgorithm.Voice,
            type: TrackType.HLS,
          })),
        };

        mediaBrowser = {
          ...mediaBrowser,
          [TAB_RECOMMENDED]: data.map((item, i) => ({
            mediaId: String(i),
            title: item.title,
            // subtitle: item.content,
            playable: '0',
            iconUri: item.cover,
            mediaUri: item.streamUrl,
            groupTitle: TAB_RECOMMENDED,
          })),
        };
        TrackPlayer.setBrowseTree(mediaBrowser);
      }
    });
  },
  TAB_RECOMMENDED,
  TAB_DEBOUNCE_TIME,
);

export const onLiveTabOpened = withDebounce(
  async () => {
    fetchCarLivePlaylist()
      .then((response) =>
        Promise.all(
          response.tvprog?.items?.map((channel) =>
            fetchStreamData({
              url: channel.stream_url,
              title: channel.channel_title,
              prioritizeAudio: true,
              //Return channel id as poster so we can map it to the actual image later
              poster: channel.channel_id.toString(),
            }),
          ) || [],
        ),
      )
      .then((data) => {
        if (data?.length) {
          playLists = {
            ...playLists,
            [TAB_LIVE]: data.map((item) => ({
              title: item.channelTitle ?? item.title,
              url: item.streamUri,
              artwork: getImageByChannelId(item.poster),
              isLiveStream: true,
              pitchAlgorithm: PitchAlgorithm.Voice,
              type: TrackType.HLS,
            })),
          };

          mediaBrowser = {
            ...mediaBrowser,
            [TAB_LIVE]: data.map((item, i) => ({
              mediaId: String(i),
              title: item.channelTitle ?? item.title,
              playable: '0',
              iconUri: getImageByChannelId(item.poster),
              mediaUri: item.streamUri,
              groupTitle: TAB_LIVE,
            })),
          };
          TrackPlayer.setBrowseTree(mediaBrowser);
        }
      });
  },
  TAB_LIVE,
  TAB_DEBOUNCE_TIME,
);

export const onNewestTabOpened = withDebounce(
  async () => {
    fetchCarNewestPlaylist().then((data) => {
      if (data?.length) {
        playLists = {
          ...playLists,
          [TAB_NEWEST]: data.map((item) => ({
            title: item.title,
            url: item.streamUrl,
            artwork: item.cover,
            isLiveStream: false,
            pitchAlgorithm: PitchAlgorithm.Voice,
            type: TrackType.HLS,
          })),
        };

        mediaBrowser = {
          ...mediaBrowser,
          [TAB_NEWEST]: data.map((item, i) => ({
            mediaId: String(i),
            title: item.title,
            // subtitle: item.content,
            playable: '0',
            iconUri: item.cover,
            mediaUri: item.streamUrl,
            groupTitle: TAB_NEWEST,
          })),
        };
        TrackPlayer.setBrowseTree(mediaBrowser);
      }
    });
  },
  TAB_NEWEST,
  TAB_DEBOUNCE_TIME,
);

export const onPodcastsTabOpened = withDebounce(
  async () => {
    if (mediaBrowser[TAB_PODCASTS]) {
      //Already loaded
      return;
    }

    const items = await fetchCarPodcasts(1000).then((data) => {
      if (data.items.length) {
        // data.items.forEach((item) => {
        //   item.title = item.title.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
        // });
        data.items.sort((a, b) => a.title.localeCompare(b.title));
        return data.items;
      }
      return [];
    });

    podcasts = items;

    mediaBrowser = {
      ...mediaBrowser,
      [TAB_PODCASTS]: items.map((item, i) => ({
        mediaId: `podcast-${i}`,
        title: item.title,
        playable: '1',
        // iconUri: item.cover,
        // mediaUri: item.streamUrl,
        groupTitle: TAB_PODCASTS,
      })),
    };
    TrackPlayer.setBrowseTree(mediaBrowser);
  },
  TAB_PODCASTS,
  TAB_DEBOUNCE_TIME,
);

export const onItemSelected = async (mediaId: string, tabName: string) => {
  if (/^\d+$/.test(mediaId)) {
    //mediaId is a number so this is a top level playlist item
    await TrackPlayer.setQueue(playLists[tabName]);
    await TrackPlayer.skip(Number(mediaId));
    TrackPlayer.play();
  }

  if (mediaId.startsWith('article-')) {
    const articleId = mediaId.split('-')[1];
    const episode = await fetchArticle(articleId).then((data) => {
      const article = data?.article;
      if (isMediaArticle(article)) {
        const playListItem: PlayListItem = {
          id: articleId,
          text: article.title,
          detailText: article.date,
          imgUrl: buildArticleImageUri(IMG_SIZE_XS, article?.main_photo?.path) as any,
          streamUrl: article.stream_url,
        };
        return playListItem;
      }
    });

    if (!episode) {
      console.warn('Error while fetching stream info for article', articleId);
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
        type: TrackType.HLS,
        isLiveStream: item.isLiveStream,
      })),
    );
    await TrackPlayer.play();
  }
};

export const onPodcastSelect = withDebounce(
  async (mediaId: string) => {
    if (mediaBrowser[mediaId]) {
      //Already loaded
      return;
    }

    const podcast = podcasts[Number(mediaId.split('-')[1])];
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

    mediaBrowser = {
      ...mediaBrowser,
      [mediaId]: items.map((item, i) => ({
        mediaId: `article-${item.articleId}`,
        title: item.text,
        subtitle: item.detailText,
        playable: '0',
        iconUri: item.imgUrl,
        // mediaUri: item.streamUrl,
        groupTitle: podcast.title,
      })),
    };
    TrackPlayer.setBrowseTree(mediaBrowser);
  },
  'podcast',
  2000,
);

const getImageByChannelId = (channelId?: string) => {
  switch (channelId) {
    case '1': {
      return SQUARE_LRT_TV;
    }
    case '2': {
      return SQUARE_LRT_PLUS;
    }
    case '3': {
      return SQUARE_LRT_LITHUANICA;
    }
    case '5': {
      return SQUARE_LRT_KLASIKA;
    }
    case '6': {
      return SQUARE_LRT_OPUS;
    }
    default: {
      return SQUARE_LRT_RADIJAS;
    }
  }
};
