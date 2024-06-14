import {ImageSourcePropType} from 'react-native';

export type CarCategory = 'live' | 'newest';

export type CategoryListItem = {
  articleId: number;
  text: string;
  detailText?: string;
  imgUrl: string;
};

export type PlayListItem = {
  id: string | number;
  text: string;
  detailText?: string;
  image?: ImageSourcePropType;
  imgUrl?: string;
  streamUrl: string;
  isLiveStream?: boolean;
};
