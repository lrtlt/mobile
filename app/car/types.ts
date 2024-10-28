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
  imgUrl?: string;
  streamUrl: string;
  isLiveStream?: boolean;
  isDisabled?: boolean;
};
