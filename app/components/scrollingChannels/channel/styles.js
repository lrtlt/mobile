import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    margin: 2,
    borderRadius: 4,
    width: '$tvItemWidth',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  coverContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  coverContentContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  cover: {
    width: '100%',
    aspectRatio: 0.66,
  },
  channelImageContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderBottomEndRadius: 4,
    alignSelf: 'flex-start',
  },
  mediaIndicatorContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaIndicator: {
    opacity: 0.8,
    width: '$mediaIndicatorSize',
    height: '$mediaIndicatorSize',
    paddingStart: 4,
    borderRadius: '$mediaIndicatorSize / 2',
  },
  channelTitleContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    alignItems: 'center',
  },
  channelTitle: {
    color: '$textColor',
    fontSize: '$tvChannelTitleTextSize',
    textTransform: 'uppercase',
    paddingStart: 8,
    fontFamily: 'SourceSansPro-Regular',
  },
  title: {
    width: '100%',
    fontSize: '$tvTitleTextSize',
    color: '$titleTextColor',
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  timeText: {
    opacity: 0.8,
    color: '$textColor',
    fontSize: '$tvTimeTextSize',
    fontFamily: 'SourceSansPro-Regular',
    borderRadius: 4,
    padding: 3,
    margin: 8,
    alignSelf: 'flex-end',
    backgroundColor: '$tvBackgroundColor',
  },

  bottomBarContainer: {
    width: '100%',
    height: '$tvBarHeight',
    borderBottomStartRadius: 4,
    borderBottomEndRadius: 4,
  },

  bottomBar: {
    width: '100%',
    height: '$tvBarHeight',
    position: 'absolute',
  },

  bottomBarOverlay: {
    height: '$tvBarHeight',
    position: 'absolute',
  },
});
