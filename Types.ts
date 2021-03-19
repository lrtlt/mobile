import {ScreenStackHeaderConfigProps} from 'react-native-screens';
import {ROUTE_TYPE_HOME, ROUTE_TYPE_TYPE_MEDIA} from './app/api/Types';
import {ARTICLE_TYPE_AUDIO, ARTICLE_TYPE_TEXT, ARTICLE_TYPE_VIDEO} from './app/constants';

export type HomePageType = typeof ROUTE_TYPE_HOME | typeof ROUTE_TYPE_TYPE_MEDIA;

export type ArticleType = typeof ARTICLE_TYPE_TEXT | typeof ARTICLE_TYPE_AUDIO | typeof ARTICLE_TYPE_VIDEO;

export type Article = {
  id: number;
  title: string;
  subtitle?: string;
  category_title: string;
  channel_logo?: string;
  age_restriction?: string;
  article_type?: ArticleType;
  photo_aspectratio?: string;
  channel_bg_img?: string;
  img_path_prefix?: string;
  img_path_postfix?: string;
  category_id?: number;
  category_url?: string;
  category_img_path_prefix?: string;
  category_img_path_postfix?: string;
  url: string;
  read_count: number;
  channel_url?: string;
  media_duration?: string;
  photo_count?: number;
  photo_horizontal?: 1 | 0;
  photo_horizontal_small?: 1 | 0;
  photo?: 1 | string;
  photo_title?: string;
  lrt_show_id?: number;
  channel_title?: string;
  item_time?: string;
  item_date?: string;
  fb_badge?: 1 | 0;
  reactions?: string;
  article_has_audiovideo?: 1 | 0;
  has_subtitles?: 1 | 0;
  is_video?: 1 | 0;
  is_audio?: 1 | 0;
};
