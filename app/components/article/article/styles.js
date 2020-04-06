import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';

const getScrollingArticleMaxWidth = () => {
  const dim = Dimensions.get('window');
  const smallerDim = Math.min(dim.width, dim.height);
  return smallerDim * 0.7;
};

const styleSingle = {
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    backgroundColor: '$greyBackground',
    aspectRatio: 3 / 2,
  },
  categoryTitle: {
    color: '$categoryTitleTextColor',
    fontSize: '$categoryTextSize',
    paddingEnd: 6,
    fontFamily: 'SourceSansPro-Regular',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    paddingTop: '$categoryPaddingTop',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateContainer: {
    flexDirection: 'row',
    paddingTop: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    color: '$titleTextColor',
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: '$titleTextSize',
  },
  subtitle: {
    color: '$subtitleColor',
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 2,
    fontSize: 14,
  },
  mediaIndicator: {
    width: '$mediaIndicatorSize',
    height: '$mediaIndicatorSize',
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: '$mediaIndicatorSize / 2',
  },
  bottomBadgeRow: {
    width: '100%',
    paddingTop: 8,
    flexDirection: 'row',
  },
  photoBadge: {
    borderRadius: 4,
  },
  badgeSpace: {
    width: 8,
  },
  mediaIconContainer: {
    paddingEnd: 8,
  },
};

const styleMulti = {
  ...styleSingle,
  title: {
    color: '$textColor',
    marginTop: 8,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: '$titleTextSizeSmall',
  },
};

const styleMultiScroll = {
  ...styleSingle,
  container: {
    width: getScrollingArticleMaxWidth(),
  },
  title: {
    color: '$textColor',
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: '$titleTextSizeMedium',
  },
};

const stylesSingle = EStyleSheet.create(styleSingle);
const stylesMulti = EStyleSheet.create(styleMulti);
const stylesMultiScroll = EStyleSheet.create(styleMultiScroll);

export { stylesSingle, stylesMulti, stylesMultiScroll };
