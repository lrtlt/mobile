import {fetchRadiotekaArticleByUrl} from '../../../../api';
import {RadiotekaArticle} from '../../../../api/Types';
import {MediaBaseData, MediaType} from '../PlayerContext';
import {Playlist, PlaylistItem} from './Playlist';

const articleToMediaData = (article: RadiotekaArticle): MediaBaseData => ({
  uri: article.playlist_item.file,
  title: article.title,
  poster: 'https://lrt.lt' + article.playlist_item.image,
  mediaType: MediaType.AUDIO,
  isLiveStream: false,
});

class GenrePlaylist implements Playlist {
  private items: PlaylistItem[] = [];
  private currentIndex: number = -1;

  constructor(articleUrls: string[], currentIndex?: number) {
    this.items = articleUrls.map((id) => ({
      id: id,
    }));

    if (currentIndex && currentIndex != -1) {
      this.currentIndex = currentIndex;
    } else {
      this.currentIndex = articleUrls.length > 0 ? 0 : -1;
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
      const response = await fetchRadiotekaArticleByUrl(this.items[this.currentIndex].id as string);
      const mediaData = articleToMediaData(response);
      this.items[this.currentIndex].data = mediaData;
      return mediaData;
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

export default GenrePlaylist;
