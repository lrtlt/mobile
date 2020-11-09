import {store} from '../redux/store';

const BASE_IMG_URL = 'https://www.lrt.lt';

export const IMG_SIZE_XXS = {width: 150, height: 84, aspectRatio: 1.78};
export const IMG_SIZE_XS = {width: 282, height: 158, aspectRatio: 1.78};
export const IMG_SIZE_S = {width: 393, height: 221, aspectRatio: 1.78};
export const IMG_SIZE_M = {width: 615, height: 345, aspectRatio: 1.78};
export const IMG_SIZE_L = {width: 756, height: 425, aspectRatio: 1.78};

export const IMG_SIZE_XL = {width: 756, height: 425, aspectRatio: 1.78};
export const IMG_SIZE_XXL = {width: 1287, height: 836, aspectRatio: 1.54};

/**
 * Maximum available scale factor in percent
 * Where 1.0 = 100%
 */

const sizes = [IMG_SIZE_XXS, IMG_SIZE_XS, IMG_SIZE_S, IMG_SIZE_M, IMG_SIZE_L, IMG_SIZE_XL];

//Finds the image size for given width by finding smallest width offset.
export const getImageSizeForWidth = (width) => {
  const MAX_AVAILABLE_SCALE_FACTOR = store.getState().config.imageMaxScaleFactor;

  return (
    sizes.find((s) => {
      const maxAvailableOffset = s.width - s.width * (1.0 - MAX_AVAILABLE_SCALE_FACTOR);
      return s.width + maxAvailableOffset >= width;
    }) || IMG_SIZE_XL
  );
};

export const buildImageUri = (size, prefix, postfix) => {
  return BASE_IMG_URL + prefix + size.width + 'x' + size.height + postfix;
};

export const buildArticleImageUri = (size, url) => {
  const s = size.width + 'x' + size.height;
  return BASE_IMG_URL + url.replace('{WxH}', s);
};
