import {fetchArticle} from '../../../api';
import {ArticleContent, ArticleContentMedia, isMediaArticle} from '../../../api/Types';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import {MediaBaseData, MediaType} from './PlayerContext';

type PlaylistItem = {
  articleId: number;
  data?: ArticleContent;
};

const articleToMediaData = (article: ArticleContentMedia): MediaBaseData => ({
  uri: article.stream_url,
  title: article.title,
  poster: buildArticleImageUri(IMG_SIZE_M, article.main_photo.path),
  mediaType: article.is_video ? MediaType.VIDEO : MediaType.AUDIO,
  isLiveStream: false,
});

class ArticlePlaylist {
  private items: PlaylistItem[] = [];
  private currentIndex: number = -1;

  constructor(articleIds: number[], currentIndex?: number) {
    this.items = articleIds.map((id) => ({
      articleId: id,
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
      return articleToMediaData(current.data as ArticleContentMedia);
    }

    try {
      const response = await fetchArticle(this.items[this.currentIndex].articleId);
      const article = response.article;
      if (isMediaArticle(article)) {
        this.items[this.currentIndex].data = article;
        return articleToMediaData(article);
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
