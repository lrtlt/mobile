import {Platform} from 'react-native';
import {fetchArticle, fetchCounter} from '../../../../api';
import {ArticleContentMedia, isMediaArticle} from '../../../../api/Types';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../../util/ImageUtil';
import {MediaBaseData, MediaType} from '../PlayerContext';
import {Playlist, PlaylistItem} from './Playlist';
import {usePlaybackProgressStore} from '../../../../state/playback_progress_store';
import {PLAYBACK_PROGRESS_MIN_POSITION_SEC} from '../../../../constants';

const resolveResumeStartTime = (articleId: number): number | undefined => {
  const entry = usePlaybackProgressStore.getState().entries[articleId];
  if (!entry || entry.completed) return undefined;
  if (entry.positionSec < PLAYBACK_PROGRESS_MIN_POSITION_SEC) return undefined;
  return entry.positionSec;
};

const articleToMediaData = (article: ArticleContentMedia): MediaBaseData => ({
  uri: article.stream_url,
  title: article.title,
  poster:
    buildArticleImageUri(IMG_SIZE_M, article.main_photo?.path) ??
    buildArticleImageUri(IMG_SIZE_M, article.category_img_info?.path),
  mediaType: article.is_video ? MediaType.VIDEO : MediaType.AUDIO,
  isLiveStream: false,
  startTime: resolveResumeStartTime(article.id),
  articleId: article.id,
  category_id: article.category_id,
});

class ArticlePlaylist implements Playlist {
  private items: PlaylistItem[] = [];
  private currentIndex: number = -1;

  constructor(articleIds: number[], currentIndex?: number) {
    this.items = articleIds.map((id) => ({
      id: id,
    }));

    if (currentIndex && currentIndex != -1) {
      this.currentIndex = currentIndex;
    } else {
      this.currentIndex = articleIds.length > 0 ? 0 : -1;
    }
  }

  getCurrent(): PlaylistItem | null {
    return this.currentIndex >= 0 ? this.items[this.currentIndex] : null;
  }

  async load(): Promise<MediaBaseData | null> {
    const current = this.getCurrent();
    if (!current) {
      return null;
    }

    if (current.data) {
      return current.data;
    }

    try {
      const response = await fetchArticle(this.items[this.currentIndex].id);
      const article = response.article;
      if (isMediaArticle(article)) {
        const mediaData = articleToMediaData(article);
        this.items[this.currentIndex].data = mediaData;
        fetchCounter(current.id, article.url, Platform.OS);
        return mediaData;
      }
    } catch (e) {
      console.log('Error fetching article', e);
    }
    return null;
  }

  next(): PlaylistItem | null {
    if (this.items.length === 0) {
      return null;
    }

    if (this.currentIndex >= this.items.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    return this.getCurrent();
  }

  previous(): PlaylistItem | null {
    if (this.items.length === 0) {
      return null;
    }

    if (this.currentIndex <= 0) {
      this.currentIndex = this.items.length - 1;
    } else {
      this.currentIndex--;
    }
    return this.getCurrent();
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export default ArticlePlaylist;
