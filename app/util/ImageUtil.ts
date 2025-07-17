import {Article} from '../../Types';
import {DEFAULT_ARTICLE_IMAGE} from '../constants';

export const BASE_IMG_URL = 'https://www.lrt.lt';

export type ImageSize = {
  width: number;
  height: number;
  aspectRatio: number;
};

export const IMG_SIZE_XXS: ImageSize = {width: 150, height: 84, aspectRatio: 1.78};
export const IMG_SIZE_XS: ImageSize = {width: 282, height: 158, aspectRatio: 1.78};
export const IMG_SIZE_S: ImageSize = {width: 393, height: 221, aspectRatio: 1.78};
export const IMG_SIZE_M: ImageSize = {width: 615, height: 345, aspectRatio: 1.78};
export const IMG_SIZE_L: ImageSize = {width: 756, height: 425, aspectRatio: 1.78};
export const IMG_SIZE_XL: ImageSize = {width: 756, height: 425, aspectRatio: 1.78};
export const IMG_SIZE_XXL: ImageSize = {width: 1287, height: 836, aspectRatio: 1.54};

const sizes = [IMG_SIZE_XXS, IMG_SIZE_XS, IMG_SIZE_S, IMG_SIZE_M, IMG_SIZE_L, IMG_SIZE_XL];

//Finds the image size for given width by finding smallest width offset.
export const getImageSizeForWidth = (width: number) => {
  return (
    sizes.find((s) => {
      return s.width >= width + 50;
    }) || IMG_SIZE_S
  );
};

export const buildImageUri = (size: ImageSize, prefix?: string, postfix?: string) => {
  return BASE_IMG_URL + prefix + size.width + 'x' + size.height + postfix;
};

export const buildArticleImageUri = (size: ImageSize, url?: string) => {
  if (url) {
    const s = size.width + 'x' + size.height;
    return BASE_IMG_URL + url.replace('{WxH}', s);
  } else {
    return undefined;
  }
};

export const getArticleImageUri = (article: Article, size: ImageSize): string | undefined => {
  let imgUri;
  try {
    if (article?.img_path_prefix && article?.img_path_postfix) {
      imgUri = buildImageUri(size, article.img_path_prefix, article.img_path_postfix);
    } else if (article?.photo) {
      if (article?.photo?.indexOf('{WxH}') !== -1) {
        imgUri = buildArticleImageUri(size, article.photo) ?? DEFAULT_ARTICLE_IMAGE;
      } else {
        imgUri = article.photo ?? DEFAULT_ARTICLE_IMAGE;
      }
    }
  } catch (error) {
    // Fail silently if image URI building fails
    imgUri = DEFAULT_ARTICLE_IMAGE;
  }
  console.log('getArticleImageUri', imgUri, size);
  return imgUri;
};
