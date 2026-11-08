import {Article} from '../../../../Types';

export type ChainItem = Article['chain_items'][number];

export type ChainItemTarget = Article & {scrollToLiveFeed?: boolean};

export const getChainItemTarget = (article: Article, item: ChainItem): ChainItemTarget => {
  switch (article.chain_option) {
    case 1:
      return item.id ? {...article, id: item.id, title: item.title, is_video: 0, is_audio: 0} : article;
    case 2:
      return {...article, scrollToLiveFeed: true};
    default:
      return article;
  }
};
