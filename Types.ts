import {ROUTE_TYPE_HOME, ROUTE_TYPE_MEDIA} from './app/api/Types';
import {ARTICLE_TYPE_AUDIO, ARTICLE_TYPE_TEXT, ARTICLE_TYPE_VIDEO} from './app/constants';

export type HomePageType = typeof ROUTE_TYPE_HOME | typeof ROUTE_TYPE_MEDIA;

export type ArticleType = typeof ARTICLE_TYPE_TEXT | typeof ARTICLE_TYPE_AUDIO | typeof ARTICLE_TYPE_VIDEO;

export type Article = {
  id: number;
  title: string;
  subtitle?: string;
  category_title: string;
  age_restriction?: string;
  article_type?: ArticleType;
  photo_aspectratio?: string;
  channel_id?: number;
  channel_logo?: string;
  channel_url?: string;
  channel_bg_img?: string;
  channel_title?: string;

  img_path_prefix?: string;
  img_path_postfix?: string;
  category_id?: number;
  category_url?: string;
  category_img_path_prefix?: string;
  category_img_path_postfix?: string;
  url: string;
  read_count: number;
  summary?: string;
  media_duration?: string;
  media_duration_sec?: number;
  photo_count?: number;
  photo_horizontal?: 1 | 0;
  photo_horizontal_small?: 1 | 0;
  photo?: string;
  photo_title?: string;
  lrt_show_id?: number;
  item_time?: string;
  item_date?: string;
  date?: string;
  fb_badge?: 1 | 0;
  reactions?: string;
  article_has_audiovideo?: 1 | 0;
  has_subtitles?: 1 | 0;
  is_video?: 1 | 0;
  is_audio?: 1 | 0;
  time_diff?: number | null;
  time_diff_day: number | null;
  time_diff_hour: number | null;
  badge_id: string | number | null;
  badge_class: 'badge-danger' | 'badge-primary' | 'badge-secondary' | 'badge-warning' | 'badge-info' | null;
  badge_title: string | null;
  branch0_term?: string;
  branch0_title?: string;
  branch1_term?: string;
  branch1_title?: string;
  hero_photo?: {
    w_h: string;
    title: string;
    img_path_prefix: string;
    path: string;
    author: string;
    img_path_postfix: string;
  };
  season_url?: string;
  lrt_season_id?: string;
  lrt_season_title?: string;
};
