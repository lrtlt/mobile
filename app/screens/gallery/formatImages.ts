import {ArticlePhoto} from '../../api/Types';

/**
 * Formats images array so that the element at given index starts at the beggening. Trailing images appended to the end of the array.
 * This is a workaround for issue in gallery swiper https://github.com/Luehang/react-native-gallery-swiper/issues/26
 */
export default (imagesArray: ArticlePhoto[], selectedIndex: number) => {
  if (selectedIndex === 0 || imagesArray.length <= 1) {
    return imagesArray;
  }

  const start = imagesArray.slice(selectedIndex, imagesArray.length);
  const end = imagesArray.slice(0, selectedIndex);
  return start.concat(end);
};
