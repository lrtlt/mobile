import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  ArticleEmbedArticleType,
  ArticleEmbedAudioType,
  ArticleEmbedBroadcastType,
  ArticleEmbedHTMLType,
  ArticleEmbedPhotoType,
  ArticleEmbedType,
  ArticleEmbedVideoType,
} from '../../../api/Types';
import {ArticleSelectableItem} from '../../../screens/article/ArticleContentComponent';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import EmbedArticles from './embedComponents/EmbedArticles';
import EmbedAudio from './embedComponents/EmbedAudio';
import EmbedBroadcast from './embedComponents/EmbedBroadcast';
import EmbedHTML from './embedComponents/EmbedHTML';
import EmbedPhotos from './embedComponents/EmbedPhotos';
import EmbedVideo from './embedComponents/EmbedVideo';

interface Props {
  embedArray: ArticleEmbedType[];
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const groupEmbedsByType = (data: ArticleEmbedType[]): ArticleEmbedType[][] => {
  const groupedEmbeds: ArticleEmbedType[][] = [];
  let i;
  for (i = 0; i < data.length; i++) {
    let j;
    const group: ArticleEmbedType[] = [];
    const currentType = data[i].embed_type;
    for (j = i; j < data.length; j++) {
      if (currentType === data[j].embed_type) {
        group.push(data[j]);
        i++;
      } else {
        break;
      }
    }
    i--;
    groupedEmbeds.push(group);
  }
  return groupedEmbeds;
};

const ArticleEmbed: React.FC<Props> = ({embedArray, itemPressHandler}) => {
  const embedsGroupedByType = useMemo(() => groupEmbedsByType(embedArray), [embedArray]);
  return (
    <View style={styles.container}>
      {embedsGroupedByType.map(
        useCallback(
          (e, index) => {
            if (e && e.length === 0) {
              console.warn('No embed data to render ArticleEmbed');
              return <View />;
            }

            switch (e[0].embed_type) {
              case 'article': {
                return (
                  <EmbedArticles
                    key={`embed-articles-${index}`}
                    data={e as ArticleEmbedArticleType[]}
                    itemPressHandler={itemPressHandler}
                  />
                );
              }
              case 'photo': {
                return (
                  <EmbedPhotos
                    key={`embed-photo-${index}`}
                    data={e as ArticleEmbedPhotoType[]}
                    itemPressHandler={itemPressHandler}
                  />
                );
              }
              case 'video': {
                return <EmbedVideo key={`embed-video-${index}`} data={e as ArticleEmbedVideoType[]} />;
              }
              case 'audio': {
                return <EmbedAudio key={`embed-audio-${index}`} data={e as ArticleEmbedAudioType[]} />;
              }
              case 'html': {
                return <EmbedHTML key={`embed-html-${index}`} data={e as ArticleEmbedHTMLType[]} />;
              }
              case 'broadcast': {
                return (
                  <EmbedBroadcast key={`embed-broadcast-${index}`} data={e as ArticleEmbedBroadcastType[]} />
                );
              }
              default: {
                console.warn('Unkown embed type ' + e[0]!.embed_type);
                return null;
              }
            }
          },
          [itemPressHandler],
        ),
      )}
    </View>
  );
};

export default React.memo(ArticleEmbed, checkEqual);

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
