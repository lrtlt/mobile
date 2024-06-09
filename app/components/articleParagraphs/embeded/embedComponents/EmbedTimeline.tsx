import React, {useCallback} from 'react';
import {ArticleEmbedTimelineType} from '../../../../api/Types';
import ArticleLiveFeed from '../../../../screens/article/liveFeed/ArticleLiveFeed';

interface Props {
  data: ArticleEmbedTimelineType[];
}

const EmbedTimeline: React.FC<React.PropsWithChildren<Props>> = ({data}) => {
  return (
    <>
      {data.map(
        useCallback(
          (item, i) => {
            const lastSegment = item.src.split('/').pop();
            return lastSegment ? <ArticleLiveFeed key={`${i}-${lastSegment}`} id={lastSegment} /> : null;
          },
          [data],
        ),
      )}
    </>
  );
};

export default EmbedTimeline;
