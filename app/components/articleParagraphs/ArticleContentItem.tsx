import React from 'react';
import {ArticleEmbedType} from '../../api/Types';
import {ArticleSelectableItem} from '../../screens/article/ArticleContentComponent';
import {checkEqual} from '../../util/LodashEqualityCheck';
import ArticleEmbed from './embeded/ArticleEmbed';
import ArticleParagraph from './paragraph/ArticleParagraph';
import {useTheme} from '../../Theme';

interface Props {
  data: {
    p?: string;
    embed?: ArticleEmbedType[];
  };
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const ArticleContentItem: React.FC<React.PropsWithChildren<Props>> = ({data, itemPressHandler}) => {
  const {simplyfied} = useTheme();
  const {p, embed} = data;

  return (
    <>
      {!!p && (
        <ArticleParagraph
          htmlText={p}
          textSize={simplyfied ? 20 : undefined}
          lineHeight={simplyfied ? 40 : undefined}
        />
      )}
      {embed && !simplyfied && <ArticleEmbed embedArray={embed} itemPressHandler={itemPressHandler} />}
    </>
  );
};

export default React.memo(ArticleContentItem, checkEqual);
