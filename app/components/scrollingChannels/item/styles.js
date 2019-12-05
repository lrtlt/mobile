import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    margin: '$articlePadding',
    backgroundColor: '$tvBackgroundColor',
    borderRadius: 4,
    width: '$tvItemWidth',
    alignSelf: 'center',
  },

  content: {
    padding: '$tvPadding',
  },

  topHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  channelTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    color: '$textColor',
    fontSize: '$tvTimeTextSize',
    marginStart: 12,
    fontFamily: 'SourceSansPro-Regular',
  },

  title: {
    color: '$textColor',
    fontSize: '$tvTitleTextSize',
    lineHeight: 18,
    height: 36,
    marginTop: '$tvPadding',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-Regular',
  },

  bottomBarContainer: {
    width: '100%',
    height: '$tvBarHeight',
  },

  bottomBar: {
    width: '100%',
    borderBottomStartRadius: 8,
    height: '$tvBarHeight',
    borderBottomEndRadius: 8,
    position: 'absolute',
  },

  bottomBarOverlay: {
    borderBottomStartRadius: 8,
    height: '$tvBarHeight',
    borderBottomEndRadius: 8,
    position: 'absolute',
  },
});
