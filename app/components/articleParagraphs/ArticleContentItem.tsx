import React from 'react';
import {ArticleEmbedType} from '../../api/Types';
import {ArticleSelectableItem} from '../../screens/article/ArticleContentComponent';
import {checkEqual} from '../../util/LodashEqualityCheck';
import ArticleEmbed from './embeded/ArticleEmbed';
import ArticleParagraph from './paragraph/ArticleParagraph';

interface Props {
  data: {
    p?: string;
    embed?: ArticleEmbedType[];
  };
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const ArticleContentItem: React.FC<Props> = ({data, itemPressHandler}) => {
  const {p, embed} = data;

  return (
    <>
      {Boolean(p) && <ArticleParagraph htmlText={p} />}
      {embed && <ArticleEmbed embedArray={embed} itemPressHandler={itemPressHandler} />}
    </>
  );
};

export default React.memo(ArticleContentItem, checkEqual);
