import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    padding: '$articlePadding',
    width: '$tvLiveItemWidth',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '$tvLiveItemHeight',
  },
  mediaIndicator: {
    width: '$mediaIndicatorSize',
    height: '$mediaIndicatorSize',
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: '$mediaIndicatorSize / 2',
  },
  liveBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  title: {
    color: '$textColor',
    marginTop: '$articlePadding / 2',
    fontSize: '$tvLiveItemTextSize',
    fontFamily: 'SourceSansPro-Regular',
  },
});
