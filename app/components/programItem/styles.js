import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '$programItemColor',
  },
  elapsedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    backgroundColor: '$programProgressColor',
  },
  timeText: {
    paddingEnd: 8,
    paddingStart: 8,
    padding: 4,
    height: '100%',
    paddingTop: 6,
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  titleText: {
    flex: 1,
    padding: 4,
    color: '$textColor',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 15,
  },
});
