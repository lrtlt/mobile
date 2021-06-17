import React from 'react';
import {StyleSheet} from 'react-native';
import {ArticlePhotoType} from '../../../api/Types';
import {ArticlePhoto, TouchableDebounce} from '../../../components';
import {ArticleSelectableItem} from '../ArticleContentComponent';

interface Props {
  data: ArticlePhotoType;
  contentWidth: number;
  itemPressHandler: (item: ArticleSelectableItem) => void;
}

const ArticleMainPhoto: React.FC<Props> = ({contentWidth, data, itemPressHandler}) => {
  return (
    <TouchableDebounce
      onPress={() =>
        itemPressHandler({
          type: 'photo',
          item: data,
        })
      }>
      <ArticlePhoto
        style={styles.photo}
        photo={data}
        progressive={true}
        imageAspectRatio={1.5}
        expectedWidth={contentWidth}
      />
    </TouchableDebounce>
  );
};

export default ArticleMainPhoto;

const styles = StyleSheet.create({
  photo: {
    width: '100%',
  },
});
