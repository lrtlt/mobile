import React, {useCallback} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {ArticleEmbedPhotoType} from '../../../../api/Types';
import {ArticleSelectableItem} from '../../../../screens/article/ArticleContentComponent';
import ArticlePhoto from '../../../articlePhoto/ArticlePhoto';
import TouchableDebounce from '../../../touchableDebounce/TouchableDebounce';

interface Props {
  data: ArticleEmbedPhotoType[];
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const EmbedPhotos: React.FC<React.PropsWithChildren<Props>> = ({data, itemPressHandler}) => {
  const screenWidth = useWindowDimensions().width;
  return (
    <View>
      {data.map(
        useCallback(
          (item, i) => {
            return (
              <View style={styles.container} key={i}>
                <TouchableDebounce onPress={() => itemPressHandler({type: 'photo', item: item.el})}>
                  <ArticlePhoto photo={item.el} expectedWidth={screenWidth} />
                </TouchableDebounce>
              </View>
            );
          },
          [itemPressHandler, screenWidth],
        ),
      )}
    </View>
  );
};

export default EmbedPhotos;

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
